# TimeWarp LoL - Architecture Documentation

This document provides a detailed overview of the TimeWarp LoL architecture, design decisions, and technical implementation.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                      (Next.js + React)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                        │
│                  /api/generate-review                           │
└────────┬────────────────────┬────────────────────────┬──────────┘
         │                    │                        │
         ▼                    ▼                        ▼
┌─────────────────┐  ┌─────────────────┐   ┌──────────────────┐
│  Riot Games API │  │  AWS Bedrock    │   │   AWS Services   │
│  (Match Data)   │  │  (AI Insights)  │   │  (DynamoDB, S3)  │
└─────────────────┘  └─────────────────┘   └──────────────────┘
```

---

## Component Architecture

### Frontend Layer

#### 1. Next.js App Router Structure

```
app/
├── layout.tsx              # Root layout with global styles
├── page.tsx                # Home page with search form
├── globals.css             # Global CSS with League of Legends theme
└── api/
    └── generate-review/
        └── route.ts        # Main API endpoint
```

**Key Features**:
- Server-side rendering for SEO
- Client-side state management with React hooks
- Responsive design with Tailwind CSS
- League of Legends-inspired dark theme

#### 2. Component Hierarchy

```
App (page.tsx)
├── SearchForm
│   └── Form inputs for summoner name, region, year
└── YearReviewDashboard
    ├── SummaryCard (x4)
    ├── AIInsightsSection
    │   └── Multiple insight panels
    ├── AchievementsList
    ├── PerformanceChart (x2)
    ├── ChampionStats
    └── ShareButtons
```

### Backend Services Layer

#### 1. Riot API Service (`services/riotApi.ts`)

**Responsibilities**:
- Player lookup by summoner name
- Match history retrieval
- Match detail fetching
- Rate limiting and error handling

**Key Methods**:
```typescript
getPlayerByName(name, region)       // Get player PUUID
getMatchIds(puuid, startTime, endTime) // Get match IDs for date range
getMatchData(matchId)               // Get detailed match data
getYearMatchHistory(puuid, year)    // Get full year of matches
```

**Regional Endpoints**:
- Platform endpoints: `na1.api.riotgames.com`, `euw1.api.riotgames.com`, etc.
- Regional endpoints: `americas.api.riotgames.com`, `europe.api.riotgames.com`, etc.

**Rate Limiting Strategy**:
- Development key: 20 requests/second, 100 requests/2 minutes
- Batch processing with delays between batches
- Exponential backoff on rate limit errors

#### 2. AWS Bedrock Service (`services/bedrockService.ts`)

**Responsibilities**:
- Generate AI-powered insights using Claude 3.5 Sonnet
- Create personalized narratives
- Analyze player strengths and weaknesses
- Generate fun facts and motivational messages

**AI Generation Methods**:
```typescript
generateYearInReviewInsights()      // Comprehensive insights
generateStrengthsAnalysis()         // Player strengths
generateImprovementAreas()          // Areas to improve
generatePlaystyleAnalysis()         // Playstyle description
generateFunFacts()                  // Entertaining statistics
generateProgressionNarrative()      // Year progression story
```

**Prompt Engineering Strategy**:
- Structured prompts with clear instructions
- Data-driven context from player statistics
- JSON output format for parsing
- Temperature: 0.7 (balanced creativity and consistency)

#### 3. Data Processor Service (`services/dataProcessor.ts`)

**Responsibilities**:
- Process raw match data into statistics
- Calculate performance metrics
- Generate achievements
- Create timeline data

**Processing Pipeline**:
```
Raw Match Data
    ↓
Extract Player Performance (per match)
    ↓
Aggregate Statistics
    ├── Champion Stats (KDA, win rate, games played)
    ├── Role Stats (performance by role)
    ├── Performance Metrics (KDA, vision, gold, damage)
    ├── Timeline Data (monthly progression)
    └── Streaks (win/loss streaks)
    ↓
Generate Achievements
    ↓
Structured Statistics Output
```

---

## Data Models

### Core Types

#### Player
```typescript
interface Player {
  puuid: string;           // Riot's unique player ID
  summonerName: string;
  region: string;
  profileIconId: number;
  summonerLevel: number;
}
```

#### Match Data
```typescript
interface MatchData {
  matchId: string;
  gameCreation: number;    // Unix timestamp
  gameDuration: number;    // Seconds
  gameMode: string;
  queueId: number;         // Ranked Solo/Duo, Flex, etc.
  participants: MatchParticipant[];
}
```

#### Year in Review (Final Output)
```typescript
interface YearInReview {
  playerId: string;
  year: number;
  generatedAt: string;
  summary: Summary;                    // Basic statistics
  statistics: Statistics;              // Detailed performance data
  achievements: Achievement[];         // Unlocked achievements
  insights: AIInsights;                // AI-generated insights
  visualizations: VisualizationData;   // Chart data
  shareableCards: ShareableCard[];     // Social sharing cards
}
```

---

## AI Integration Architecture

### AWS Bedrock Implementation

**Model**: Claude 3.5 Sonnet v2
**Model ID**: `anthropic.claude-3-5-sonnet-20241022-v2:0`

#### Why Claude 3.5 Sonnet?

1. **Extended Context Window**: 200K tokens (handles large match histories)
2. **Superior Reasoning**: Better at analyzing complex performance patterns
3. **Structured Output**: Excellent at following JSON format instructions
4. **Nuanced Language**: Creates engaging, personalized narratives
5. **Low Latency**: Fast response times (5-15 seconds)

#### Prompt Design Pattern

```typescript
const prompt = `
You are analyzing League of Legends player data...

[CONTEXT: Player statistics in structured format]

[TASK: Specific generation task]

[FORMAT: Expected output format with examples]

[TONE: Enthusiastic, insightful, encouraging]
`;
```

**Key Prompt Engineering Principles**:
- **Data-First**: Always provide full context upfront
- **Clear Instructions**: Specific, actionable tasks
- **Format Specification**: Exact output format (JSON, paragraphs, lists)
- **Tone Guidance**: Consistent, positive, player-focused voice
- **Examples**: Show desired output style

### AI Insights Generation Flow

```
1. Process Match Data → Statistics
2. Build Context Prompt with Statistics
3. Invoke Bedrock with Prompt
4. Parse AI Response (JSON extraction)
5. Validate and Structure Output
6. Return Insights to Frontend
```

---

## AWS Infrastructure

### DynamoDB Tables

#### Matches Table
- **Partition Key**: `matchId` (String)
- **GSI**: `puuid-index` for player match lookup
- **Purpose**: Cache match data to reduce Riot API calls
- **TTL**: 30 days (auto-delete old matches)

#### Players Table
- **Partition Key**: `puuid` (String)
- **Purpose**: Store player profile information
- **TTL**: 7 days

#### Insights Table
- **Partition Key**: `playerId` (String)
- **Sort Key**: `year` (Number)
- **Purpose**: Cache generated year-in-review data
- **TTL**: 365 days (refresh annually)

### S3 Buckets

#### Data Bucket (`timewarp-data`)
- Stores raw match history JSON files
- Private access only
- Lifecycle policy: Delete after 90 days

#### Images Bucket (`timewarp-images`)
- Stores shareable social media cards
- Public read access
- CloudFront CDN for fast delivery

### Lambda Functions (Serverless Deployment)

```yaml
generateReview:
  handler: api/serverless-handler.generateReview
  timeout: 300 seconds   # 5 minutes for full processing
  memory: 1024 MB
```

---

## Performance Optimization

### Caching Strategy

1. **Match Data Caching**:
   - Store matches in DynamoDB after first fetch
   - Check cache before calling Riot API
   - Cache invalidation: 24 hours

2. **Insights Caching**:
   - Store generated insights in DynamoDB
   - Serve cached insights if available (same year)
   - Cache invalidation: 7 days or on-demand

3. **Frontend Caching**:
   - Next.js static generation for landing page
   - Client-side state management (React hooks)
   - Browser caching for assets (24 hours)

### Rate Limiting

**Riot API**:
- Batch requests (10 matches per batch)
- 1-second delay between batches
- Retry with exponential backoff on 429 errors

**AWS Bedrock**:
- Single request per year-in-review
- Approximately 2,000-4,000 tokens per request
- Average latency: 5-15 seconds

---

## Security Considerations

### API Key Management

1. **Environment Variables**: Never commit keys to Git
2. **AWS Secrets Manager**: Store production keys in Secrets Manager
3. **Key Rotation**: Rotate Riot API keys monthly
4. **Least Privilege**: IAM roles with minimal required permissions

### Data Privacy

1. **Anonymization**: Store PUUIDs instead of summoner names
2. **Encryption**: DynamoDB encryption at rest
3. **HTTPS Only**: All API calls over TLS 1.3
4. **No PII Storage**: Don't store email, IP addresses, or personal data

### AWS Security

**IAM Policies**:
```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock:InvokeModel",
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "s3:GetObject",
    "s3:PutObject"
  ],
  "Resource": [/* specific ARNs only */]
}
```

---

## Scalability

### Current Capacity

- **Concurrent Users**: 100-500
- **Reviews per Hour**: 100-200
- **Monthly Reviews**: ~10,000

### Scaling Strategy

1. **Horizontal Scaling**:
   - Lambda auto-scales automatically
   - DynamoDB on-demand pricing (auto-scales)
   - CloudFront CDN for global distribution

2. **Vertical Optimization**:
   - Optimize Riot API batch sizes
   - Implement Redis cache for hot data
   - Use DynamoDB DAX for read-heavy workloads

3. **Cost Optimization**:
   - Cache aggressively to reduce API calls
   - Use CloudWatch to monitor and optimize
   - Implement query result caching

---

## Monitoring & Observability

### CloudWatch Metrics

- Lambda execution duration
- API error rates
- Bedrock invocation costs
- DynamoDB read/write units
- Cache hit rates

### Logging Strategy

```typescript
// Structured logging
console.log({
  event: 'review_generated',
  playerId: puuid,
  year: year,
  matchCount: matches.length,
  duration: Date.now() - startTime,
  bedrockTokens: tokensUsed
});
```

### Alerts

- Lambda timeout errors
- Riot API rate limit hits
- Bedrock throttling errors
- High DynamoDB costs

---

## Testing Strategy

### Unit Tests

- Test data processing algorithms
- Test achievement generation logic
- Test AI response parsing

### Integration Tests

- Test Riot API integration
- Test Bedrock invocation
- Test full end-to-end flow

### Performance Tests

- Load testing with 100 concurrent requests
- Stress testing Riot API rate limits
- Bedrock latency profiling

---

## Future Architecture Enhancements

1. **Microservices Split**:
   - Separate match fetching service
   - Dedicated AI insights service
   - Real-time WebSocket updates

2. **Advanced Analytics**:
   - Real-time processing with Kinesis
   - Machine learning predictions (SageMaker)
   - Comparative analytics (vs. friends, global)

3. **Enhanced Caching**:
   - Redis/ElastiCache for hot data
   - DynamoDB DAX for read acceleration
   - CDN edge computing

4. **Multi-Region Deployment**:
   - Global CloudFront distribution
   - Regional Lambda deployments
   - Cross-region DynamoDB replication

---

## Conclusion

TimeWarp LoL's architecture is designed for:
- **Scalability**: Serverless auto-scaling
- **Performance**: Aggressive caching and optimization
- **Cost Efficiency**: Pay-per-use pricing model
- **Reliability**: AWS managed services with high availability
- **Maintainability**: Clean separation of concerns, TypeScript safety

The system leverages the best of AWS AI services (Bedrock) and gaming APIs (Riot) to create a unique, personalized experience for League of Legends players.
