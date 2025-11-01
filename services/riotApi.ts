import axios, { AxiosInstance } from 'axios';
import { Player, MatchData, RiotApiResponse } from '../types';

const REGIONS = {
  NA: 'na1.api.riotgames.com',
  EUW: 'euw1.api.riotgames.com',
  EUN: 'eun1.api.riotgames.com',
  KR: 'kr.api.riotgames.com',
  BR: 'br1.api.riotgames.com',
  JP: 'jp1.api.riotgames.com',
  LAN: 'la1.api.riotgames.com',
  LAS: 'la2.api.riotgames.com',
  OCE: 'oc1.api.riotgames.com',
  TR: 'tr1.api.riotgames.com',
  RU: 'ru.api.riotgames.com',
  PH: 'ph2.api.riotgames.com',
  SG: 'sg2.api.riotgames.com',
  TH: 'th2.api.riotgames.com',
  TW: 'tw2.api.riotgames.com',
  VN: 'vn2.api.riotgames.com',
};

const REGIONAL_ENDPOINTS = {
  AMERICAS: 'americas.api.riotgames.com',
  EUROPE: 'europe.api.riotgames.com',
  ASIA: 'asia.api.riotgames.com',
  SEA: 'sea.api.riotgames.com',
};

export class RiotApiService {
  private apiKey: string;
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.axiosInstance = axios.create({
      headers: {
        'X-Riot-Token': apiKey,
      },
    });
  }

  /**
   * Get player information by summoner name or Riot ID
   * Supports both formats:
   * - Old: "SummonerName"
   * - New Riot ID: "GameName#TAG"
   */
  async getPlayerByName(
    summonerName: string,
    region: keyof typeof REGIONS
  ): Promise<RiotApiResponse<Player>> {
    try {
      // Check if it's a Riot ID (contains #)
      if (summonerName.includes('#')) {
        return await this.getPlayerByRiotId(summonerName, region);
      }

      // Use old summoner name API
      const encodedName = encodeURIComponent(summonerName);
      const url = `https://${REGIONS[region]}/lol/summoner/v4/summoners/by-name/${encodedName}`;

      const response = await this.axiosInstance.get(url);

      return {
        success: true,
        data: {
          puuid: response.data.puuid,
          summonerName: response.data.name,
          region,
          profileIconId: response.data.profileIconId,
          summonerLevel: response.data.summonerLevel,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.status?.message || error.message,
      };
    }
  }

  /**
   * Get player information by Riot ID (GameName#TAG)
   */
  async getPlayerByRiotId(
    riotId: string,
    region: keyof typeof REGIONS
  ): Promise<RiotApiResponse<Player>> {
    try {
      const [gameName, tagLine] = riotId.split('#');
      if (!gameName || !tagLine) {
        return {
          success: false,
          error: 'Invalid Riot ID format. Use: GameName#TAG',
        };
      }

      const regionalEndpoint = this.getRegionalEndpoint(region);
      const encodedName = encodeURIComponent(gameName);
      const encodedTag = encodeURIComponent(tagLine);

      // Get PUUID from Riot ID
      const accountUrl = `https://${regionalEndpoint}/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`;
      const accountResponse = await this.axiosInstance.get(accountUrl);
      const puuid = accountResponse.data.puuid;

      // Get summoner info from PUUID (for level and icon)
      const summonerUrl = `https://${REGIONS[region]}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
      const summonerResponse = await this.axiosInstance.get(summonerUrl);

      // NOTE: The summoner endpoint no longer returns a 'name' field
      // We use the Riot ID (gameName#tagLine) as the display name instead
      return {
        success: true,
        data: {
          puuid: puuid,
          summonerName: `${accountResponse.data.gameName}#${accountResponse.data.tagLine}`,
          region,
          profileIconId: summonerResponse.data.profileIconId,
          summonerLevel: summonerResponse.data.summonerLevel,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.status?.message || error.message,
      };
    }
  }

  /**
   * Get player information by PUUID
   */
  async getPlayerByPuuid(
    puuid: string,
    region: keyof typeof REGIONS
  ): Promise<RiotApiResponse<Player>> {
    try {
      const url = `https://${REGIONS[region]}/lol/summoner/v4/summoners/by-puuid/${puuid}`;

      const response = await this.axiosInstance.get(url);

      return {
        success: true,
        data: {
          puuid: response.data.puuid,
          summonerName: response.data.name,
          region,
          profileIconId: response.data.profileIconId,
          summonerLevel: response.data.summonerLevel,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.status?.message || error.message,
      };
    }
  }

  /**
   * Get match IDs for a player within a date range
   */
  async getMatchIds(
    puuid: string,
    region: keyof typeof REGIONS,
    startTime?: number, // Unix timestamp in seconds
    endTime?: number,
    count: number = 100
  ): Promise<RiotApiResponse<string[]>> {
    try {
      const regionalEndpoint = this.getRegionalEndpoint(region);
      const params = new URLSearchParams({
        count: count.toString(),
        ...(startTime && { startTime: startTime.toString() }),
        ...(endTime && { endTime: endTime.toString() }),
        type: 'ranked', // Focus on ranked games for quality insights
      });

      const url = `https://${regionalEndpoint}/lol/match/v5/matches/by-puuid/${puuid}/ids?${params}`;

      const response = await this.axiosInstance.get(url);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.status?.message || error.message,
      };
    }
  }

  /**
   * Get detailed match data
   */
  async getMatchData(
    matchId: string,
    region: keyof typeof REGIONS
  ): Promise<RiotApiResponse<MatchData>> {
    try {
      const regionalEndpoint = this.getRegionalEndpoint(region);
      const url = `https://${regionalEndpoint}/lol/match/v5/matches/${matchId}`;

      const response = await this.axiosInstance.get(url);
      const matchInfo = response.data.info;

      const matchData: MatchData = {
        matchId,
        gameCreation: matchInfo.gameCreation,
        gameDuration: matchInfo.gameDuration,
        gameMode: matchInfo.gameMode,
        queueId: matchInfo.queueId,
        gameVersion: matchInfo.gameVersion,
        gameEndedInEarlySurrender: matchInfo.gameEndedInEarlySurrender,
        gameEndedInSurrender: matchInfo.gameEndedInSurrender,
        teams: matchInfo.teams?.map((t: any) => ({
          teamId: t.teamId,
          win: t.win,
          bans: t.bans || [],
          objectives: t.objectives,
        })),
        participants: matchInfo.participants.map((p: any) => ({
          puuid: p.puuid,
          summonerName: p.summonerName,
          championName: p.championName,
          championId: p.championId,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          win: p.win,
          role: p.teamPosition,
          lane: p.lane,
          goldEarned: p.goldEarned,
          totalDamageDealtToChampions: p.totalDamageDealtToChampions,
          visionScore: p.visionScore,
          wardsPlaced: p.wardsPlaced,
          wardsKilled: p.wardsKilled,
          items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
          pentaKills: p.pentaKills,
          quadraKills: p.quadraKills,
          tripleKills: p.tripleKills,
          doubleKills: p.doubleKills,
          firstBloodKill: p.firstBloodKill,

          // Objectives
          baronKills: p.baronKills,
          dragonKills: p.dragonKills,
          turretKills: p.turretKills,
          inhibitorKills: p.inhibitorKills,
          objectivesStolenWithSmite: p.objectivesStolen,

          // CS & Farming (Tier 1)
          totalMinionsKilled: p.totalMinionsKilled,
          neutralMinionsKilled: p.neutralMinionsKilled,
          totalAllyJungleMinionsKilled: p.totalAllyJungleMinionsKilled,
          totalEnemyJungleMinionsKilled: p.totalEnemyJungleMinionsKilled,

          // Damage Breakdown (Tier 1)
          totalDamageDealt: p.totalDamageDealt,
          physicalDamageDealt: p.physicalDamageDealt,
          magicDamageDealt: p.magicDamageDealt,
          trueDamageDealt: p.trueDamageDealt,
          physicalDamageDealtToChampions: p.physicalDamageDealtToChampions,
          magicDamageDealtToChampions: p.magicDamageDealtToChampions,
          trueDamageDealtToChampions: p.trueDamageDealtToChampions,

          // Damage Taken (Tier 1)
          totalDamageTaken: p.totalDamageTaken,
          physicalDamageTaken: p.physicalDamageTaken,
          magicalDamageTaken: p.magicalDamageTaken,
          trueDamageTaken: p.trueDamageTaken,
          damageSelfMitigated: p.damageSelfMitigated,

          // Objective Damage (Tier 1)
          damageDealtToObjectives: p.damageDealtToObjectives,
          damageDealtToTurrets: p.damageDealtToTurrets,

          // Killing Sprees (Tier 2)
          largestKillingSpree: p.largestKillingSpree,
          largestMultiKill: p.largestMultiKill,
          killingSprees: p.killingSprees,

          // CC & Utility (Tier 2)
          timeCCingOthers: p.timeCCingOthers,
          totalTimeCCDealt: p.totalTimeCCDealt,

          // Healing (Tier 2)
          totalHeal: p.totalHeal,
          totalHealsOnTeammates: p.totalHealsOnTeammates,
          totalUnitsHealed: p.totalUnitsHealed,

          // Ping Stats (Tier 3)
          allInPings: p.allInPings,
          assistMePings: p.assistMePings,
          dangerPings: p.dangerPings,
          enemyMissingPings: p.enemyMissingPings,
          onMyWayPings: p.onMyWayPings,
          pushPings: p.pushPings,

          // Spell Casts (Tier 3)
          spell1Casts: p.spell1Casts,
          spell2Casts: p.spell2Casts,
          spell3Casts: p.spell3Casts,
          spell4Casts: p.spell4Casts,
          summoner1Casts: p.summoner1Casts,
          summoner2Casts: p.summoner2Casts,

          // Consumables (Tier 3)
          consumablesPurchased: p.consumablesPurchased,
          detectorWardsPlaced: p.detectorWardsPlaced,

          // Game Ending & Metadata
          gameEndedInEarlySurrender: p.gameEndedInEarlySurrender,
          gameEndedInSurrender: p.gameEndedInSurrender,
          teamEarlySurrendered: p.teamEarlySurrendered,
          champExperience: p.champExperience,
          champLevel: p.champLevel,
          totalTimeSpentDead: p.totalTimeSpentDead,
          longestTimeSpentLiving: p.longestTimeSpentLiving,
          nexusKills: p.nexusKills,
          nexusLost: p.nexusLost,
          nexusTakedowns: p.nexusTakedowns,
          objectivesStolen: p.objectivesStolen,
          firstBloodAssist: p.firstBloodAssist,
          firstTowerKill: p.firstTowerKill,
          firstTowerAssist: p.firstTowerAssist,
          bountyLevel: p.bountyLevel,
          championsTransformed: p.championsTransformed,

          // Runes & Perks
          perks: p.perks,

          // Items (for build path analysis)
          item0: p.item0,
          item1: p.item1,
          item2: p.item2,
          item3: p.item3,
          item4: p.item4,
          item5: p.item5,
          item6: p.item6,
        })),
      };

      return {
        success: true,
        data: matchData,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.status?.message || error.message,
      };
    }
  }

  /**
   * Get full year match history for a player
   */
  async getYearMatchHistory(
    puuid: string,
    region: keyof typeof REGIONS,
    year: number = new Date().getFullYear()
  ): Promise<RiotApiResponse<MatchData[]>> {
    try {
      // Calculate timestamps for the year
      const startTime = Math.floor(new Date(`${year}-01-01`).getTime() / 1000);
      const endTime = Math.floor(new Date(`${year}-12-31T23:59:59`).getTime() / 1000);

      // Get all match IDs (may need pagination for very active players)
      const matchIdsResult = await this.getMatchIds(puuid, region, startTime, endTime, 100);

      if (!matchIdsResult.success || !matchIdsResult.data) {
        return {
          success: false,
          error: matchIdsResult.error || 'Failed to fetch match IDs',
        };
      }

      // Fetch detailed data for each match (with rate limiting consideration)
      const matches: MatchData[] = [];
      const batchSize = 10;

      for (let i = 0; i < matchIdsResult.data.length; i += batchSize) {
        const batch = matchIdsResult.data.slice(i, i + batchSize);
        const batchPromises = batch.map(matchId => this.getMatchData(matchId, region));
        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach(result => {
          if (result.success && result.data) {
            matches.push(result.data);
          }
        });

        // Rate limiting: wait between batches
        if (i + batchSize < matchIdsResult.data.length) {
          await this.sleep(1000);
        }
      }

      return {
        success: true,
        data: matches,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get regional endpoint based on region
   */
  private getRegionalEndpoint(region: keyof typeof REGIONS): string {
    const americasRegions = ['NA', 'BR', 'LAN', 'LAS'];
    const europeRegions = ['EUW', 'EUN', 'TR', 'RU'];
    const asiaRegions = ['KR', 'JP'];
    const seaRegions = ['OCE', 'PH', 'SG', 'TH', 'TW', 'VN'];

    if (americasRegions.includes(region)) return REGIONAL_ENDPOINTS.AMERICAS;
    if (europeRegions.includes(region)) return REGIONAL_ENDPOINTS.EUROPE;
    if (asiaRegions.includes(region)) return REGIONAL_ENDPOINTS.ASIA;
    if (seaRegions.includes(region)) return REGIONAL_ENDPOINTS.SEA;

    return REGIONAL_ENDPOINTS.AMERICAS; // Default
  }

  /**
   * Helper function for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const riotApi = new RiotApiService(process.env.RIOT_API_KEY || '');
