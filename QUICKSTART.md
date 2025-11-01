# TimeWarp LoL - Quick Start Guide

## 🚀 Running Locally in 5 Minutes

### Prerequisites
- Node.js 18+ installed ([Download](https://nodejs.org/))
- A League of Legends account (to get API key)

---

## Option 1: Full Setup (with AI insights)

### Step 1: Get Riot API Key (Required)

1. Go to [https://developer.riotgames.com/](https://developer.riotgames.com/)
2. Log in with your LoL account
3. Click "Regenerate Development Key"
4. Copy your API key

### Step 2: Get AWS Credentials (for AI insights)

**Quick AWS Setup:**

1. Create AWS account (if you don't have one)
2. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
3. Select region: **us-east-1** (recommended)
4. Go to **Model access** → **Manage model access**
5. Enable **Claude 3.5 Sonnet v2** by Anthropic
6. Create IAM user with Bedrock access
7. Get Access Key ID and Secret Access Key

### Step 3: Configure .env file

Edit the `.env` file in the project root:

```env
# Required: Riot API Key
RIOT_API_KEY=RGAPI-your-actual-key-here

# Required for AI insights: AWS Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Optional: These will work with defaults
DYNAMODB_MATCHES_TABLE=timewarp-matches
DYNAMODB_PLAYERS_TABLE=timewarp-players
DYNAMODB_INSIGHTS_TABLE=timewarp-insights
S3_DATA_BUCKET=timewarp-data
S3_IMAGES_BUCKET=timewarp-images
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Run the app

```bash
npm run dev
```

### Step 5: Open in browser

Go to: [http://localhost:3000](http://localhost:3000)

**Test it:**
- Enter your summoner name
- Select your region
- Choose year (2024 or 2023)
- Click "Generate Year in Review"

---

## Option 2: Quick Test (Statistics Only - No AI)

Want to test without AWS? You can run it with statistics only (AI insights will be disabled).

### Step 1: Get Riot API Key (Required)

Follow Step 1 from Option 1 above.

### Step 2: Minimal .env configuration

Edit `.env`:

```env
# Only this is required for basic testing
RIOT_API_KEY=RGAPI-your-actual-key-here

# These can stay as placeholders
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=placeholder
AWS_SECRET_ACCESS_KEY=placeholder
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 3: Run in test mode

```bash
npm run dev
```

**Note**: AI insights will fail gracefully and show placeholder text. All statistics, charts, and achievements will still work!

---

## 🐛 Troubleshooting

### Issue: "RIOT_API_KEY is not defined"

**Solution**: Make sure you have a `.env` file (not `.env.example`) with your actual API key.

### Issue: "Player not found"

**Solution**:
- Check summoner name spelling (case-sensitive)
- Verify region is correct
- Make sure the account has played ranked games

### Issue: "Failed to fetch match history"

**Solution**:
- Your Riot API key may have expired (dev keys expire after 24 hours)
- Regenerate a new key at developer.riotgames.com
- Update your `.env` file with the new key
- Restart the dev server

### Issue: "AWS Bedrock error"

**Solution**:
- Verify Bedrock is enabled in your AWS region (us-east-1 recommended)
- Check that Claude 3.5 Sonnet model access is granted
- Verify IAM permissions include `bedrock:InvokeModel`
- Check AWS credentials are correct in `.env`

### Issue: Port 3000 already in use

**Solution**:
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
PORT=3001 npm run dev
```

---

## 📊 What to Expect

### Processing Time
- Player lookup: 1-2 seconds
- Fetching matches: 10-30 seconds (depends on games played)
- Processing data: 2-5 seconds
- AI insights: 5-15 seconds (if AWS configured)

**Total**: 30-60 seconds for a full review

### Sample Output

You'll see:
- ✅ **Summary Cards**: Games played, win rate, playtime, main champion
- ✅ **Statistics**: Champion performance, role stats, timeline
- ✅ **Achievements**: Unlocked badges based on performance
- ✅ **Charts**: Win rate over time, performance radar
- ✅ **AI Insights**: Strengths, improvements, playstyle (if AWS configured)
- ✅ **Share Buttons**: Social media sharing options

---

## 💡 Tips

### For Best Results
1. **Use your own account** for testing (you know your stats!)
2. **Choose a year** where you played 50+ ranked games
3. **Have patience** - first load takes 30-60 seconds

### Development Tips
1. **API key expires daily** - regenerate when needed
2. **Check console** for detailed error messages
3. **Use Chrome DevTools** to debug issues

### Cost Awareness (if using AWS)
- Each year-in-review costs about **$0.01-0.02** in AWS Bedrock fees
- DynamoDB and S3 costs are negligible
- Free tier covers significant usage

---

## 🎮 Example Test Flow

```
1. Start app: npm run dev
2. Open: http://localhost:3000
3. Enter summoner name: "YourName"
4. Select region: "NA" (or your region)
5. Choose year: 2024
6. Click: "Generate Year in Review"
7. Wait: 30-60 seconds
8. Explore: All sections of your review!
```

---

## 📚 Next Steps

After getting it running:

1. **Read the full docs**: Check [README.md](README.md) for all features
2. **Explore the code**: Look at [ARCHITECTURE.md](ARCHITECTURE.md) to understand how it works
3. **Customize**: Modify components to fit your style
4. **Deploy**: Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) to deploy to production

---

## 🆘 Still Having Issues?

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
2. Review [README.md](README.md) troubleshooting section
3. Check your `.env` file has correct values
4. Make sure Node.js version is 18+: `node --version`
5. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

---

**Ready to see your League journey come to life? Let's go!** 🎮✨
