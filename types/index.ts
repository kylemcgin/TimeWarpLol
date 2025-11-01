// Player and Match Types
export interface Player {
  puuid: string;
  summonerName: string;
  region: string;
  profileIconId: number;
  summonerLevel: number;
}

export interface MatchData {
  matchId: string;
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  queueId: number;
  participants: MatchParticipant[];
  teams?: TeamData[];
  gameVersion?: string;
  gameEndedInEarlySurrender?: boolean;
  gameEndedInSurrender?: boolean;
}

export interface TeamData {
  teamId: number;
  win: boolean;
  bans: { championId: number; pickTurn: number }[];
  objectives?: {
    baron?: { first: boolean; kills: number };
    champion?: { first: boolean; kills: number };
    dragon?: { first: boolean; kills: number };
    inhibitor?: { first: boolean; kills: number };
    riftHerald?: { first: boolean; kills: number };
    tower?: { first: boolean; kills: number };
  };
}

export interface MatchParticipant {
  puuid: string;
  summonerName: string;
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  role: string;
  lane: string;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  items: number[];
  pentaKills: number;
  quadraKills: number;
  tripleKills: number;
  doubleKills: number;
  firstBloodKill: boolean;

  // Objective stats
  baronKills?: number;
  dragonKills?: number;
  objectivesStolenWithSmite?: number;
  turretKills?: number;
  inhibitorKills?: number;

  // CS & Farming (Tier 1)
  totalMinionsKilled?: number;
  neutralMinionsKilled?: number;
  totalAllyJungleMinionsKilled?: number;
  totalEnemyJungleMinionsKilled?: number;

  // Damage Breakdown (Tier 1)
  totalDamageDealt?: number;
  physicalDamageDealt?: number;
  magicDamageDealt?: number;
  trueDamageDealt?: number;
  physicalDamageDealtToChampions?: number;
  magicDamageDealtToChampions?: number;
  trueDamageDealtToChampions?: number;

  // Damage Taken (Tier 1)
  totalDamageTaken?: number;
  physicalDamageTaken?: number;
  magicalDamageTaken?: number;
  trueDamageTaken?: number;
  damageSelfMitigated?: number;

  // Objective Damage (Tier 1)
  damageDealtToObjectives?: number;
  damageDealtToTurrets?: number;

  // Killing Sprees (Tier 2)
  largestKillingSpree?: number;
  largestMultiKill?: number;
  killingSprees?: number;

  // CC & Utility (Tier 2)
  timeCCingOthers?: number;
  totalTimeCCDealt?: number;

  // Healing (Tier 2)
  totalHeal?: number;
  totalHealsOnTeammates?: number;
  totalUnitsHealed?: number;

  // Ping Stats (Tier 3)
  allInPings?: number;
  assistMePings?: number;
  dangerPings?: number;
  enemyMissingPings?: number;
  onMyWayPings?: number;
  pushPings?: number;

  // Spell Casts (Tier 3)
  spell1Casts?: number;
  spell2Casts?: number;
  spell3Casts?: number;
  spell4Casts?: number;
  summoner1Casts?: number;
  summoner2Casts?: number;

  // Consumables (Tier 3)
  consumablesPurchased?: number;
  detectorWardsPlaced?: number;

  // Game Ending & Metadata (Unique Features)
  gameEndedInEarlySurrender?: boolean;
  gameEndedInSurrender?: boolean;
  teamEarlySurrendered?: boolean;
  champExperience?: number;
  champLevel?: number;
  totalTimeSpentDead?: number;
  longestTimeSpentLiving?: number;
  nexusKills?: number;
  nexusLost?: number;
  nexusTakedowns?: number;
  objectivesStolen?: number;
  firstBloodAssist?: boolean;
  firstTowerKill?: boolean;
  firstTowerAssist?: boolean;
  bountyLevel?: number;
  championsTransformed?: number;

  // Runes & Perks
  perks?: {
    statPerks?: {
      defense: number;
      flex: number;
      offense: number;
    };
    styles?: Array<{
      description: string;
      selections: Array<{
        perk: number;
        var1: number;
        var2: number;
        var3: number;
      }>;
      style: number;
    }>;
  };

  // Item Purchase Order
  item0?: number;
  item1?: number;
  item2?: number;
  item3?: number;
  item4?: number;
  item5?: number;
  item6?: number;
}

// Year-in-Review Insights
export interface YearInReview {
  playerId: string;
  year: number;
  generatedAt: string;
  summary: Summary;
  statistics: Statistics;
  achievements: Achievement[];
  insights: AIInsights;
  visualizations: VisualizationData;
  shareableCards: ShareableCard[];
  improvementPlan?: ImprovementPlan;
  personality?: PlayerPersonality;
  weirdStats?: WeirdStats;
  evolutionTimeline?: EvolutionTimeline;
}

export interface PlayerPersonality {
  type: 'calculated-assassin' | 'reckless-warrior' | 'strategic-mastermind' | 'one-trick-pony' | 'flex-player';
  title: string;
  description: string;
  traits: string[];
  playstyleScore: {
    aggression: number; // 0-100
    safety: number; // 0-100
    teamplay: number; // 0-100
    versatility: number; // 0-100
  };
}

export interface WeirdStats {
  stats: {
    label: string;
    value: string | number;
    emoji: string;
    category: 'funny' | 'impressive' | 'concerning' | 'wild';
  }[];
}

export interface EvolutionTimeline {
  milestones: {
    date: string;
    month: string;
    title: string;
    description: string;
    stats: {
      rank?: string;
      winRate: number;
      kda: number;
      gamesPlayed: number;
    };
    type: 'achievement' | 'milestone' | 'setback' | 'highlight';
  }[];
}

export interface Summary {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalPlaytime: number; // in minutes
  favoriteChampion: string;
  favoriteRole: string;
  startDate: string;
  endDate: string;
}

export interface Statistics {
  championStats: ChampionStats[];
  roleStats: RoleStats[];
  performanceMetrics: PerformanceMetrics;
  objectiveStats: ObjectiveStats;
  farmingStats: FarmingStats;
  damageStats: DamageStats;
  combatStats: CombatStats;
  communicationStats: CommunicationStats;
  advancedStats: AdvancedStats;
  timelineData: TimelineData[];
  streaks: Streaks;

  // Unique Features (1-10)
  timelineStats?: TimelineStats;
  surrenderAnalysis?: SurrenderAnalysis;
  banAnalysis?: BanAnalysis;
  runeAnalysis?: RuneAnalysis;
  buildPathAnalysis?: BuildPathAnalysis;
  firstBloodStats?: FirstBloodStats;
  comebackStats?: ComebackStats;
  patchPerformance?: PatchPerformance;
}

export interface ChampionStats {
  championName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgKDA: number;
}

export interface RoleStats {
  role: string;
  gamesPlayed: number;
  winRate: number;
  avgPerformance: number;
}

export interface PerformanceMetrics {
  averageKDA: number;
  averageVisionScore: number;
  averageGoldPerMinute: number;
  averageDamagePerMinute: number;
  killParticipation: number;
}

export interface ObjectiveStats {
  totalBaronsKilled: number;
  totalDragonsKilled: number;
  baronKillRate: number; // per game
  dragonKillRate: number; // per game
  objectiveControlScore: number; // 0-100
  totalTurretsDestroyed: number;
  totalInhibitorsDestroyed: number;
  averageDamageToObjectives: number;
  averageDamageToTurrets: number;
}

export interface FarmingStats {
  totalCS: number; // Total creep score
  averageCSPerGame: number;
  averageCSPerMinute: number;
  totalJungleCS: number;
  averageJungleCSPerGame: number;
  enemyJungleCS: number; // Counter-jungling
  allyJungleCS: number; // Taxing lanes
}

export interface DamageStats {
  // Damage Dealt
  averageTotalDamage: number;
  averagePhysicalDamage: number;
  averageMagicDamage: number;
  averageTrueDamage: number;
  averageDamageToChampions: number;

  // Damage Breakdown to Champions
  physicalDamagePercent: number;
  magicDamagePercent: number;
  trueDamagePercent: number;

  // Damage Taken
  averageDamageTaken: number;
  averageDamageMitigated: number;
  effectiveTankScore: number; // Based on damage taken + mitigated
}

export interface CombatStats {
  largestKillingSpree: number;
  largestMultiKill: number;
  totalKillingSprees: number;
  averageKillingSprees: number;

  // CC Stats
  totalCCTime: number; // Total seconds of CC applied
  averageCCTimePerGame: number;

  // Healing Stats
  totalHealingDone: number;
  averageHealingPerGame: number;
  totalTeammateHeals: number;
  averageAlliesHealed: number;
}

export interface CommunicationStats {
  totalPings: number;
  averagePingsPerGame: number;
  pingBreakdown: {
    allIn: number;
    assistMe: number;
    danger: number;
    enemyMissing: number;
    onMyWay: number;
    push: number;
  };
  communicationStyle: 'silent' | 'tactical' | 'chatty' | 'spam';
}

export interface AdvancedStats {
  // Spell Usage
  totalAbilityCasts: number;
  averageAbilityCastsPerGame: number;
  totalSummonerCasts: number;

  // Economy
  totalConsumablesPurchased: number;
  averageConsumablesPerGame: number;
  totalControlWards: number;
  averageControlWardsPerGame: number;
}

// Unique Feature Stats (Features 1-10)

export interface TimelineStats {
  deathLocations: { x: number; y: number; timestamp: number; killerChampion?: string }[];
  goldLeadOverTime: { timestamp: number; goldDiff: number }[];
  csAt10: number;
  csAt15: number;
  csAt20: number;
  goldAt10: number;
  goldAt15: number;
  goldAt20: number;
  xpAt10: number;
  xpAt15: number;
  xpAt20: number;
}

export interface SurrenderAnalysis {
  totalSurrenders: number;
  earlySurrenders: number;
  surrenderRate: number;
  gamesLostWithoutSurrender: number;
  averageGameLengthWhenSurrendered: number;
}

export interface BanAnalysis {
  totalBans: { championId: number; championName: string; count: number }[];
  mostBannedChampion: string;
  banRate: number;
  uniqueChampionsBanned: number;
}

export interface RuneAnalysis {
  mostUsedKeystone: { runeId: number; runeName: string; count: number };
  mostUsedSecondaryTree: { treeId: number; treeName: string; count: number };
  keystoneWinRates: { runeId: number; runeName: string; wins: number; games: number; winRate: number }[];
}

export interface BuildPathAnalysis {
  firstItemBuilds: { itemId: number; itemName: string; count: number; winRate: number }[];
  coreItemBuilds: { items: number[]; count: number; winRate: number }[];
  averageItemCompletionTime: { itemId: number; avgMinutes: number }[];
}

export interface FirstBloodStats {
  firstBloodKills: number;
  firstBloodAssists: number;
  firstBloodDeaths: number;
  firstBloodParticipationRate: number;
  firstTowerKills: number;
  firstTowerAssists: number;
}

export interface ComebackStats {
  comebackWins: number; // Won despite being behind at 15
  comebackRate: number;
  biggestComeback: { matchId: string; goldDeficit: number };
  averageGoldDeficitOvercome: number;
}

export interface PatchPerformance {
  performanceByPatch: {
    patch: string;
    games: number;
    winRate: number;
    avgKDA: number;
  }[];
  bestPatch: string;
  worstPatch: string;
}

export interface TimelineData {
  month: string;
  games: number;
  winRate: number;
  avgKDA: number;
}

export interface Streaks {
  longestWinStreak: number;
  longestLossStreak: number;
  currentStreak: number;
  streakType: 'win' | 'loss';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}

// AI-Generated Insights
export interface AIInsights {
  personalizedSummary: string;
  strengths: string[];
  areasForImprovement: string[];
  playstyleAnalysis: string;
  progressionNarrative: string;
  funFacts: string[];
  motivationalMessage: string;
  predictedRankNextSeason: string;
}

export interface VisualizationData {
  championPlayRate: { champion: string; games: number }[];
  winRateOverTime: { date: string; winRate: number }[];
  performanceRadar: {
    category: string;
    value: number;
    percentile: number;
  }[];
  rankProgression: {
    date: string;
    rank: string;
    lp: number;
  }[];
}

export interface ShareableCard {
  id: string;
  type: 'champion-main' | 'performance-stats' | 'achievements' | 'year-recap' | 'fun-stats';
  title: string;
  imageUrl?: string;
  data: any;
}

// Improvement System
export interface ImprovementGoal {
  id: string;
  category: 'mechanical' | 'game-knowledge' | 'consistency' | 'macro' | 'champion-pool';
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  tips: string[];
  estimatedTimeframe: string;
}

export interface SkillAssessment {
  category: string;
  currentLevel: number; // 0-100
  potentialLevel: number; // 0-100
  rank: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  strengths: string[];
  weaknesses: string[];
}

export interface ImprovementPlan {
  overallScore: number; // 0-100
  skillAssessments: SkillAssessment[];
  goals: ImprovementGoal[];
  weeklyFocus: string[];
  recommendedChampions: string[];
  trainingResources: {
    type: 'video' | 'guide' | 'practice';
    title: string;
    description: string;
    link?: string;
  }[];
}

// Social Comparison Types
export interface SocialComparison {
  player: Player;
  friends: FriendComparison[];
  globalPercentiles: {
    winRate: number;
    kda: number;
    gamesPlayed: number;
    playtime: number;
  };
}

export interface FriendComparison {
  friend: Player;
  comparisonMetrics: {
    gamesPlayed: { player: number; friend: number };
    winRate: { player: number; friend: number };
    avgKDA: { player: number; friend: number };
    sharedChampions: string[];
    synergyScore?: number;
  };
}

// API Response Types
export interface RiotApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BedrockInsightRequest {
  playerData: {
    summary: Summary;
    statistics: Statistics;
    achievements: Achievement[];
  };
  promptType: 'full-review' | 'strengths' | 'improvements' | 'playstyle' | 'fun-facts';
}

export interface BedrockInsightResponse {
  insights: Partial<AIInsights>;
  tokensUsed: number;
}
