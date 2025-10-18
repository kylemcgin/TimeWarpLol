import requests

API_KEY = "YOUR_API_KEY"
REGION = "na1"
SUMMONER_NAME = "KenjaminFancyson#111"

url = f"https://{REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{SUMMONER_NAME}"
headers = {"X-Riot-Token": API_KEY}

response = requests.get(url, headers=headers)
print(response.json())