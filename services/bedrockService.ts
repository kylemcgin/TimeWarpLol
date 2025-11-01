import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import {
  AIInsights,
  BedrockInsightRequest,
  BedrockInsightResponse,
  Summary,
  Statistics,
} from '../types';

export class BedrockService {
  private client: BedrockRuntimeClient;
  private modelId: string;

  constructor(region: string = 'us-east-1') {
    this.client = new BedrockRuntimeClient({ region });
    this.modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';
  }

  /**
   * Generate comprehensive year-in-review insights
   */
  async generateYearInReviewInsights(
    summary: Summary,
    statistics: Statistics
  ): Promise<AIInsights> {
    const prompt = this.buildYearReviewPrompt(summary, statistics);

    const response = await this.invokeModel(prompt);

    return this.parseYearReviewResponse(response);
  }

  /**
   * Generate personalized strengths analysis
   */
  async generateStrengthsAnalysis(
    summary: Summary,
    statistics: Statistics
  ): Promise<string[]> {
    const prompt = `You are analyzing League of Legends player data to identify their key strengths.

Player Summary:
- Total Games: ${summary.totalGames}
- Win Rate: ${summary.winRate.toFixed(1)}%
- Favorite Champion: ${summary.favoriteChampion}
- Favorite Role: ${summary.favoriteRole}

Performance Metrics:
- Average KDA: ${statistics.performanceMetrics.averageKDA.toFixed(2)}
- Vision Score: ${statistics.performanceMetrics.averageVisionScore.toFixed(1)}
- Gold Per Minute: ${statistics.performanceMetrics.averageGoldPerMinute.toFixed(0)}
- Damage Per Minute: ${statistics.performanceMetrics.averageDamagePerMinute.toFixed(0)}
- Kill Participation: ${statistics.performanceMetrics.killParticipation.toFixed(1)}%

Top Champions:
${statistics.championStats.slice(0, 5).map(c => `- ${c.championName}: ${c.gamesPlayed} games, ${c.winRate.toFixed(1)}% WR, ${c.avgKDA.toFixed(2)} KDA`).join('\n')}

Identify 3-5 key strengths this player demonstrates. Be specific and data-driven. Format as a JSON array of strings.`;

    const response = await this.invokeModel(prompt);
    return this.parseArrayResponse(response);
  }

  /**
   * Generate areas for improvement
   */
  async generateImprovementAreas(
    summary: Summary,
    statistics: Statistics
  ): Promise<string[]> {
    const prompt = `You are a League of Legends coach analyzing player data to provide constructive improvement suggestions.

Player Summary:
- Total Games: ${summary.totalGames}
- Win Rate: ${summary.winRate.toFixed(1)}%
- Current Longest Win Streak: ${statistics.streaks.longestWinStreak}
- Current Longest Loss Streak: ${statistics.streaks.longestLossStreak}

Performance Metrics:
- Average KDA: ${statistics.performanceMetrics.averageKDA.toFixed(2)}
- Vision Score: ${statistics.performanceMetrics.averageVisionScore.toFixed(1)}
- Gold Per Minute: ${statistics.performanceMetrics.averageGoldPerMinute.toFixed(0)}
- Kill Participation: ${statistics.performanceMetrics.killParticipation.toFixed(1)}%

Role Performance:
${statistics.roleStats.map(r => `- ${r.role}: ${r.gamesPlayed} games, ${r.winRate.toFixed(1)}% WR`).join('\n')}

Identify 3-5 specific, actionable areas for improvement. Be constructive and encouraging. Format as a JSON array of strings.`;

    const response = await this.invokeModel(prompt);
    return this.parseArrayResponse(response);
  }

  /**
   * Generate playstyle analysis
   */
  async generatePlaystyleAnalysis(
    summary: Summary,
    statistics: Statistics
  ): Promise<string> {
    const prompt = `You are a League of Legends analyst creating a personalized playstyle description.

Player Data:
- Favorite Champion: ${summary.favoriteChampion}
- Favorite Role: ${summary.favoriteRole}
- Win Rate: ${summary.winRate.toFixed(1)}%
- Average KDA: ${statistics.performanceMetrics.averageKDA.toFixed(2)}
- Vision Score: ${statistics.performanceMetrics.averageVisionScore.toFixed(1)}
- Kill Participation: ${statistics.performanceMetrics.killParticipation.toFixed(1)}%

Top 5 Champions:
${statistics.championStats.slice(0, 5).map(c => `- ${c.championName} (${c.gamesPlayed} games)`).join('\n')}

Create a 2-3 paragraph analysis describing this player's unique playstyle. Consider their champion preferences, role, and performance metrics. Make it personal and insightful. Return only the playstyle description text.`;

    const response = await this.invokeModel(prompt);
    return response.trim();
  }

  /**
   * Generate fun facts about the player's year
   */
  async generateFunFacts(
    summary: Summary,
    statistics: Statistics
  ): Promise<string[]> {
    const prompt = `Generate 5-7 fun, interesting, and sometimes quirky facts about this League of Legends player's year.

Player Summary:
- Total Games: ${summary.totalGames}
- Total Playtime: ${Math.floor(summary.totalPlaytime / 60)} hours
- Win Rate: ${summary.winRate.toFixed(1)}%
- Favorite Champion: ${summary.favoriteChampion}
- Longest Win Streak: ${statistics.streaks.longestWinStreak}
- Longest Loss Streak: ${statistics.streaks.longestLossStreak}

Make these facts entertaining, shareable, and relatable. Mix statistical insights with playful observations. Examples:
- "You spent enough time in the Rift to binge-watch [X TV series] twice"
- "Your [champion] obsession means you've played them more than some people's entire match history"
- "That [X] game win streak? You were unstoppable"

Format as a JSON array of strings. Be creative and fun!`;

    const response = await this.invokeModel(prompt);
    return this.parseArrayResponse(response);
  }

  /**
   * Generate progression narrative
   */
  async generateProgressionNarrative(
    summary: Summary,
    statistics: Statistics
  ): Promise<string> {
    const timelineData = statistics.timelineData;

    const prompt = `Create an engaging narrative about this player's progression throughout the year.

Timeline Data:
${timelineData.map(t => `${t.month}: ${t.games} games, ${t.winRate.toFixed(1)}% WR, ${t.avgKDA.toFixed(2)} KDA`).join('\n')}

Overall Performance:
- Started: ${summary.startDate}
- Total Games: ${summary.totalGames}
- Final Win Rate: ${summary.winRate.toFixed(1)}%

Create a compelling 2-3 paragraph story about their journey. Highlight key moments, growth patterns, and memorable stretches. Make it feel personal and celebratory. Return only the narrative text.`;

    const response = await this.invokeModel(prompt);
    return response.trim();
  }

  /**
   * Build comprehensive year review prompt
   */
  private buildYearReviewPrompt(summary: Summary, statistics: Statistics): string {
    return `You are creating a comprehensive, personalized year-in-review for a League of Legends player. Be enthusiastic, insightful, and encouraging.

PLAYER SUMMARY:
- Summoner: Player (anonymized)
- Total Games: ${summary.totalGames}
- Record: ${summary.totalWins}W - ${summary.totalLosses}L (${summary.winRate.toFixed(1)}% WR)
- Total Playtime: ${Math.floor(summary.totalPlaytime / 60)} hours
- Favorite Champion: ${summary.favoriteChampion}
- Favorite Role: ${summary.favoriteRole}
- Period: ${summary.startDate} to ${summary.endDate}

PERFORMANCE METRICS:
- Average KDA: ${statistics.performanceMetrics.averageKDA.toFixed(2)}
- Average Vision Score: ${statistics.performanceMetrics.averageVisionScore.toFixed(1)}
- Gold Per Minute: ${statistics.performanceMetrics.averageGoldPerMinute.toFixed(0)}
- Damage Per Minute: ${statistics.performanceMetrics.averageDamagePerMinute.toFixed(0)}
- Kill Participation: ${statistics.performanceMetrics.killParticipation.toFixed(1)}%

TOP CHAMPIONS:
${statistics.championStats.slice(0, 5).map((c, i) => `${i + 1}. ${c.championName}: ${c.gamesPlayed} games, ${c.winRate.toFixed(1)}% WR, ${c.avgKDA.toFixed(2)} KDA`).join('\n')}

STREAKS:
- Longest Win Streak: ${statistics.streaks.longestWinStreak}
- Longest Loss Streak: ${statistics.streaks.longestLossStreak}

Please provide a comprehensive analysis in the following JSON format:
{
  "personalizedSummary": "An engaging 2-3 sentence summary of their year",
  "strengths": ["strength1", "strength2", "strength3"],
  "areasForImprovement": ["area1", "area2", "area3"],
  "playstyleAnalysis": "A detailed paragraph about their playstyle",
  "funFacts": ["fact1", "fact2", "fact3", "fact4", "fact5"],
  "motivationalMessage": "An inspiring message for next season",
  "predictedRankNextSeason": "A prediction based on their trajectory"
}

Make it personal, data-driven, and celebratory!`;
  }

  /**
   * Invoke Bedrock model
   */
  private async invokeModel(prompt: string): Promise<string> {
    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    };

    const command = new InvokeModelCommand({
      modelId: this.modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.content[0].text;
  }

  /**
   * Parse year review response from Claude
   */
  private parseYearReviewResponse(response: string): AIInsights {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          personalizedSummary: parsed.personalizedSummary || '',
          strengths: parsed.strengths || [],
          areasForImprovement: parsed.areasForImprovement || [],
          playstyleAnalysis: parsed.playstyleAnalysis || '',
          progressionNarrative: '', // Will be generated separately
          funFacts: parsed.funFacts || [],
          motivationalMessage: parsed.motivationalMessage || '',
          predictedRankNextSeason: parsed.predictedRankNextSeason || '',
        };
      }
    } catch (error) {
      console.error('Error parsing Bedrock response:', error);
    }

    // Fallback to empty insights
    return {
      personalizedSummary: 'Your League journey this year was unique!',
      strengths: [],
      areasForImprovement: [],
      playstyleAnalysis: '',
      progressionNarrative: '',
      funFacts: [],
      motivationalMessage: 'Keep climbing in the new season!',
      predictedRankNextSeason: 'Higher than this season!',
    };
  }

  /**
   * Parse array response from Claude
   */
  private parseArrayResponse(response: string): string[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing array response:', error);
    }
    return [];
  }
}

export const bedrockService = new BedrockService();
