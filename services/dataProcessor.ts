import {
  MatchData,
  Summary,
  Statistics,
  ChampionStats,
  RoleStats,
  PerformanceMetrics,
  ObjectiveStats,
  FarmingStats,
  DamageStats,
  CombatStats,
  CommunicationStats,
  AdvancedStats,
  TimelineData,
  Streaks,
  Achievement,
  YearInReview,
} from '../types';
import { format, startOfMonth } from 'date-fns';

export class DataProcessor {
  /**
   * Process full year of matches into comprehensive statistics
   */
  processYearData(
    matches: MatchData[],
    playerPuuid: string,
    year: number
  ): { summary: Summary; statistics: Statistics; achievements: Achievement[] } {
    // Sort matches by date
    const sortedMatches = matches.sort((a, b) => a.gameCreation - b.gameCreation);

    // Extract player-specific data from each match
    const playerMatches = sortedMatches.map(match => {
      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      return { match, playerData };
    }).filter(m => m.playerData !== undefined);

    const summary = this.generateSummary(playerMatches, year);
    const statistics = this.generateStatistics(playerMatches);
    const achievements = this.generateAchievements(playerMatches, summary, statistics);

    return { summary, statistics, achievements };
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(
    playerMatches: Array<{ match: MatchData; playerData: any }>,
    year: number
  ): Summary {
    const totalGames = playerMatches.length;
    const totalWins = playerMatches.filter(m => m.playerData.win).length;
    const totalLosses = totalGames - totalWins;
    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

    // Calculate total playtime in minutes
    const totalPlaytime = playerMatches.reduce(
      (sum, m) => sum + m.match.gameDuration / 60,
      0
    );

    // Find favorite champion
    const championCounts = new Map<string, number>();
    playerMatches.forEach(m => {
      const count = championCounts.get(m.playerData.championName) || 0;
      championCounts.set(m.playerData.championName, count + 1);
    });
    const favoriteChampion =
      [...championCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // Find favorite role
    const roleCounts = new Map<string, number>();
    playerMatches.forEach(m => {
      const role = m.playerData.role || 'FILL';
      const count = roleCounts.get(role) || 0;
      roleCounts.set(role, count + 1);
    });
    const favoriteRole =
      [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'FILL';

    // Get date range
    const startDate =
      playerMatches.length > 0
        ? format(new Date(playerMatches[0].match.gameCreation), 'MMM yyyy')
        : `Jan ${year}`;
    const endDate =
      playerMatches.length > 0
        ? format(
            new Date(playerMatches[playerMatches.length - 1].match.gameCreation),
            'MMM yyyy'
          )
        : `Dec ${year}`;

    return {
      totalGames,
      totalWins,
      totalLosses,
      winRate,
      totalPlaytime,
      favoriteChampion,
      favoriteRole,
      startDate,
      endDate,
    };
  }

  /**
   * Generate detailed statistics
   */
  private generateStatistics(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): Statistics {
    return {
      championStats: this.generateChampionStats(playerMatches),
      roleStats: this.generateRoleStats(playerMatches),
      performanceMetrics: this.generatePerformanceMetrics(playerMatches),
      objectiveStats: this.generateObjectiveStats(playerMatches),
      farmingStats: this.generateFarmingStats(playerMatches),
      damageStats: this.generateDamageStats(playerMatches),
      combatStats: this.generateCombatStats(playerMatches),
      communicationStats: this.generateCommunicationStats(playerMatches),
      advancedStats: this.generateAdvancedStats(playerMatches),
      timelineData: this.generateTimelineData(playerMatches),
      streaks: this.calculateStreaks(playerMatches),
    };
  }

  /**
   * Generate champion statistics
   */
  private generateChampionStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): ChampionStats[] {
    const championMap = new Map<string, any>();

    playerMatches.forEach(({ playerData }) => {
      const champName = playerData.championName;
      if (!championMap.has(champName)) {
        championMap.set(champName, {
          championName: champName,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          totalKills: 0,
          totalDeaths: 0,
          totalAssists: 0,
        });
      }

      const stats = championMap.get(champName);
      stats.gamesPlayed++;
      if (playerData.win) stats.wins++;
      else stats.losses++;
      stats.totalKills += playerData.kills;
      stats.totalDeaths += playerData.deaths;
      stats.totalAssists += playerData.assists;
    });

    return [...championMap.values()]
      .map(stats => ({
        championName: stats.championName,
        gamesPlayed: stats.gamesPlayed,
        wins: stats.wins,
        losses: stats.losses,
        winRate: (stats.wins / stats.gamesPlayed) * 100,
        avgKills: stats.totalKills / stats.gamesPlayed,
        avgDeaths: stats.totalDeaths / stats.gamesPlayed,
        avgAssists: stats.totalAssists / stats.gamesPlayed,
        avgKDA:
          stats.totalDeaths > 0
            ? (stats.totalKills + stats.totalAssists) / stats.totalDeaths
            : stats.totalKills + stats.totalAssists,
      }))
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed);
  }

  /**
   * Generate role statistics
   */
  private generateRoleStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): RoleStats[] {
    const roleMap = new Map<string, any>();

    playerMatches.forEach(({ playerData }) => {
      const role = playerData.role || 'FILL';
      if (!roleMap.has(role)) {
        roleMap.set(role, {
          role,
          gamesPlayed: 0,
          wins: 0,
          totalKDA: 0,
        });
      }

      const stats = roleMap.get(role);
      stats.gamesPlayed++;
      if (playerData.win) stats.wins++;

      const kda =
        playerData.deaths > 0
          ? (playerData.kills + playerData.assists) / playerData.deaths
          : playerData.kills + playerData.assists;
      stats.totalKDA += kda;
    });

    return [...roleMap.values()].map(stats => ({
      role: stats.role,
      gamesPlayed: stats.gamesPlayed,
      winRate: (stats.wins / stats.gamesPlayed) * 100,
      avgPerformance: stats.totalKDA / stats.gamesPlayed,
    }));
  }

  /**
   * Generate performance metrics
   */
  private generatePerformanceMetrics(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): PerformanceMetrics {
    let totalKDA = 0;
    let totalVisionScore = 0;
    let totalGold = 0;
    let totalDamage = 0;
    let totalGameDuration = 0;
    let totalKillParticipation = 0;

    playerMatches.forEach(({ match, playerData }) => {
      const kda =
        playerData.deaths > 0
          ? (playerData.kills + playerData.assists) / playerData.deaths
          : playerData.kills + playerData.assists;

      totalKDA += kda;
      totalVisionScore += playerData.visionScore;
      totalGold += playerData.goldEarned;
      totalDamage += playerData.totalDamageDealtToChampions;
      totalGameDuration += match.gameDuration;

      // Calculate kill participation
      const teamKills = match.participants
        .filter(p => p.win === playerData.win)
        .reduce((sum, p) => sum + p.kills, 0);

      if (teamKills > 0) {
        const kp = ((playerData.kills + playerData.assists) / teamKills) * 100;
        totalKillParticipation += kp;
      }
    });

    const totalGames = playerMatches.length;
    const totalMinutes = totalGameDuration / 60;

    return {
      averageKDA: totalKDA / totalGames,
      averageVisionScore: totalVisionScore / totalGames,
      averageGoldPerMinute: totalGold / totalMinutes,
      averageDamagePerMinute: totalDamage / totalMinutes,
      killParticipation: totalKillParticipation / totalGames,
    };
  }

  /**
   * Generate objective statistics (Baron, Dragons)
   */
  private generateObjectiveStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): ObjectiveStats {
    let totalBaronsKilled = 0;
    let totalDragonsKilled = 0;

    playerMatches.forEach(({ playerData }) => {
      // Use optional chaining since these fields might not exist in older data
      totalBaronsKilled += playerData.baronKills || 0;
      totalDragonsKilled += playerData.dragonKills || 0;
    });

    const totalGames = playerMatches.length;
    const baronKillRate = totalGames > 0 ? totalBaronsKilled / totalGames : 0;
    const dragonKillRate = totalGames > 0 ? totalDragonsKilled / totalGames : 0;

    // Calculate objective control score (0-100)
    // Based on: Baron kills (weighted 2x) + Dragon kills
    // Assuming good players average ~0.5 barons and ~2 dragons per game
    const baronScore = Math.min((baronKillRate / 0.5) * 40, 40);
    const dragonScore = Math.min((dragonKillRate / 2.0) * 60, 60);
    const objectiveControlScore = Math.round(baronScore + dragonScore);

    let totalTurretsDestroyed = 0;
    let totalInhibitorsDestroyed = 0;
    let totalDamageToObjectives = 0;
    let totalDamageToTurrets = 0;

    playerMatches.forEach(({ playerData }) => {
      totalTurretsDestroyed += playerData.turretKills || 0;
      totalInhibitorsDestroyed += playerData.inhibitorKills || 0;
      totalDamageToObjectives += playerData.damageDealtToObjectives || 0;
      totalDamageToTurrets += playerData.damageDealtToTurrets || 0;
    });

    return {
      totalBaronsKilled,
      totalDragonsKilled,
      baronKillRate,
      dragonKillRate,
      objectiveControlScore,
      totalTurretsDestroyed,
      totalInhibitorsDestroyed,
      averageDamageToObjectives: totalGames > 0 ? totalDamageToObjectives / totalGames : 0,
      averageDamageToTurrets: totalGames > 0 ? totalDamageToTurrets / totalGames : 0,
    };
  }

  /**
   * Generate farming statistics (Tier 1)
   */
  private generateFarmingStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): FarmingStats {
    let totalCS = 0;
    let totalJungleCS = 0;
    let enemyJungleCS = 0;
    let allyJungleCS = 0;
    let totalGameDuration = 0;

    playerMatches.forEach(({ match, playerData }) => {
      const minions = playerData.totalMinionsKilled || 0;
      const jungle = playerData.neutralMinionsKilled || 0;

      totalCS += minions + jungle;
      totalJungleCS += jungle;
      enemyJungleCS += playerData.totalEnemyJungleMinionsKilled || 0;
      allyJungleCS += playerData.totalAllyJungleMinionsKilled || 0;
      totalGameDuration += match.gameDuration;
    });

    const totalGames = playerMatches.length;
    const totalMinutes = totalGameDuration / 60;

    return {
      totalCS,
      averageCSPerGame: totalGames > 0 ? totalCS / totalGames : 0,
      averageCSPerMinute: totalMinutes > 0 ? totalCS / totalMinutes : 0,
      totalJungleCS,
      averageJungleCSPerGame: totalGames > 0 ? totalJungleCS / totalGames : 0,
      enemyJungleCS,
      allyJungleCS,
    };
  }

  /**
   * Generate damage statistics (Tier 1)
   */
  private generateDamageStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): DamageStats {
    let totalDamage = 0;
    let physicalDamage = 0;
    let magicDamage = 0;
    let trueDamage = 0;
    let damageToChampions = 0;
    let physicalToChampions = 0;
    let magicToChampions = 0;
    let trueToChampions = 0;
    let damageTaken = 0;
    let damageMitigated = 0;

    playerMatches.forEach(({ playerData }) => {
      totalDamage += playerData.totalDamageDealt || 0;
      physicalDamage += playerData.physicalDamageDealt || 0;
      magicDamage += playerData.magicDamageDealt || 0;
      trueDamage += playerData.trueDamageDealt || 0;
      damageToChampions += playerData.totalDamageDealtToChampions || 0;
      physicalToChampions += playerData.physicalDamageDealtToChampions || 0;
      magicToChampions += playerData.magicDamageDealtToChampions || 0;
      trueToChampions += playerData.trueDamageDealtToChampions || 0;
      damageTaken += playerData.totalDamageTaken || 0;
      damageMitigated += playerData.damageSelfMitigated || 0;
    });

    const totalGames = playerMatches.length;
    const totalChampionDamage = physicalToChampions + magicToChampions + trueToChampions;

    return {
      averageTotalDamage: totalGames > 0 ? totalDamage / totalGames : 0,
      averagePhysicalDamage: totalGames > 0 ? physicalDamage / totalGames : 0,
      averageMagicDamage: totalGames > 0 ? magicDamage / totalGames : 0,
      averageTrueDamage: totalGames > 0 ? trueDamage / totalGames : 0,
      averageDamageToChampions: totalGames > 0 ? damageToChampions / totalGames : 0,
      physicalDamagePercent: totalChampionDamage > 0 ? (physicalToChampions / totalChampionDamage) * 100 : 0,
      magicDamagePercent: totalChampionDamage > 0 ? (magicToChampions / totalChampionDamage) * 100 : 0,
      trueDamagePercent: totalChampionDamage > 0 ? (trueToChampions / totalChampionDamage) * 100 : 0,
      averageDamageTaken: totalGames > 0 ? damageTaken / totalGames : 0,
      averageDamageMitigated: totalGames > 0 ? damageMitigated / totalGames : 0,
      effectiveTankScore: totalGames > 0 ? ((damageTaken + damageMitigated) / totalGames) / 100 : 0,
    };
  }

  /**
   * Generate combat statistics (Tier 2)
   */
  private generateCombatStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): CombatStats {
    let largestKillingSpree = 0;
    let largestMultiKill = 0;
    let totalKillingSprees = 0;
    let totalCCTime = 0;
    let totalHealingDone = 0;
    let totalTeammateHeals = 0;
    let totalAlliesHealed = 0;

    playerMatches.forEach(({ playerData }) => {
      largestKillingSpree = Math.max(largestKillingSpree, playerData.largestKillingSpree || 0);
      largestMultiKill = Math.max(largestMultiKill, playerData.largestMultiKill || 0);
      totalKillingSprees += playerData.killingSprees || 0;
      totalCCTime += playerData.timeCCingOthers || 0;
      totalHealingDone += playerData.totalHeal || 0;
      totalTeammateHeals += playerData.totalHealsOnTeammates || 0;
      totalAlliesHealed += playerData.totalUnitsHealed || 0;
    });

    const totalGames = playerMatches.length;

    return {
      largestKillingSpree,
      largestMultiKill,
      totalKillingSprees,
      averageKillingSprees: totalGames > 0 ? totalKillingSprees / totalGames : 0,
      totalCCTime,
      averageCCTimePerGame: totalGames > 0 ? totalCCTime / totalGames : 0,
      totalHealingDone,
      averageHealingPerGame: totalGames > 0 ? totalHealingDone / totalGames : 0,
      totalTeammateHeals,
      averageAlliesHealed: totalGames > 0 ? totalAlliesHealed / totalGames : 0,
    };
  }

  /**
   * Generate communication statistics (Tier 3)
   */
  private generateCommunicationStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): CommunicationStats {
    let allInPings = 0;
    let assistMePings = 0;
    let dangerPings = 0;
    let enemyMissingPings = 0;
    let onMyWayPings = 0;
    let pushPings = 0;

    playerMatches.forEach(({ playerData }) => {
      allInPings += playerData.allInPings || 0;
      assistMePings += playerData.assistMePings || 0;
      dangerPings += playerData.dangerPings || 0;
      enemyMissingPings += playerData.enemyMissingPings || 0;
      onMyWayPings += playerData.onMyWayPings || 0;
      pushPings += playerData.pushPings || 0;
    });

    const totalPings = allInPings + assistMePings + dangerPings + enemyMissingPings + onMyWayPings + pushPings;
    const totalGames = playerMatches.length;
    const pingsPerGame = totalGames > 0 ? totalPings / totalGames : 0;

    let communicationStyle: 'silent' | 'tactical' | 'chatty' | 'spam';
    if (pingsPerGame < 10) communicationStyle = 'silent';
    else if (pingsPerGame < 30) communicationStyle = 'tactical';
    else if (pingsPerGame < 60) communicationStyle = 'chatty';
    else communicationStyle = 'spam';

    return {
      totalPings,
      averagePingsPerGame: pingsPerGame,
      pingBreakdown: {
        allIn: allInPings,
        assistMe: assistMePings,
        danger: dangerPings,
        enemyMissing: enemyMissingPings,
        onMyWay: onMyWayPings,
        push: pushPings,
      },
      communicationStyle,
    };
  }

  /**
   * Generate advanced statistics (Tier 3)
   */
  private generateAdvancedStats(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): AdvancedStats {
    let totalAbilityCasts = 0;
    let totalSummonerCasts = 0;
    let totalConsumablesPurchased = 0;
    let totalControlWards = 0;

    playerMatches.forEach(({ playerData }) => {
      const abilityCasts = (playerData.spell1Casts || 0) +
                          (playerData.spell2Casts || 0) +
                          (playerData.spell3Casts || 0) +
                          (playerData.spell4Casts || 0);
      const summonerCasts = (playerData.summoner1Casts || 0) + (playerData.summoner2Casts || 0);

      totalAbilityCasts += abilityCasts;
      totalSummonerCasts += summonerCasts;
      totalConsumablesPurchased += playerData.consumablesPurchased || 0;
      totalControlWards += playerData.detectorWardsPlaced || 0;
    });

    const totalGames = playerMatches.length;

    return {
      totalAbilityCasts,
      averageAbilityCastsPerGame: totalGames > 0 ? totalAbilityCasts / totalGames : 0,
      totalSummonerCasts,
      totalConsumablesPurchased,
      averageConsumablesPerGame: totalGames > 0 ? totalConsumablesPurchased / totalGames : 0,
      totalControlWards,
      averageControlWardsPerGame: totalGames > 0 ? totalControlWards / totalGames : 0,
    };
  }

  /**
   * Generate timeline data by month
   */
  private generateTimelineData(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): TimelineData[] {
    const monthMap = new Map<string, any>();

    playerMatches.forEach(({ match, playerData }) => {
      const monthKey = format(startOfMonth(new Date(match.gameCreation)), 'MMM yyyy');

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          month: monthKey,
          games: 0,
          wins: 0,
          totalKDA: 0,
        });
      }

      const data = monthMap.get(monthKey);
      data.games++;
      if (playerData.win) data.wins++;

      const kda =
        playerData.deaths > 0
          ? (playerData.kills + playerData.assists) / playerData.deaths
          : playerData.kills + playerData.assists;
      data.totalKDA += kda;
    });

    return [...monthMap.values()]
      .map(data => ({
        month: data.month,
        games: data.games,
        winRate: (data.wins / data.games) * 100,
        avgKDA: data.totalKDA / data.games,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }

  /**
   * Calculate win/loss streaks
   */
  private calculateStreaks(
    playerMatches: Array<{ match: MatchData; playerData: any }>
  ): Streaks {
    let longestWinStreak = 0;
    let longestLossStreak = 0;
    let currentStreak = 0;
    let currentStreakType: 'win' | 'loss' = 'win';

    let tempWinStreak = 0;
    let tempLossStreak = 0;

    playerMatches.forEach(({ playerData }) => {
      if (playerData.win) {
        tempWinStreak++;
        tempLossStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, tempWinStreak);
      } else {
        tempLossStreak++;
        tempWinStreak = 0;
        longestLossStreak = Math.max(longestLossStreak, tempLossStreak);
      }
    });

    // Determine current streak from last games
    const lastMatch = playerMatches[playerMatches.length - 1];
    if (lastMatch) {
      currentStreakType = lastMatch.playerData.win ? 'win' : 'loss';
      currentStreak = currentStreakType === 'win' ? tempWinStreak : tempLossStreak;
    }

    return {
      longestWinStreak,
      longestLossStreak,
      currentStreak,
      streakType: currentStreakType,
    };
  }

  /**
   * Generate achievements based on player performance
   */
  private generateAchievements(
    playerMatches: Array<{ match: MatchData; playerData: any }>,
    summary: Summary,
    statistics: Statistics
  ): Achievement[] {
    const achievements: Achievement[] = [];

    // Pentakill achievement
    const pentakills = playerMatches.filter(m => m.playerData.pentaKills > 0).length;
    if (pentakills > 0) {
      achievements.push({
        id: 'pentakill',
        title: pentakills === 1 ? 'Pentakill!' : `${pentakills} Pentakills!`,
        description: 'Achieved the ultimate display of dominance',
        icon: '🔥',
        rarity: pentakills >= 5 ? 'legendary' : pentakills >= 3 ? 'epic' : 'rare',
        unlockedAt: new Date().toISOString(),
      });
    }

    // Win streak achievement
    if (statistics.streaks.longestWinStreak >= 5) {
      achievements.push({
        id: 'win-streak',
        title: `${statistics.streaks.longestWinStreak}-Game Win Streak`,
        description: 'Unstoppable momentum',
        icon: '🏆',
        rarity:
          statistics.streaks.longestWinStreak >= 10
            ? 'legendary'
            : statistics.streaks.longestWinStreak >= 7
            ? 'epic'
            : 'rare',
        unlockedAt: new Date().toISOString(),
      });
    }

    // Champion mastery achievement
    const topChamp = statistics.championStats[0];
    if (topChamp && topChamp.gamesPlayed >= 50) {
      achievements.push({
        id: 'champion-main',
        title: `${topChamp.championName} Main`,
        description: `Played ${topChamp.gamesPlayed} games on ${topChamp.championName}`,
        icon: '⭐',
        rarity: topChamp.gamesPlayed >= 100 ? 'legendary' : 'epic',
        unlockedAt: new Date().toISOString(),
      });
    }

    // High KDA achievement
    if (statistics.performanceMetrics.averageKDA >= 3.0) {
      achievements.push({
        id: 'kda-king',
        title: 'KDA Perfectionist',
        description: `Maintained a ${statistics.performanceMetrics.averageKDA.toFixed(2)} average KDA`,
        icon: '💎',
        rarity: statistics.performanceMetrics.averageKDA >= 4.0 ? 'legendary' : 'epic',
        unlockedAt: new Date().toISOString(),
      });
    }

    // Vision achievement
    if (statistics.performanceMetrics.averageVisionScore >= 40) {
      achievements.push({
        id: 'vision-master',
        title: 'Vision Master',
        description: 'Superior map awareness and vision control',
        icon: '👁️',
        rarity: 'epic',
        unlockedAt: new Date().toISOString(),
      });
    }

    // Dedication achievement
    if (summary.totalGames >= 200) {
      achievements.push({
        id: 'dedicated',
        title: 'Dedicated Summoner',
        description: `Played ${summary.totalGames} games this year`,
        icon: '🎮',
        rarity: summary.totalGames >= 500 ? 'legendary' : 'epic',
        unlockedAt: new Date().toISOString(),
      });
    }

    return achievements;
  }
}

export const dataProcessor = new DataProcessor();
