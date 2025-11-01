import { NextRequest, NextResponse } from 'next/server';
import type { YearInReview, ShareableCard } from '@/types';

// Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Generate review endpoint is ready',
    method: 'POST',
    requiredFields: ['summonerName', 'region', 'year'],
    envCheck: {
      hasRiotKey: !!process.env.RIOT_API_KEY && process.env.RIOT_API_KEY !== 'your_riot_api_key_here',
      riotKeyPrefix: process.env.RIOT_API_KEY?.substring(0, 10) || 'not set'
    }
  });
}

export async function POST(request: NextRequest) {
  console.log('[API] POST /api/generate-review called');

  try {
    console.log('[API] Parsing request body...');
    const { summonerName, region, year } = await request.json();
    console.log('[API] Request:', { summonerName, region, year });

    // Lazy import services to avoid initialization errors
    console.log('[API] Importing services...');
    const { riotApi } = await import('@/services/riotApi');
    const { bedrockService } = await import('@/services/bedrockService');
    const { dataProcessor } = await import('@/services/dataProcessor');
    const { improvementAnalyzer } = await import('@/services/improvementAnalyzer');
    const { recapFeaturesAnalyzer } = await import('@/services/recapFeatures');
    console.log('[API] Services imported successfully');

    // Validate inputs
    console.log('[API] Validating inputs...');
    if (!summonerName || !region || !year) {
      console.log('[API] Validation failed - missing parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    console.log('[API] Validation passed');

    // Step 1: Get player information
    console.log('[API] Calling Riot API for player:', summonerName);
    const playerResult = await riotApi.getPlayerByName(summonerName, region);
    console.log('[API] Riot API response:', playerResult.success ? 'Success' : 'Failed');
    if (!playerResult.success) {
      console.log('[API] Riot API error:', playerResult.error);
    }
    if (!playerResult.success || !playerResult.data) {
      return NextResponse.json(
        { error: playerResult.error || 'Player not found' },
        { status: 404 }
      );
    }
    console.log('[API] Player found:', playerResult.data.summonerName);

    const player = playerResult.data;

    // Step 2: Fetch year match history
    console.log('[API] Fetching match history for:', player.puuid);
    const matchHistoryResult = await riotApi.getYearMatchHistory(
      player.puuid,
      region,
      year
    );
    console.log('[API] Match history result:', matchHistoryResult.success ? 'Success' : 'Failed');

    if (!matchHistoryResult.success || !matchHistoryResult.data) {
      console.log('[API] Match history error:', matchHistoryResult.error);
      return NextResponse.json(
        { error: matchHistoryResult.error || 'Failed to fetch match history' },
        { status: 500 }
      );
    }

    const matches = matchHistoryResult.data;
    console.log('[API] Found', matches.length, 'matches for year', year);

    if (matches.length === 0) {
      console.log('[API] No matches found - returning 404');
      return NextResponse.json(
        { error: 'No ranked matches found for this year' },
        { status: 404 }
      );
    }

    // Step 3: Process match data
    const { summary, statistics, achievements } = dataProcessor.processYearData(
      matches,
      player.puuid,
      year
    );

    // Step 4: Generate AI insights (optional - will use placeholders if AWS fails)
    let insights;
    try {
      console.log('[API] Generating AI insights with AWS Bedrock...');
      insights = await bedrockService.generateYearInReviewInsights(
        summary,
        statistics
      );

      // Step 5: Generate progression narrative
      const progressionNarrative = await bedrockService.generateProgressionNarrative(
        summary,
        statistics
      );
      insights.progressionNarrative = progressionNarrative;
      console.log('[API] AI insights generated successfully');
    } catch (error: any) {
      console.log('[API] AWS Bedrock not configured, using placeholder insights');
      // Use placeholder insights if AWS is not configured
      insights = {
        personalizedSummary: `You played ${summary.totalGames} games this year with a ${summary.winRate.toFixed(1)}% win rate. Your main champion was ${summary.favoriteChampion}!`,
        strengths: [
          `Consistent performance with ${statistics.performanceMetrics.averageKDA.toFixed(2)} average KDA`,
          `Good vision control with ${statistics.performanceMetrics.averageVisionScore.toFixed(1)} average vision score`,
          `Strong ${summary.favoriteRole} gameplay`
        ],
        areasForImprovement: [
          'Continue improving consistency across all champions',
          'Focus on objective control and map awareness',
          'Practice champions outside your main pool'
        ],
        playstyleAnalysis: `You're a ${summary.favoriteRole} main who favors ${summary.favoriteChampion}. Your playstyle shows solid fundamentals with room to grow.`,
        progressionNarrative: `Throughout ${year}, you've shown dedication by playing ${summary.totalGames} ranked games.`,
        funFacts: [
          `You spent ${Math.floor(summary.totalPlaytime / 60)} hours in the Rift!`,
          `Your longest win streak was ${statistics.streaks.longestWinStreak} games`,
          `You played ${statistics.championStats.length} different champions`
        ],
        motivationalMessage: 'Keep climbing and improving! Every game is a learning opportunity.',
        predictedRankNextSeason: 'Higher than this season with continued practice!'
      };
    }

    // Step 6: Create visualization data
    const visualizations = {
      championPlayRate: statistics.championStats.slice(0, 10).map(c => ({
        champion: c.championName,
        games: c.gamesPlayed,
      })),
      winRateOverTime: statistics.timelineData.map(t => ({
        date: t.month,
        winRate: t.winRate,
      })),
      performanceRadar: [
        {
          category: 'KDA',
          value: Math.min(statistics.performanceMetrics.averageKDA * 20, 100),
          percentile: 75,
        },
        {
          category: 'Vision',
          value: Math.min(statistics.performanceMetrics.averageVisionScore * 2, 100),
          percentile: 68,
        },
        {
          category: 'Gold/min',
          value: Math.min((statistics.performanceMetrics.averageGoldPerMinute / 500) * 100, 100),
          percentile: 70,
        },
        {
          category: 'Damage/min',
          value: Math.min((statistics.performanceMetrics.averageDamagePerMinute / 1000) * 100, 100),
          percentile: 72,
        },
        {
          category: 'Kill Part.',
          value: statistics.performanceMetrics.killParticipation,
          percentile: 65,
        },
      ],
      rankProgression: [], // Would need rank tracking data
    };

    // Step 7: Create shareable cards metadata
    const shareableCards: ShareableCard[] = [
      {
        id: 'champion-main',
        type: 'champion-main',
        title: `${summary.favoriteChampion} Main`,
        data: statistics.championStats[0],
      },
      {
        id: 'performance-stats',
        type: 'performance-stats',
        title: 'Performance Stats',
        data: statistics.performanceMetrics,
      },
      {
        id: 'achievements',
        type: 'achievements',
        title: 'Achievements',
        data: achievements,
      },
      {
        id: 'year-recap',
        type: 'year-recap',
        title: `${year} Year in Review`,
        data: { summary, insights: insights.personalizedSummary },
      },
    ];

    // Step 8: Generate improvement plan
    console.log('[API] Generating improvement plan...');
    const improvementPlan = improvementAnalyzer.generateImprovementPlan(summary, statistics);
    console.log('[API] Improvement plan generated');

    // Step 9: Generate recap features (personality, weird stats, timeline)
    console.log('[API] Generating recap features...');
    const personality = recapFeaturesAnalyzer.analyzePersonality(summary, statistics);
    const weirdStats = recapFeaturesAnalyzer.generateWeirdStats(summary, statistics, matches, player.puuid);
    const evolutionTimeline = recapFeaturesAnalyzer.generateEvolutionTimeline(summary, statistics, matches, player.puuid);
    console.log('[API] Recap features generated');

    // Step 10: Build final response
    const yearInReview: YearInReview = {
      playerId: player.puuid,
      year,
      generatedAt: new Date().toISOString(),
      summary,
      statistics,
      achievements,
      insights,
      visualizations,
      shareableCards,
      improvementPlan,
      personality,
      weirdStats,
      evolutionTimeline,
    };

    return NextResponse.json(yearInReview);
  } catch (error: any) {
    console.error('[API] Error generating review:', error);
    console.error('[API] Error stack:', error.stack);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        details: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
