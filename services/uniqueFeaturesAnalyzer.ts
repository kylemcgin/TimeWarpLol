import {
  MatchData,
  Summary,
  Statistics,
  SurrenderAnalysis,
  BanAnalysis,
  RuneAnalysis,
  BuildPathAnalysis,
  FirstBloodStats,
  ComebackStats,
  PatchPerformance,
} from '../types';

export class UniqueFeaturesAnalyzer {
  /**
   * Analyze surrender behavior (Feature 3)
   */
  analyzeSurrenders(
    matches: MatchData[],
    playerPuuid: string
  ): SurrenderAnalysis {
    let totalSurrenders = 0;
    let earlySurrenders = 0;
    let totalGameLength = 0;
    let surrenderGameLength = 0;
    let gamesLostWithoutSurrender = 0;

    matches.forEach(match => {
      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      if (!playerData) return;

      const gameLengthMinutes = match.gameDuration / 60;
      totalGameLength += gameLengthMinutes;

      if (match.gameEndedInSurrender || match.gameEndedInEarlySurrender) {
        totalSurrenders++;
        surrenderGameLength += gameLengthMinutes;

        if (match.gameEndedInEarlySurrender) {
          earlySurrenders++;
        }
      } else if (!playerData.win) {
        gamesLostWithoutSurrender++;
      }
    });

    return {
      totalSurrenders,
      earlySurrenders,
      surrenderRate: matches.length > 0 ? (totalSurrenders / matches.length) * 100 : 0,
      gamesLostWithoutSurrender,
      averageGameLengthWhenSurrendered: totalSurrenders > 0 ? surrenderGameLength / totalSurrenders : 0,
    };
  }

  /**
   * Analyze ban patterns (Feature 4)
   */
  analyzeBans(matches: MatchData[], playerPuuid: string): BanAnalysis {
    const banCounts = new Map<number, number>();
    let totalBans = 0;

    matches.forEach(match => {
      if (!match.teams) return;

      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      if (!playerData) return;

      // Find player's team
      const playerTeam = match.teams.find(t =>
        match.participants.some(p => p.puuid === playerPuuid &&
          ((t.teamId === 100 && match.participants.indexOf(p) < 5) ||
           (t.teamId === 200 && match.participants.indexOf(p) >= 5)))
      );

      if (playerTeam && playerTeam.bans) {
        playerTeam.bans.forEach(ban => {
          if (ban.championId !== -1) {
            banCounts.set(ban.championId, (banCounts.get(ban.championId) || 0) + 1);
            totalBans++;
          }
        });
      }
    });

    const sortedBans = Array.from(banCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([championId, count]) => ({
        championId,
        championName: `Champion ${championId}`, // TODO: Map to actual names
        count,
      }));

    return {
      totalBans: sortedBans,
      mostBannedChampion: sortedBans[0]?.championName || 'None',
      banRate: matches.length > 0 ? (totalBans / matches.length) : 0,
      uniqueChampionsBanned: banCounts.size,
    };
  }

  /**
   * Analyze rune effectiveness (Feature 5)
   */
  analyzeRunes(matches: MatchData[], playerPuuid: string): RuneAnalysis {
    const keystoneCounts = new Map<number, { count: number; wins: number }>();
    const secondaryTreeCounts = new Map<number, { count: number }>();

    matches.forEach(match => {
      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      if (!playerData || !playerData.perks) return;

      // Get keystone (first selection of primary tree)
      const primaryTree = playerData.perks.styles?.[0];
      if (primaryTree && primaryTree.selections && primaryTree.selections.length > 0) {
        const keystoneId = primaryTree.selections[0].perk;
        const current = keystoneCounts.get(keystoneId) || { count: 0, wins: 0 };
        keystoneCounts.set(keystoneId, {
          count: current.count + 1,
          wins: current.wins + (playerData.win ? 1 : 0),
        });
      }

      // Get secondary tree
      const secondaryTree = playerData.perks.styles?.[1];
      if (secondaryTree) {
        const treeId = secondaryTree.style;
        const current = secondaryTreeCounts.get(treeId) || { count: 0 };
        secondaryTreeCounts.set(treeId, {
          count: current.count + 1,
        });
      }
    });

    const sortedKeystones = Array.from(keystoneCounts.entries())
      .sort((a, b) => b[1].count - a[1].count);

    const sortedSecondaryTrees = Array.from(secondaryTreeCounts.entries())
      .sort((a, b) => b[1].count - a[1].count);

    const mostUsedKeystone = sortedKeystones[0];
    const mostUsedSecondaryTree = sortedSecondaryTrees[0];

    const keystoneWinRates = sortedKeystones.map(([runeId, data]) => ({
      runeId,
      runeName: `Rune ${runeId}`, // TODO: Map to actual names
      wins: data.wins,
      games: data.count,
      winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
    }));

    return {
      mostUsedKeystone: {
        runeId: mostUsedKeystone?.[0] || 0,
        runeName: `Rune ${mostUsedKeystone?.[0] || 0}`,
        count: mostUsedKeystone?.[1].count || 0,
      },
      mostUsedSecondaryTree: {
        treeId: mostUsedSecondaryTree?.[0] || 0,
        treeName: `Tree ${mostUsedSecondaryTree?.[0] || 0}`,
        count: mostUsedSecondaryTree?.[1].count || 0,
      },
      keystoneWinRates: keystoneWinRates.slice(0, 5),
    };
  }

  /**
   * Analyze build paths (Feature 6)
   */
  analyzeBuildPaths(matches: MatchData[], playerPuuid: string): BuildPathAnalysis {
    const firstItemCounts = new Map<number, { count: number; wins: number }>();
    const coreItemCounts = new Map<string, { items: number[]; count: number; wins: number }>();

    matches.forEach(match => {
      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      if (!playerData) return;

      // Get first completed item (item0 is usually the first big item)
      if (playerData.item0 && playerData.item0 !== 0) {
        const current = firstItemCounts.get(playerData.item0) || { count: 0, wins: 0 };
        firstItemCounts.set(playerData.item0, {
          count: current.count + 1,
          wins: current.wins + (playerData.win ? 1 : 0),
        });
      }

      // Get core build (first 3 items)
      const coreItems = [
        playerData.item0 || 0,
        playerData.item1 || 0,
        playerData.item2 || 0,
      ].filter(item => item !== 0).sort((a, b) => a - b);

      if (coreItems.length >= 2) {
        const coreKey = coreItems.join('-');
        const current = coreItemCounts.get(coreKey) || { items: coreItems, count: 0, wins: 0 };
        coreItemCounts.set(coreKey, {
          items: coreItems,
          count: current.count + 1,
          wins: current.wins + (playerData.win ? 1 : 0),
        });
      }
    });

    const firstItemBuilds = Array.from(firstItemCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([itemId, data]) => ({
        itemId,
        itemName: `Item ${itemId}`,
        count: data.count,
        winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
      }));

    const coreItemBuilds = Array.from(coreItemCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(data => ({
        items: data.items,
        count: data.count,
        winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
      }));

    return {
      firstItemBuilds,
      coreItemBuilds,
      averageItemCompletionTime: [], // TODO: Requires timeline data
    };
  }

  /**
   * Analyze first blood stats (Feature 7)
   */
  analyzeFirstBlood(matches: MatchData[], playerPuuid: string): FirstBloodStats {
    let firstBloodKills = 0;
    let firstBloodAssists = 0;
    let firstBloodDeaths = 0;
    let firstTowerKills = 0;
    let firstTowerAssists = 0;

    matches.forEach(match => {
      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      if (!playerData) return;

      if (playerData.firstBloodKill) firstBloodKills++;
      if (playerData.firstBloodAssist) firstBloodAssists++;
      if (playerData.firstTowerKill) firstTowerKills++;
      if (playerData.firstTowerAssist) firstTowerAssists++;

      // Check if player died first (approximation)
      if (playerData.deaths > 0 && !playerData.firstBloodKill) {
        // This is a rough estimate - would need timeline for accuracy
        const earlyDeaths = playerData.deaths;
        if (earlyDeaths > 0) firstBloodDeaths++;
      }
    });

    const totalGames = matches.length;
    const firstBloodParticipation = firstBloodKills + firstBloodAssists;

    return {
      firstBloodKills,
      firstBloodAssists,
      firstBloodDeaths: Math.min(firstBloodDeaths, totalGames), // Cap at total games
      firstBloodParticipationRate: totalGames > 0 ? (firstBloodParticipation / totalGames) * 100 : 0,
      firstTowerKills,
      firstTowerAssists,
    };
  }

  /**
   * Analyze comeback wins (Feature 8)
   */
  analyzeComebacks(matches: MatchData[], playerPuuid: string): ComebackStats {
    let comebackWins = 0;
    let biggestComebackDeficit = 0;
    let biggestComebackMatchId = '';
    let totalDeficitOvercome = 0;

    matches.forEach(match => {
      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      if (!playerData || !playerData.win) return;

      // Estimate if this was a comeback based on deaths/kills early
      // A better implementation would use timeline data for gold at 15
      const kdaRatio = playerData.deaths > 0 ?
        (playerData.kills + playerData.assists) / playerData.deaths :
        (playerData.kills + playerData.assists);

      // If won despite poor KDA or lost structures, count as comeback
      if (kdaRatio < 1.5 || (playerData.nexusLost && playerData.nexusLost > 0)) {
        comebackWins++;
        const estimatedDeficit = Math.abs(1.5 - kdaRatio) * 1000; // Rough estimate
        totalDeficitOvercome += estimatedDeficit;

        if (estimatedDeficit > biggestComebackDeficit) {
          biggestComebackDeficit = estimatedDeficit;
          biggestComebackMatchId = match.matchId;
        }
      }
    });

    const totalWins = matches.filter(m => {
      const p = m.participants.find(p => p.puuid === playerPuuid);
      return p?.win;
    }).length;

    return {
      comebackWins,
      comebackRate: totalWins > 0 ? (comebackWins / totalWins) * 100 : 0,
      biggestComeback: {
        matchId: biggestComebackMatchId,
        goldDeficit: biggestComebackDeficit,
      },
      averageGoldDeficitOvercome: comebackWins > 0 ? totalDeficitOvercome / comebackWins : 0,
    };
  }

  /**
   * Analyze performance by patch (Feature 9)
   */
  analyzePatchPerformance(matches: MatchData[], playerPuuid: string): PatchPerformance {
    const patchStats = new Map<string, { games: number; wins: number; totalKDA: number }>();

    matches.forEach(match => {
      const playerData = match.participants.find(p => p.puuid === playerPuuid);
      if (!playerData || !match.gameVersion) return;

      // Extract patch number (e.g., "14.1.1" -> "14.1")
      const patchMatch = match.gameVersion.match(/(\d+\.\d+)/);
      const patch = patchMatch ? patchMatch[1] : match.gameVersion;

      const current = patchStats.get(patch) || { games: 0, wins: 0, totalKDA: 0 };
      const kda = playerData.deaths > 0 ?
        (playerData.kills + playerData.assists) / playerData.deaths :
        (playerData.kills + playerData.assists);

      patchStats.set(patch, {
        games: current.games + 1,
        wins: current.wins + (playerData.win ? 1 : 0),
        totalKDA: current.totalKDA + kda,
      });
    });

    const performanceByPatch = Array.from(patchStats.entries())
      .map(([patch, data]) => ({
        patch,
        games: data.games,
        winRate: data.games > 0 ? (data.wins / data.games) * 100 : 0,
        avgKDA: data.games > 0 ? data.totalKDA / data.games : 0,
      }))
      .sort((a, b) => b.games - a.games);

    const bestPatch = performanceByPatch.reduce((best, current) =>
      current.winRate > best.winRate ? current : best,
      performanceByPatch[0] || { patch: 'N/A', winRate: 0, games: 0, avgKDA: 0 }
    );

    const worstPatch = performanceByPatch.reduce((worst, current) =>
      current.games >= 5 && current.winRate < worst.winRate ? current : worst,
      performanceByPatch[0] || { patch: 'N/A', winRate: 100, games: 0, avgKDA: 0 }
    );

    return {
      performanceByPatch,
      bestPatch: bestPatch.patch,
      worstPatch: worstPatch.patch,
    };
  }
}

export const uniqueFeaturesAnalyzer = new UniqueFeaturesAnalyzer();
