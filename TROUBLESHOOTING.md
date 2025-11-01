# Troubleshooting Guide

## ❌ "Failed to generate review"

This error usually means the API request didn't complete successfully. Here are the most common causes and solutions:

---

## 🔍 Common Issues

### 1. **Missing Riot API Key** (Most Common!)

**Error**: "Failed to generate review" or "Forbidden"

**Cause**: You haven't added your Riot API key to the `.env` file

**Solution**:
1. Get your API key from [https://developer.riotgames.com/](https://developer.riotgames.com/)
2. Open the `.env` file in the project root
3. Replace `your_riot_api_key_here` with your actual key:
   ```env
   RIOT_API_KEY=RGAPI-your-actual-key-here
   ```
4. Restart the dev server (`Ctrl+C`, then `npm run dev`)

---

### 2. **Server Not Running**

**Error**: "Failed to fetch" or connection refused

**Cause**: Development server isn't running

**Solution**:
```bash
npm run dev
```

Then open: http://localhost:3001

---

### 3. **Invalid API Key**

**Error**: "Failed to generate review" or "Unauthorized"

**Cause**: API key is expired or invalid (dev keys expire after 24 hours)

**Solution**:
1. Go to [https://developer.riotgames.com/](https://developer.riotgames.com/)
2. Click "Regenerate Development Key"
3. Copy the new key
4. Update `.env` file
5. Restart server

---

### 4. **Player Not Found**

**Error**: "Player not found"

**Causes**:
- Typo in summoner name
- Wrong region selected
- Need to include tagline (#TAG)

**Solutions**:
- Check spelling (case-sensitive!)
- Verify region matches your account
- Try both formats:
  - Without tagline: `SummonerName`
  - With tagline: `SummonerName#TAG`

---

### 5. **No Ranked Matches**

**Error**: "No ranked matches found for this year"

**Cause**: The account hasn't played any ranked games in the selected year

**Solution**:
- Make sure you select a year where you played ranked (not normal/ARAM)
- Try a different year
- Check if the account has played any ranked games at all

---

### 6. **Rate Limit Exceeded**

**Error**: "Rate limit exceeded" or "429 Too Many Requests"

**Cause**: Too many API requests in a short time (dev key limits: 20/sec, 100/2min)

**Solution**:
- Wait 2-3 minutes
- Try again
- For frequent testing, apply for a production API key

---

### 7. **AWS Bedrock Not Configured**

**Error**: AI insights show placeholder text or fail to generate

**Cause**: AWS credentials aren't configured (this is optional)

**Effect**:
- ✅ Statistics still work
- ✅ Charts still work
- ✅ Achievements still work
- ❌ AI insights won't generate

**Solution** (Optional):
- Follow AWS setup in [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Or continue without AI insights (still lots of cool stats!)

---

## 🛠️ Debugging Steps

### Step 1: Check if server is running

```bash
# You should see: "Ready in XXXXms"
npm run dev
```

### Step 2: Verify API key is set

Open `.env` and check:
```env
RIOT_API_KEY=RGAPI-xxxxxxxxx  # Should NOT be "your_riot_api_key_here"
```

### Step 3: Test with a known account

Try with a well-known player:
- Name: `Doublelift`
- Region: `NA`
- Year: `2023`

### Step 4: Check browser console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Share any red errors for help

### Step 5: Check server logs

Look at the terminal where `npm run dev` is running.
Look for error messages in red.

---

## 💡 Quick Checklist

Before asking for help, verify:

- [ ] Dev server is running (`npm run dev`)
- [ ] `.env` file exists (not just `.env.example`)
- [ ] `RIOT_API_KEY` in `.env` has a real key (starts with `RGAPI-`)
- [ ] Summoner name is spelled correctly
- [ ] Region selection matches the account
- [ ] The account has played ranked games in the selected year
- [ ] API key hasn't expired (regenerate daily)

---

## 🆘 Still Having Issues?

### Get More Details

1. **Check browser console** (F12 → Console)
2. **Check server logs** (terminal running `npm run dev`)
3. **Try the curl command**:
   ```bash
   curl -X POST http://localhost:3001/api/generate-review \
     -H "Content-Type: application/json" \
     -d '{"summonerName":"Doublelift","region":"NA","year":2023}'
   ```

###Share This Information:

- Error message from browser
- Error message from server logs
- Your `.env` configuration (hide actual API key!)
- Summoner name and region you're testing with

---

## 📚 Additional Resources

- [QUICKSTART.md](QUICKSTART.md) - Basic setup guide
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [SUMMONER_NAME_GUIDE.md](SUMMONER_NAME_GUIDE.md) - Help with name formats
- [README.md](README.md) - Full project documentation

---

## 🎯 Most Likely Solution

**90% of "Failed to generate review" errors are because you need to add your Riot API key!**

1. Go to [https://developer.riotgames.com/](https://developer.riotgames.com/)
2. Log in and get your development key
3. Add it to `.env`:
   ```env
   RIOT_API_KEY=RGAPI-your-key-here
   ```
4. Restart the server
5. Try again!

---

**Still stuck? The server logs usually have the real error message!**
