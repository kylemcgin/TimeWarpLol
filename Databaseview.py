import sqlite3
conn = sqlite3.connect("league_matches.db")
cur = conn.cursor()

for row in cur.execute("SELECT match_id, player_name, champion, vision_score FROM matches WHERE puuid = ?", ("YOUR_PUUID",)):
    print(row)

conn.close()
