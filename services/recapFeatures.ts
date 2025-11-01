import { PlayerPersonality, WeirdStats, EvolutionTimeline, Summary, Statistics, MatchData } from '../types';

export class RecapFeaturesAnalyzer {
  /**
   * Analyze player personality based on playstyle
   */
  analyzePersonality(summary: Summary, statistics: Statistics): PlayerPersonality {
    const kda = statistics.performanceMetrics.averageKDA;
    const avgDeaths = kda > 0 ? (statistics.performanceMetrics.averageKDA - 1) / kda * 10 : 5; // Estimate
    const killParticipation = statistics.performanceMetrics.killParticipation;
    const visionScore = statistics.performanceMetrics.averageVisionScore;
    const champPool = statistics.championStats.length;
    const topChampGames = statistics.championStats[0]?.gamesPlayed || 0;
    const totalGames = summary.totalGames;

    // Calculate playstyle scores
    const aggression = this.calculateAggression(kda, avgDeaths);
    const safety = this.calculateSafety(avgDeaths, visionScore);
    const teamplay = this.calculateTeamplay(killParticipation, visionScore);
    const versatility = this.calculateVersatility(champPool, topChampGames, totalGames);

    // Determine personality type
    const personalityType = this.determinePersonalityType(
      aggression,
      safety,
      teamplay,
      versatility,
      kda,
      champPool,
      topChampGames,
      totalGames
    );

    return {
      ...personalityType,
      playstyleScore: {
        aggression,
        safety,
        teamplay,
        versatility,
      },
    };
  }

  /**
   * Generate weird/fun stats
   */
  generateWeirdStats(summary: Summary, statistics: Statistics, matches: MatchData[], playerPuuid: string): WeirdStats {
    const stats = [];

    // Time spent walking to lane (estimated)
    const avgGameLength = summary.totalPlaytime / summary.totalGames;
    const walkingTime = Math.round((summary.totalGames * 1.5) / 60); // ~1.5 min per game
    stats.push({
      label: `You spent ${walkingTime} hours just walking to lane`,
      value: `${walkingTime} hours`,
      emoji: '🚶',
      category: 'funny' as const,
    });

    // Estimated missed CS value
    const currentGold = statistics.performanceMetrics.averageGoldPerMinute * avgGameLength;
    const perfectGold = 400 * avgGameLength; // Perfect CS = ~400 gold/min
    const missedGold = Math.max(0, (perfectGold - currentGold) * summary.totalGames);
    if (missedGold > 0) {
      stats.push({
        label: `You missed CS worth ${Math.round(missedGold)} gold (that's ${Math.floor(missedGold / 3000)} Infinity Edges!)`,
        value: `${Math.round(missedGold)} gold`,
        emoji: '💰',
        category: 'concerning' as const,
      });
    }

    // Death count
    const kda = statistics.performanceMetrics.averageKDA;
    const estimatedDeaths = kda > 0 ? Math.round((summary.totalGames * 10) / kda) : summary.totalGames * 7;
    stats.push({
      label: `You died approximately ${estimatedDeaths} times this year`,
      value: estimatedDeaths,
      emoji: '💀',
      category: estimatedDeaths > 1000 ? 'concerning' as const : 'funny' as const,
    });

    // Vision wards
    const estimatedWardsPlaced = Math.round(statistics.performanceMetrics.averageVisionScore * summary.totalGames * 0.4);
    stats.push({
      label: `You placed ${estimatedWardsPlaced} wards (thanks for not being blind!)`,
      value: estimatedWardsPlaced,
      emoji: '👁️',
      category: estimatedWardsPlaced > 3000 ? 'impressive' as const : 'funny' as const,
    });

    // Win streak vs loss streak
    const streakDiff = statistics.streaks.longestWinStreak - statistics.streaks.longestLossStreak;
    if (streakDiff > 0) {
      stats.push({
        label: `Your longest win streak (${statistics.streaks.longestWinStreak}) beat your longest loss streak by ${streakDiff} games!`,
        value: statistics.streaks.longestWinStreak,
        emoji: '🔥',
        category: 'impressive' as const,
      });
    } else if (streakDiff < 0) {
      stats.push({
        label: `Your longest loss streak (${statistics.streaks.longestLossStreak}) was longer than your win streak... yikes`,
        value: statistics.streaks.longestLossStreak,
        emoji: '😅',
        category: 'concerning' as const,
      });
    }

    // Champion dedication
    const topChampPercentage = ((statistics.championStats[0]?.gamesPlayed || 0) / summary.totalGames) * 100;
    if (topChampPercentage > 60) {
      stats.push({
        label: `You're a true ${statistics.championStats[0]?.championName} main - ${topChampPercentage.toFixed(0)}% of your games!`,
        value: `${topChampPercentage.toFixed(0)}%`,
        emoji: '💎',
        category: 'impressive' as const,
      });
    }

    // Total playtime in different units
    const totalHours = Math.floor(summary.totalPlaytime / 60);
    const totalDays = (totalHours / 24).toFixed(1);
    stats.push({
      label: `You spent ${totalHours} hours (${totalDays} days) in the Rift`,
      value: `${totalDays} days`,
      emoji: '⏰',
      category: totalHours > 200 ? 'wild' as const : 'funny' as const,
    });

    // Damage dealt (estimated)
    const totalDamage = Math.round(
      statistics.performanceMetrics.averageDamagePerMinute * avgGameLength * summary.totalGames
    );
    stats.push({
      label: `You dealt ${(totalDamage / 1000000).toFixed(1)} MILLION damage this year`,
      value: `${(totalDamage / 1000000).toFixed(1)}M`,
      emoji: '💥',
      category: 'impressive' as const,
    });

    // Pentakills
    const totalPentas = matches.reduce((sum, match) => {
      const playerStats = match.participants.find((p) => p.puuid === playerPuuid);
      return sum + (playerStats?.pentaKills || 0);
    }, 0);
    if (totalPentas > 0) {
      stats.push({
        label: `You got ${totalPentas} PENTAKILL${totalPentas > 1 ? 'S' : ''} this year! 🎉`,
        value: totalPentas,
        emoji: '⭐',
        category: 'impressive' as const,
      });
    }

    // If they have no pentas
    if (totalPentas === 0 && summary.totalGames > 50) {
      stats.push({
        label: `${summary.totalGames} games and still no pentakill... maybe next year?`,
        value: 0,
        emoji: '😢',
        category: 'funny' as const,
      });
    }

    return { stats };
  }

  /**
   * Generate evolution timeline
   */
  generateEvolutionTimeline(summary: Summary, statistics: Statistics, matches: MatchData[], playerPuuid: string): EvolutionTimeline {
    const milestones = [];

    // Start of year
    if (matches.length > 0) {
      const firstMatch = matches[matches.length - 1];
      const firstDate = new Date(firstMatch.gameCreation);
      milestones.push({
        date: firstDate.toISOString(),
        month: firstDate.toLocaleDateString('en-US', { month: 'short' }),
        title: 'Your Journey Began',
        description: `You played your first ranked game of ${summary.startDate.substring(0, 4)}`,
        stats: {
          winRate: 50,
          kda: 2.0,
          gamesPlayed: 1,
        },
        type: 'milestone' as const,
      });
    }

    // Analyze timeline data for key moments
    const timelineData = statistics.timelineData || [];

    // Find best month
    const bestMonth = timelineData.reduce((best, current) =>
      current.winRate > best.winRate ? current : best
    , timelineData[0] || { month: 'Jan', winRate: 50, games: 0, avgKDA: 2 });

    if (bestMonth && bestMonth.games > 5) {
      milestones.push({
        date: `2025-${this.monthToNumber(bestMonth.month)}-15`,
        month: bestMonth.month,
        title: 'Peak Performance Month',
        description: `Your best month with ${bestMonth.winRate.toFixed(1)}% win rate!`,
        stats: {
          winRate: bestMonth.winRate,
          kda: bestMonth.avgKDA,
          gamesPlayed: bestMonth.games,
        },
        type: 'achievement' as const,
      });
    }

    // Longest win streak
    if (statistics.streaks.longestWinStreak >= 5) {
      milestones.push({
        date: '2025-06-15', // Estimated mid-year
        month: 'Jun',
        title: `${statistics.streaks.longestWinStreak}-Game Win Streak!`,
        description: 'You went on an unstoppable rampage',
        stats: {
          winRate: 100,
          kda: statistics.performanceMetrics.averageKDA * 1.3,
          gamesPlayed: statistics.streaks.longestWinStreak,
        },
        type: 'highlight' as const,
      });
    }

    // Main champion mastery
    const topChamp = statistics.championStats[0];
    if (topChamp && topChamp.gamesPlayed > 30) {
      milestones.push({
        date: '2025-08-01',
        month: 'Aug',
        title: `Became a ${topChamp.championName} Main`,
        description: `You've played ${topChamp.gamesPlayed} games with ${topChamp.winRate.toFixed(1)}% win rate`,
        stats: {
          winRate: topChamp.winRate,
          kda: topChamp.avgKDA,
          gamesPlayed: topChamp.gamesPlayed,
        },
        type: 'achievement' as const,
      });
    }

    // End of year summary
    milestones.push({
      date: new Date().toISOString(),
      month: 'Dec',
      title: 'Year End Stats',
      description: `You played ${summary.totalGames} games with ${summary.winRate.toFixed(1)}% win rate`,
      stats: {
        winRate: summary.winRate,
        kda: statistics.performanceMetrics.averageKDA,
        gamesPlayed: summary.totalGames,
      },
      type: 'milestone' as const,
    });

    return { milestones };
  }

  // Helper methods

  private calculateAggression(kda: number, avgDeaths: number): number {
    // High aggression = high KDA OR high deaths (risky plays)
    const kdaAggression = Math.min((kda / 4) * 100, 100);
    const deathAggression = Math.min((avgDeaths / 8) * 100, 100);
    return Math.round((kdaAggression + deathAggression) / 2);
  }

  private calculateSafety(avgDeaths: number, visionScore: number): number {
    // High safety = low deaths + good vision
    const deathSafety = Math.max(0, 100 - (avgDeaths / 10) * 100);
    const visionSafety = Math.min((visionScore / 50) * 100, 100);
    return Math.round((deathSafety + visionSafety) / 2);
  }

  private calculateTeamplay(killParticipation: number, visionScore: number): number {
    // High teamplay = high KP + good vision
    const kpScore = Math.min((killParticipation / 70) * 100, 100);
    const visionScore2 = Math.min((visionScore / 45) * 100, 100);
    return Math.round((kpScore + visionScore2) / 2);
  }

  private calculateVersatility(champPool: number, topChampGames: number, totalGames: number): number {
    // High versatility = many champs + not too focused on one
    const poolScore = Math.min((champPool / 15) * 100, 100);
    const diversityScore = Math.max(0, 100 - ((topChampGames / totalGames) * 150));
    return Math.round((poolScore + diversityScore) / 2);
  }

  private determinePersonalityType(
    aggression: number,
    safety: number,
    teamplay: number,
    versatility: number,
    kda: number,
    champPool: number,
    topChampGames: number,
    totalGames: number
  ): Omit<PlayerPersonality, 'playstyleScore'> {
    // One-Trick Pony (70%+ games on one champ)
    if (topChampGames / totalGames > 0.7) {
      return {
        type: 'one-trick-pony',
        title: 'The One-Trick Pony',
        description: 'You\'ve found your champion and you\'re sticking with it. Deep mastery over variety.',
        traits: [
          'Laser-focused on one champion',
          'Deep mechanical knowledge',
          'Comfort over flexibility',
          'Master of your craft',
        ],
      };
    }

    // Flex Player (10+ champs)
    if (champPool >= 10 && versatility > 60) {
      return {
        type: 'flex-player',
        title: 'The Flex Player',
        description: 'Adaptable and versatile, you can play whatever your team needs.',
        traits: [
          'Diverse champion pool',
          'Adaptable to team composition',
          'Quick learner',
          'Team-oriented mindset',
        ],
      };
    }

    // Calculated Assassin (high KDA, low deaths)
    if (kda >= 3.0 && safety > 60) {
      return {
        type: 'calculated-assassin',
        title: 'The Calculated Assassin',
        description: 'You strike with precision and escape unscathed. High reward, controlled risk.',
        traits: [
          'Excellent KDA management',
          'Plays safe when needed',
          'Calculated aggression',
          'Minimizes unnecessary deaths',
        ],
      };
    }

    // Strategic Mastermind (high teamplay)
    if (teamplay > 70) {
      return {
        type: 'strategic-mastermind',
        title: 'The Strategic Mastermind',
        description: 'You understand the macro game. Vision, objectives, and teamwork define your play.',
        traits: [
          'Excellent vision control',
          'High kill participation',
          'Team-oriented playstyle',
          'Understands macro gameplay',
        ],
      };
    }

    // Reckless Warrior (default for aggressive players)
    return {
      type: 'reckless-warrior',
      title: 'The Reckless Warrior',
      description: 'You play with heart and courage, sometimes too much. High risk, high reward.',
      traits: [
        'Aggressive playstyle',
        'Not afraid to make plays',
        'High action, high impact',
        'Lives for the thrill',
      ],
    };
  }

  private monthToNumber(month: string): string {
    const months: { [key: string]: string } = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12',
    };
    return months[month] || '01';
  }
}

export const recapFeaturesAnalyzer = new RecapFeaturesAnalyzer();
