import requests

API_KEY = "API_key"  # Your fresh dev key
GAME_NAME = "Summoner"
TAG_LINE = "###"

# Use the correct "regional routing" host
REGION_ROUTE = "americas"  # NA, BR, LAN, LAS, OCE use 'americas'

url = f"https://{REGION_ROUTE}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{GAME_NAME}/{TAG_LINE}"
headers = {"X-Riot-Token": API_KEY}

response = requests.get(url, headers=headers)
print("Status Code:", response.status_code)
print("Response:", response.json())

if response.status_code == 200:
    account_data = response.json()
    print("\n✅ Riot ID found!")
    print("PUUID:", account_data["puuid"])
    print("Game Name:", account_data["gameName"])
    print("Tag Line:", account_data["tagLine"])
