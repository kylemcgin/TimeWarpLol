import sqlite3
from datetime import datetime

# ==============================
# 🗃 CONNECT TO DATABASE
# ==============================
conn = sqlite3.connect("league_matches.db")
cur = conn.cursor()

# ==============================
# 👤 SELECT PLAYER
# ==============================
players = cur.execute("SELECT player_name, puuid FROM players").fetchall()
if not players:
    print("❌ No players found in database. Run player_stats.py first.")
    exit()

print("📜 Players in database:")
for idx, (name, pid) in enumerate(players, start=1):
    pid_display = pid[:10] + "..." if pid else "NO_PUUID"
    print(f"{idx}. {name} ({pid_display})")

try:
    choice = int(input("\n👉 Select a player number: ")) - 1
    selected_name, selected_puuid = players[choice]
except (ValueError, IndexError):
    print("❌ Invalid selection.")
    exit()

print(f"\n✅ Viewing stats for: {selected_name}\n")

# ==============================
# 🧰 FILTER OPTIONS
# ==============================
filters = []
params = [selected_puuid]

champion_filter = input("🏆 Filter by champion (or press Enter to skip): ").strip()
if champion_filter:
    filters.append("champion = ?")
    params.append(champion_filter)

win_filter = input("✅ Filter by result (win/lose/all): ").strip().lower()
if win_filter == "win":
    filters.append("win = 1")
elif win_filter == "lose":
    filters.append("win = 0")

queue_filter = input("🎮 Filter by queue ID (e.g. 420 for ranked, or Enter to skip): ").strip()
if queue_filter:
    filters.append("queue_id = ?")
    params.append(queue_filter)

where_clause = "WHERE puuid = ?" + (" AND " + " AND ".join(filters) if filters else "")

# ==============================
# 🧾 FETCH MATCHES
# ==============================
query = f"""
SELECT match_id, game_creation, champion, kills, deaths, assists,
       cs_per_min, vision_score, win
FROM matches
{where_clause}
ORDER BY game_creation DESC
LIMIT 50
"""
rows = cur.execute(query, params).fetchall()

if not rows:
    print("⚠️ No matches found with the selected filters.")
    exit()

# ==============================
# 📊 DISPLAY MATCH HISTORY
# ==============================
print("\n🕒 Recent Matches:")
print("-" * 80)
for match_id, ts, champ, k, d, a, csmin, vision, win in rows:
    date_str = datetime.utcfromtimestamp(ts / 1000).strftime('%Y-%m-%d %H:%M')
    result = "✅ WIN" if win else "❌ LOSS"
    print(f"{date_str} | {champ:<12} | {k}/{d}/{a:<3} | CS/min {csmin:<4} | Vision {vision:<4} | {result} | {match_id}")
print("-" * 80)

# ==============================
# 📈 SUMMARY STATS
# ==============================
print("\n📊 Overall Stats:")

summary = cur.execute(f"""
SELECT ROUND(AVG(kda),2), ROUND(AVG(cs_per_min),2), ROUND(AVG(vision_score),2),
       ROUND(SUM(win)*100.0/COUNT(*),2), COUNT(*)
FROM matches
{where_clause}
""", params).fetchone()

avg_kda, avg_csmin, avg_vis, winrate, games = summary
print(f"⭐ Games: {games}")
print(f"📈 Avg KDA: {avg_kda} | CS/min: {avg_csmin} | Vision: {avg_vis} | Winrate: {winrate}%")

# ==============================
# 🏆 Top Champions
# ==============================
print("\n🏆 Top Champions:")
champions = cur.execute(f"""
SELECT champion, COUNT(*), ROUND(AVG(kda),2), ROUND(AVG(cs_per_min),2),
       ROUND(AVG(vision_score),2), ROUND(SUM(win)*100.0/COUNT(*),2) as winrate
FROM matches
{where_clause}
GROUP BY champion
ORDER BY winrate DESC, COUNT(*) DESC
LIMIT 5
""", params).fetchall()

if champions:
    for champ, count, ckda, ccs, cvis, cwr in champions:
        print(f"  {champ:<12} | Games: {count:<3} | KDA: {ckda:<5} | CS/min: {ccs:<4} | Vision: {cvis:<4} | Winrate: {cwr}%")
else:
    print("No champion data available for the selected filters.")

conn.close()