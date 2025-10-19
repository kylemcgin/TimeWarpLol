import requests
import sqlite3
import json

# 🔑 Riot API key
API_KEY = "RGAPI-0ec4ba8c-1272-4c9b-8600-4fa39df90b1a"

# 🧍 Riot ID
GAME_NAME = "KenjaminFancyson"
TAG_LINE = "111"
REGIONAL_ROUTE = "americas"  # NA, BR, LAN, LAS, OCE

headers = {"X-Riot-Token": API_KEY}

# 📂 SQLite setup
conn = sqlite3.connect("league_matches.db")
cur = conn.cursor()

# 🏗️ Create table if it doesn't exist
cur.execute("""
CREATE TABLE IF NOT EXISTS matches (
    match_id TEXT PRIMARY KEY,
    game_creation INTEGER,
    game_duration INTEGER,
    queue_id INTEGER,
    match_json TEXT
)
""")
conn.commit()

# 🪪 Step 1: Get PUUID
account_url = f"https://{REGIONAL_ROUTE}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{GAME_NAME}/{TAG_LINE}"
account_response = requests.get(account_url, headers=headers)

if account_response.status_code == 200:
    puuid = account_response.json()["puuid"]
    print(" Got PUUID:", puuid)

    #  Step 2: Get match IDs
    match_ids_url = f"https://{REGIONAL_ROUTE}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=5"
    match_ids_response = requests.get(match_ids_url, headers=headers)

    if match_ids_response.status_code == 200:
        match_ids = match_ids_response.json()
        print(" Recent Match IDs:", match_ids)

        #  Step 3: Loop through match IDs
        for match_id in match_ids:
            # Check if we already saved this match
            cur.execute("SELECT match_id FROM matches WHERE match_id=?", (match_id,))
            if cur.fetchone():
                print(f"⚠️ Match {match_id} already in database — skipping.")
                continue

            # Fetch match details
            match_url = f"https://{REGIONAL_ROUTE}.api.riotgames.com/lol/match/v5/matches/{match_id}"
            match_response = requests.get(match_url, headers=headers)

            if match_response.status_code == 200:
                match_data = match_response.json()
                info = match_data["info"]

                game_creation = info.get("gameCreation")
                game_duration = info.get("gameDuration")
                queue_id = info.get("queueId")

                # Insert into SQLite
                cur.execute("""
                    INSERT INTO matches (match_id, game_creation, game_duration, queue_id, match_json)
                    VALUES (?, ?, ?, ?, ?)
                """, (match_id, game_creation, game_duration, queue_id, json.dumps(match_data)))
                conn.commit()

                print(f" Saved match {match_id} to database.")
            else:
                print(f"Error fetching match {match_id}: {match_response.status_code}")
    else:
        print(" Error fetching match IDs:", match_ids_response.status_code, match_ids_response.text)
else:
    print(" Error fetching account:", account_response.status_code, account_response.text)

conn.close()
