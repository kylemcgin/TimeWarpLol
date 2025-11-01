# Getting Started with TimeWarp LoL

## 🎯 What You Have Now

✅ **Complete application built and ready**
✅ **All dependencies installed**
✅ **Server configuration complete**
✅ **Documentation created**

## ⚠️ What You Need Before Testing

### **Required: Riot Games API Key**

The app **cannot work** without this. Here's how to get it:

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Get Your Riot API Key**

1. **Go to**: [https://developer.riotgames.com/](https://developer.riotgames.com/)
2. **Log in** with your League of Legends account credentials
3. **Click**: "Regenerate Development Key" button on the dashboard
4. **Copy**: The key that appears (looks like `RGAPI-xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### **Step 2: Add the API Key to Your Project**

1. **Open the file**: `c:\Users\Ken\TimeWarpLol\.env`
2. **Find this line**:
   ```env
   RIOT_API_KEY=your_riot_api_key_here
   ```
3. **Replace with your actual key**:
   ```env
   RIOT_API_KEY=RGAPI-12345678-abcd-1234-abcd-123456789012
   ```
   _(Use your real key, not the example above!)_
4. **Save the file**

### **Step 3: Start the Development Server**

Open your terminal in the project directory and run:

```bash
npm run dev
```

Wait for:
```
✓ Ready in XXXXms
```

### **Step 4: Open the Application**

Go to the URL shown in the terminal (usually):
- [http://localhost:3000](http://localhost:3000) or
- [http://localhost:3001](http://localhost:3001) or
- [http://localhost:3002](http://localhost:3002)

### **Step 5: Test It!**

**Try with a well-known player first:**
- **Summoner Name**: `Doublelift`
- **Region**: `North America`
- **Year**: `2023` or `2024`
- **Click**: "Generate Year in Review"

**Or use your own account:**
- Enter your summoner name (with or without #TAG)
- Select your region
- Choose a year where you played ranked
- Generate!

---

## 📊 What You'll See (Without AWS)

### ✅ **These Features Work Immediately:**

1. **Summary Cards**
   - Total games, wins, losses
   - Win rate percentage
   - Total playtime
   - Main champion and role

2. **Champion Statistics**
   - Performance table for all champions played
   - KDA, win rates, games played
   - Sorted by most played

3. **Performance Charts**
   - Win rate over time (line chart)
   - Performance radar (5 categories)
   - Monthly progression

4. **Achievements**
   - Pentakills
   - Win streaks
   - Champion mastery
   - Performance badges

### ⚪ **Optional (Requires AWS Setup):**

- **AI-Generated Insights**
  - Personalized summary
  - Strengths analysis
  - Improvement suggestions
  - Playstyle description
  - Fun facts
  - Motivational messages

**Note**: You can skip AWS setup for now! The app is fully functional without it. You'll see placeholder text for AI sections, but all statistics and visualizations work perfectly.

---

## 🐛 Common Issues

### **"Failed to generate review"**

**Most likely cause**: No API key added yet

**Solution**:
1. Add your Riot API key to `.env`
2. Make sure it starts with `RGAPI-`
3. Restart the dev server

### **"Player not found"**

**Possible causes**:
- Typo in summoner name (case-sensitive!)
- Wrong region selected
- Need to add tagline (#TAG)

**Solutions**:
- Try both formats: `Name` and `Name#TAG`
- Double-check region
- Make sure account has played ranked games

### **"No ranked matches found"**

**Cause**: Account didn't play ranked in that year

**Solution**:
- Try a different year
- Make sure you played ranked (not normal/ARAM)

### **API Key Expired**

**Cause**: Development keys expire after 24 hours

**Solution**:
1. Go back to developer.riotgames.com
2. Click "Regenerate Development Key"
3. Update `.env` with new key
4. Restart server

---

## 💡 Development Tips

### **Daily Development:**
- Dev API keys expire every 24 hours
- Regenerate your key daily at developer.riotgames.com
- Takes 10 seconds to get a new one

### **Testing:**
- Use well-known player names first (Doublelift, Faker, etc.)
- Then test with your own account
- Try different years to see more data

### **Server:**
- Hot reload works for most changes
- Restart (`Ctrl+C` then `npm run dev`) if something breaks
- Clear cache if needed: `rm -rf .next && npm run dev`

---

## 📚 Additional Documentation

Once you have it running, check out:

- **[README.md](README.md)** - Full project overview and features
- **[QUICKSTART.md](QUICKSTART.md)** - Alternative quick start guide
- **[SUMMONER_NAME_GUIDE.md](SUMMONER_NAME_GUIDE.md)** - Help with name formats
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Detailed troubleshooting
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup with AWS
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture docs

---

## 🎮 Example Test Scenarios

### **Scenario 1: Famous Player**
```
Name: Doublelift
Region: North America
Year: 2023
Expected: Full stats from his 2023 season
```

### **Scenario 2: Your Own Account (Old Format)**
```
Name: YourSummonerName
Region: Your Region
Year: 2024
```

### **Scenario 3: Your Account (With Riot ID)**
```
Name: YourName#TAG
Region: Your Region
Year: 2024
```

### **Scenario 4: Different Region**
```
Name: Faker
Region: Korea
Year: 2023
```

---

## 🔐 Important Security Notes

- **Never commit `.env` file to git** (it's already in `.gitignore`)
- **Don't share your API key** publicly
- **Regenerate keys regularly** for security
- **Use environment variables** for production

---

## 🆘 Still Stuck?

### **Checklist:**
- [ ] Ran `npm install`
- [ ] Created `.env` file (not `.env.example`)
- [ ] Added real Riot API key to `.env`
- [ ] API key starts with `RGAPI-`
- [ ] Ran `npm run dev`
- [ ] Saw "✓ Ready" message
- [ ] Opened browser to localhost URL
- [ ] Tried with `Doublelift` + `NA` + `2023`

### **If none of that works:**
1. Check terminal for error messages
2. Check browser console (F12 → Console tab)
3. Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. Make sure you're using Node.js 18+: `node --version`

---

## 🎉 What's Next?

Once you have it working:

1. **Explore your own stats** - See your League journey!
2. **Compare with friends** - Check out different accounts
3. **Optional: Set up AWS** - Get AI-powered insights (see [SETUP_GUIDE.md](SETUP_GUIDE.md))
4. **Customize the app** - Modify components, add features
5. **Deploy it** - Share with friends (Vercel or AWS)

---

## 📞 Need Help?

- **Documentation**: Check the guides in this folder
- **Issues**: All common problems are in [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Code**: Browse the codebase - it's well-documented!

---

**TL;DR**:
1. Get API key from developer.riotgames.com
2. Add to `.env` file
3. Run `npm run dev`
4. Open localhost in browser
5. Try "Doublelift" + "NA" + "2023"

**That's it! You're ready to explore League of Legends year-in-review data!** 🎮✨
