# TimeWarp LoL - Complete Setup Guide

This guide will walk you through setting up the entire TimeWarp LoL application, from getting API keys to deploying to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting a Riot API Key](#getting-a-riot-api-key)
3. [Setting Up AWS Bedrock](#setting-up-aws-bedrock)
4. [Configuring AWS Services](#configuring-aws-services)
5. [Local Development Setup](#local-development-setup)
6. [Deployment](#deployment)
7. [Testing](#testing)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed
- **AWS Account** with billing enabled
- **AWS CLI** installed and configured ([Guide](https://aws.amazon.com/cli/))
- A **League of Legends account** (to get API key)

---

## Getting a Riot API Key

### Step 1: Create Riot Developer Account

1. Go to [Riot Developer Portal](https://developer.riotgames.com/)
2. Log in with your League of Legends account
3. Accept the Terms of Service

### Step 2: Generate Development Key

1. Navigate to the Dashboard
2. Click "Regenerate Development Key"
3. Copy your API key (it will look like: `RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Important Notes**:
- Development keys expire after 24 hours
- They have stricter rate limits (20 requests/second, 100 requests/2 minutes)
- For production, you'll need to apply for a production API key

### Step 3: Apply for Production Key (Optional)

1. Go to "Apps" section in the developer portal
2. Click "Register Product"
3. Fill out the application form explaining your use case
4. Wait for approval (typically 1-2 weeks)

---

## Setting Up AWS Bedrock

### Step 1: Enable AWS Bedrock in Your Region

1. Sign in to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **AWS Bedrock** service
3. Select a region that supports Bedrock (recommended: **us-east-1**)

### Step 2: Request Model Access

1. In the Bedrock console, go to **Model access** (left sidebar)
2. Click **Manage model access**
3. Find **Anthropic** section
4. Check the box for **Claude 3.5 Sonnet v2**
   - Full model ID: `anthropic.claude-3-5-sonnet-20241022-v2:0`
5. Click **Request model access**
6. Wait for approval (typically instant, but can take a few hours)

### Step 3: Verify Model Access

1. Go back to **Model access** page
2. Ensure Claude 3.5 Sonnet shows status: **Access granted** (green checkmark)

### Step 4: Create IAM User for Bedrock

1. Navigate to **IAM** service in AWS Console
2. Click **Users** → **Add users**
3. Username: `timewarp-lol-bedrock-user`
4. Select **Programmatic access**
5. Click **Next: Permissions**
6. Click **Attach policies directly**
7. Create a custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
      ]
    }
  ]
}
```

8. Complete user creation
9. **Save the Access Key ID and Secret Access Key** (you won't see them again!)

---

## Configuring AWS Services

### DynamoDB Tables

You can either:
- **Option A**: Use Serverless Framework to create tables automatically (recommended)
- **Option B**: Create tables manually in AWS Console

#### Option A: Automatic (via Serverless Framework)

Tables will be created when you run `serverless deploy`. Skip to next section.

#### Option B: Manual Setup

1. Navigate to **DynamoDB** in AWS Console
2. Create three tables:

**Table 1: Matches Table**
- Table name: `timewarp-lol-dev-matches`
- Partition key: `matchId` (String)
- Sort key: None
- Global Secondary Index:
  - Index name: `puuid-index`
  - Partition key: `puuid` (String)

**Table 2: Players Table**
- Table name: `timewarp-lol-dev-players`
- Partition key: `puuid` (String)

**Table 3: Insights Table**
- Table name: `timewarp-lol-dev-insights`
- Partition key: `playerId` (String)
- Sort key: `year` (Number)

### S3 Buckets

1. Navigate to **S3** in AWS Console
2. Create two buckets:
   - `timewarp-lol-dev-data`
   - `timewarp-lol-dev-images` (enable public access for shareable images)

---

## Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/timewarp-lol.git
cd timewarp-lol

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Riot Games API
RIOT_API_KEY=RGAPI-your-api-key-here

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# DynamoDB Tables
DYNAMODB_MATCHES_TABLE=timewarp-lol-dev-matches
DYNAMODB_PLAYERS_TABLE=timewarp-lol-dev-players
DYNAMODB_INSIGHTS_TABLE=timewarp-lol-dev-insights

# S3 Buckets
S3_DATA_BUCKET=timewarp-lol-dev-data
S3_IMAGES_BUCKET=timewarp-lol-dev-images

# Bedrock Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 3: Verify AWS Configuration

Test your AWS credentials:

```bash
aws sts get-caller-identity
```

Test Bedrock access:

```bash
aws bedrock list-foundation-models --region us-east-1
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Option 1: Deploy to Vercel (Easiest)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all environment variables from your `.env` file

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy to AWS (Full Serverless)

1. **Install Serverless Framework**:
   ```bash
   npm install -g serverless
   ```

2. **Configure AWS Credentials**:
   ```bash
   serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
   ```

3. **Deploy**:
   ```bash
   # Development
   serverless deploy --stage dev

   # Production
   serverless deploy --stage prod
   ```

4. **Get API Endpoint**:
   After deployment, Serverless will output your API endpoint:
   ```
   endpoints:
     POST - https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api/generate-review
   ```

5. **Update Frontend**:
   Update `NEXT_PUBLIC_API_URL` in your environment variables to point to this endpoint.

---

## Testing

### Test Riot API Integration

```bash
# Create a test script: test-riot-api.js
const { riotApi } = require('./services/riotApi');

async function test() {
  const player = await riotApi.getPlayerByName('Your Summoner Name', 'NA');
  console.log('Player:', player);
}

test();
```

Run it:
```bash
node test-riot-api.js
```

### Test AWS Bedrock Integration

```bash
# Create test script: test-bedrock.js
const { bedrockService } = require('./services/bedrockService');

async function test() {
  const insights = await bedrockService.generateStrengthsAnalysis(
    { totalGames: 100, winRate: 55, favoriteChampion: 'Thresh', favoriteRole: 'SUPPORT' },
    { performanceMetrics: { averageKDA: 3.2, averageVisionScore: 45 }, championStats: [] }
  );
  console.log('Insights:', insights);
}

test();
```

Run it:
```bash
node test-bedrock.js
```

### Test Full Flow

1. Open the application in your browser
2. Enter a test summoner name (use your own account)
3. Select region and year
4. Click "Generate Year in Review"
5. Verify all sections load correctly:
   - Summary cards
   - AI insights
   - Champion statistics
   - Visualizations
   - Achievements

---

## Common Issues & Solutions

### Issue: "Bedrock Model Not Found"

**Solution**:
- Verify model access is granted in Bedrock console
- Check model ID matches exactly: `anthropic.claude-3-5-sonnet-20241022-v2:0`
- Ensure you're in a region that supports Bedrock (us-east-1)

### Issue: "Riot API Rate Limit Exceeded"

**Solution**:
- Wait a few minutes before retrying
- Implement caching for match data
- For production, apply for a production API key with higher limits

### Issue: "DynamoDB Table Not Found"

**Solution**:
- Run `serverless deploy` to create tables automatically
- Or manually create tables in AWS Console (see above)

### Issue: "CORS Error on API Calls"

**Solution**:
- Add CORS headers to your API routes
- In Vercel, this is handled automatically
- In Serverless, ensure `cors: true` is set in `serverless.yml`

---

## Performance Optimization

### Caching Strategy

Implement caching to reduce API calls:

```typescript
// Cache match data in DynamoDB for 24 hours
// Cache AI insights in DynamoDB for 7 days
// Use CloudFront CDN for static assets
```

### Rate Limiting

Implement rate limiting to avoid hitting Riot API limits:

```typescript
// Use AWS API Gateway throttling
// Implement exponential backoff in riotApi.ts
```

---

## Cost Estimation

**Monthly costs for moderate usage (100 reviews/month)**:

- AWS Bedrock (Claude 3.5 Sonnet): ~$2-4
- DynamoDB: ~$1-2
- S3: <$1
- Lambda: <$1
- **Total: ~$5-8/month**

**Per review cost**: ~$0.05

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys regularly**
3. **Use AWS Secrets Manager** for production credentials
4. **Implement rate limiting** on API endpoints
5. **Enable AWS CloudWatch** for monitoring
6. **Use HTTPS only** for all API calls
7. **Implement user authentication** for production

---

## Next Steps

Once everything is set up:

1. Test with your own League account
2. Share with friends to get feedback
3. Monitor AWS costs in AWS Cost Explorer
4. Consider implementing additional features (see README)
5. Apply for Riot Production API key for higher rate limits

---

## Support

If you encounter issues:

1. Check the [Troubleshooting section](README.md#troubleshooting) in README
2. Review AWS CloudWatch logs for errors
3. Open an issue on GitHub
4. Join the Discord community (if available)

---

**Happy coding, and good luck on the Rift! 🎮✨**
