import requests
import sqlite3
import json

API_KEY = "RGAPI-8bcd486a-f967-4898-8c36-9bc4775dee7f"  # Your API key
REGIONAL_ROUTE = "americas"  # Your region

headers = {"X-Riot-Token": API_KEY}

conn = sqlite3.connect("league_matches.db")
cur = conn.cursor()

# Fetch all match_ids and player puuid from your DB
cur.execute("SELECT match_id, player_name FROM matches")
rows = cur.fetchall()

print(f"Found {len(rows)} matches to update vision scores.")

for match_id, player_name in rows:
    try:
        # Fetch match data from Riot API
        match_url = f"https://{REGIONAL_ROUTE}.api.riotgames.com/lol/match/v5/matches/{match_id}"
        response = requests.get(match_url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch match {match_id}: {response.status_code}")
            continue

        match_data = response.json()
        info = match_data.get("info", {})
        participants = info.get("participants", [])

        # Find player stats by summonerName (player_name)
        player_stats = next((p for p in participants if p.get("summonerName", "").lower() == player_name.lower()), None)
        if not player_stats:
            print(f"Player {player_name} not found in match {match_id}")
            continue

        vision_score = player_stats.get("visionScore", 0)

        # Update vision_score in DB
        cur.execute(
            "UPDATE matches SET vision_score = ? WHERE match_id = ?",
            (vision_score, match_id)
        )
        conn.commit()
        print(f"Updated vision score for {match_id} to {vision_score}")

    except Exception as e:
        print(f"Error updating match {match_id}: {e}")

conn.close()
print("Update complete.")
