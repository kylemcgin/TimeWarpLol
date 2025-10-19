import requests
import sqlite3
import json
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# ==============================
# ⚙️ CONFIG
# ==============================
API_KEY = "RGAPI-8bcd486a-f967-4898-8c36-9bc4775dee7f"
GAME_NAME = "KenjaminFancyson"
TAG_LINE = "111"
REGIONAL_ROUTE = "americas"
headers = {"X-Riot-Token": API_KEY}

MAX_WORKERS = 5
MATCH_FETCH_COUNT = 20

# ==============================
# 🗃 DATABASE SETUP
# ==============================
conn = sqlite3.connect("league_matches.db", check_same_thread=False)
cur = conn.cursor()

# -- Players table (unique PUUID) --
cur.execute("""
CREATE TABLE IF NOT EXISTS players (
    puuid TEXT PRIMARY KEY,
    player_name TEXT,
    tag_line TEXT,
    region TEXT
)
""")

# -- Matches table (link to PUUID) --
cur.execute("""
CREATE TABLE IF NOT EXISTS matches (
    match_id TEXT PRIMARY KEY,
    puuid TEXT NOT NULL,
    game_creation INTEGER,
    game_duration INTEGER,
    queue_id INTEGER,
    player_name TEXT,
    champion TEXT,
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    kda REAL,
    cs INTEGER,
    cs_per_min REAL,
    vision_score INTEGER DEFAULT 0,
    team_id INTEGER,
    towers INTEGER,
    dragons INTEGER,
    barons INTEGER,
    win INTEGER,
    match_json TEXT,
    FOREIGN KEY (puuid) REFERENCES players (puuid)
)
""")
cur.execute("CREATE INDEX IF NOT EXISTS idx_matches_puuid ON matches (puuid)")
conn.commit()

# ==============================
# 🧪 GET PUUID
# ==============================
account_url = f"https://{REGIONAL_ROUTE}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{GAME_NAME}/{TAG_LINE}"
resp = requests.get(account_url, headers=headers)
if resp.status_code != 200:
    print(f"❌ Account lookup failed: {resp.status_code}")
    print(resp.text)
    exit()

puuid = resp.json()["puuid"]
print(f"✅ Got PUUID for {GAME_NAME}: {puuid}")

# ✅ Insert or update player in DB
cur.execute("""
INSERT OR IGNORE INTO players (puuid, player_name, tag_line, region)
VALUES (?, ?, ?, ?)
""", (puuid, GAME_NAME, TAG_LINE, REGIONAL_ROUTE))
conn.commit()

# ==============================
# 📝 GET MATCH IDS
# ==============================
ids_url = f"https://{REGIONAL_ROUTE}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={MATCH_FETCH_COUNT}"
ids_resp = requests.get(ids_url, headers=headers)
if ids_resp.status_code != 200:
    print(f"❌ Match ID fetch failed: {ids_resp.status_code}")
    print(ids_resp.text)
    exit()

match_ids = ids_resp.json()
print(f"📝 Found {len(match_ids)} recent matches")

# ==============================
# 🧠 FETCH & SAVE MATCH
# ==============================
def process_match(match_id):
    # -- Check cache --
    cur.execute("SELECT 1 FROM matches WHERE match_id = ?", (match_id,))
    if cur.fetchone():
        return f"⚡ Cached match {match_id} — skipped"

    match_url = f"https://{REGIONAL_ROUTE}.api.riotgames.com/lol/match/v5/matches/{match_id}"
    response = requests.get(match_url, headers=headers)
    if response.status_code != 200:
        return f"❌ Error {match_id}: {response.status_code}"

    match_data = response.json()
    info = match_data["info"]

    # Player stats
    player_stats = next((p for p in info["participants"] if p["puuid"] == puuid), None)
    if not player_stats:
        return f"❌ Player not found in match {match_id}"

    game_creation = info.get("gameCreation")
    game_duration = info.get("gameDuration", 1)
    queue_id = info.get("queueId")

    kills = player_stats["kills"]
    deaths = player_stats["deaths"] if player_stats["deaths"] != 0 else 1
    assists = player_stats["assists"]
    kda = round((kills + assists) / deaths, 2)
    vision_score = player_stats.get("visionScore", 0)

    cs = player_stats["totalMinionsKilled"] + player_stats.get("neutralMinionsKilled", 0)
    cs_per_min = round(cs / (game_duration / 60), 2) if game_duration > 0 else 0

    champion = player_stats["championName"]
    player_name = player_stats["summonerName"]
    team_id = player_stats["teamId"]
    win = 1 if player_stats["win"] else 0

    team_data = next((t for t in info["teams"] if t["teamId"] == team_id), None)
    towers = team_data["objectives"]["tower"]["kills"] if team_data else 0
    dragons = team_data["objectives"]["dragon"]["kills"] if team_data else 0
    barons = team_data["objectives"]["baron"]["kills"] if team_data else 0

    # Insert into DB
    cur.execute("""
        INSERT INTO matches (
            match_id, puuid, game_creation, game_duration, queue_id,
            player_name, champion, kills, deaths, assists, kda,
            cs, cs_per_min, vision_score, team_id, towers, dragons, barons, win, match_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        match_id, puuid, game_creation, game_duration, queue_id,
        player_name, champion, kills, deaths, assists, kda,
        cs, cs_per_min, vision_score, team_id, towers, dragons, barons, win, json.dumps(match_data)
    ))
    conn.commit()

    date_str = datetime.utcfromtimestamp(game_creation / 1000).strftime('%Y-%m-%d %H:%M:%S')
    return f"✅ Saved {match_id} | {champion} | {kills}/{deaths}/{assists} | CS/min {cs_per_min} | Vision {vision_score} | {date_str}"

# ==============================
# 🚀 PARALLEL FETCH + PROGRESS
# ==============================
print("\n🚀 Fetching matches in parallel...")
with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = [executor.submit(process_match, m) for m in match_ids]
    for future in tqdm(as_completed(futures), total=len(futures), desc="Fetching matches", ncols=90):
        print(future.result())

# ==============================
# 📊 SUMMARY STATS
# ==============================
print("\n📊 Summary stats for this player:")

for row in cur.execute("""
    SELECT ROUND(AVG(kda),2), ROUND(AVG(cs_per_min),2), ROUND(AVG(vision_score),2),
           ROUND(SUM(win)*100.0/COUNT(*),2)
    FROM matches WHERE puuid = ?
""", (puuid,)):
    avg_kda, avg_csmin, avg_vis, winrate = row
    print(f"⭐ KDA: {avg_kda} | CS/min: {avg_csmin} | Vision: {avg_vis} | Winrate: {winrate}%")

print("\n🏆 Top Champions by Winrate:")
for row in cur.execute("""
    SELECT champion, COUNT(*), ROUND(AVG(kda),2),
           ROUND(AVG(vision_score),2),
           ROUND(SUM(win)*100.0/COUNT(*),2) as winrate
    FROM matches
    WHERE puuid = ?
    GROUP BY champion
    ORDER BY winrate DESC
    LIMIT 5
""", (puuid,)):
    champ, games, champ_kda, champ_vis, wr = row
    print(f"  {champ}: {wr}% WR | {games} games | KDA {champ_kda} | Vision {champ_vis}")

conn.close()