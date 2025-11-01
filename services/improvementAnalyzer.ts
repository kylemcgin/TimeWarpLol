import { ImprovementPlan, ImprovementGoal, SkillAssessment, Summary, Statistics } from '../types';

export class ImprovementAnalyzer {
  /**
   * Generate personalized improvement plan based on player statistics
   */
  generateImprovementPlan(summary: Summary, statistics: Statistics): ImprovementPlan {
    const overallScore = this.calculateOverallScore(summary, statistics);
    const skillAssessments = this.assessSkills(summary, statistics);
    const goals = this.generateGoals(summary, statistics);
    const weeklyFocus = this.generateWeeklyFocus(goals);
    const recommendedChampions = this.getRecommendedChampions(statistics);

    return {
      overallScore,
      skillAssessments,
      goals,
      weeklyFocus,
      recommendedChampions,
      trainingResources: this.getTrainingResources(goals),
    };
  }

  /**
   * Calculate overall performance score (0-100)
   */
  private calculateOverallScore(summary: Summary, statistics: Statistics): number {
    let score = 0;

    // Win rate (30 points)
    score += Math.min((summary.winRate / 60) * 30, 30);

    // KDA (25 points)
    const kdaScore = Math.min((statistics.performanceMetrics.averageKDA / 4) * 25, 25);
    score += kdaScore;

    // Vision score (15 points)
    const visionScore = Math.min((statistics.performanceMetrics.averageVisionScore / 50) * 15, 15);
    score += visionScore;

    // Consistency (games played) (10 points)
    const consistencyScore = Math.min((summary.totalGames / 200) * 10, 10);
    score += consistencyScore;

    // Champion pool diversity (10 points)
    const champPoolScore = Math.min((statistics.championStats.length / 15) * 10, 10);
    score += champPoolScore;

    // Performance trends (10 points)
    const trendScore = this.calculateTrendScore(statistics);
    score += trendScore;

    return Math.round(score);
  }

  /**
   * Assess different skill categories
   */
  private assessSkills(summary: Summary, statistics: Statistics): SkillAssessment[] {
    return [
      this.assessMechanicalSkill(summary, statistics),
      this.assessGameKnowledge(summary, statistics),
      this.assessConsistency(summary, statistics),
      this.assessMacroPlay(summary, statistics),
      this.assessChampionMastery(summary, statistics),
    ];
  }

  private assessMechanicalSkill(summary: Summary, statistics: Statistics): SkillAssessment {
    const kda = statistics.performanceMetrics.averageKDA;
    const killParticipation = statistics.performanceMetrics.killParticipation;

    // Calculate current level based on KDA and kill participation
    const currentLevel = Math.min(
      ((kda / 5) * 50 + (killParticipation / 70) * 50),
      100
    );

    return {
      category: 'Mechanical Skill',
      currentLevel: Math.round(currentLevel),
      potentialLevel: Math.min(currentLevel + 25, 95),
      rank: this.getSkillRank(currentLevel),
      strengths: this.getMechanicalStrengths(kda, killParticipation),
      weaknesses: this.getMechanicalWeaknesses(kda, killParticipation),
    };
  }

  private assessGameKnowledge(summary: Summary, statistics: Statistics): SkillAssessment {
    const visionScore = statistics.performanceMetrics.averageVisionScore;
    const champPool = statistics.championStats.length;

    const currentLevel = Math.min(
      ((visionScore / 60) * 60 + (champPool / 20) * 40),
      100
    );

    return {
      category: 'Game Knowledge',
      currentLevel: Math.round(currentLevel),
      potentialLevel: Math.min(currentLevel + 20, 95),
      rank: this.getSkillRank(currentLevel),
      strengths: this.getKnowledgeStrengths(visionScore, champPool),
      weaknesses: this.getKnowledgeWeaknesses(visionScore, champPool),
    };
  }

  private assessConsistency(summary: Summary, statistics: Statistics): SkillAssessment {
    const winRate = summary.winRate;
    const gamesPlayed = summary.totalGames;
    const longestStreak = statistics.streaks.longestWinStreak;

    const currentLevel = Math.min(
      ((winRate / 55) * 50 + (longestStreak / 10) * 30 + Math.min(gamesPlayed / 200, 1) * 20),
      100
    );

    return {
      category: 'Consistency',
      currentLevel: Math.round(currentLevel),
      potentialLevel: Math.min(currentLevel + 15, 90),
      rank: this.getSkillRank(currentLevel),
      strengths: this.getConsistencyStrengths(winRate, longestStreak),
      weaknesses: this.getConsistencyWeaknesses(winRate, longestStreak),
    };
  }

  private assessMacroPlay(summary: Summary, statistics: Statistics): SkillAssessment {
    const goldPerMin = statistics.performanceMetrics.averageGoldPerMinute;
    const damagePerMin = statistics.performanceMetrics.averageDamagePerMinute;

    const currentLevel = Math.min(
      ((goldPerMin / 400) * 50 + (damagePerMin / 800) * 50),
      100
    );

    return {
      category: 'Macro Play & Farm',
      currentLevel: Math.round(currentLevel),
      potentialLevel: Math.min(currentLevel + 30, 95),
      rank: this.getSkillRank(currentLevel),
      strengths: this.getMacroStrengths(goldPerMin, damagePerMin),
      weaknesses: this.getMacroWeaknesses(goldPerMin, damagePerMin),
    };
  }

  private assessChampionMastery(summary: Summary, statistics: Statistics): SkillAssessment {
    const topChampWinRate = statistics.championStats[0]?.winRate || 50;
    const topChampGames = statistics.championStats[0]?.gamesPlayed || 0;

    const currentLevel = Math.min(
      ((topChampWinRate / 60) * 60 + Math.min(topChampGames / 50, 1) * 40),
      100
    );

    return {
      category: 'Champion Mastery',
      currentLevel: Math.round(currentLevel),
      potentialLevel: Math.min(currentLevel + 20, 98),
      rank: this.getSkillRank(currentLevel),
      strengths: this.getChampionStrengths(topChampWinRate, topChampGames),
      weaknesses: this.getChampionWeaknesses(topChampWinRate, topChampGames),
    };
  }

  /**
   * Generate improvement goals
   */
  private generateGoals(summary: Summary, statistics: Statistics): ImprovementGoal[] {
    const goals: ImprovementGoal[] = [];

    // Win Rate Goal
    if (summary.winRate < 52) {
      goals.push({
        id: 'winrate',
        category: 'consistency',
        title: 'Improve Win Rate',
        description: 'Reach a consistent 52% win rate or higher',
        currentValue: Math.round(summary.winRate),
        targetValue: 52,
        unit: '%',
        priority: 'high',
        progress: (summary.winRate / 52) * 100,
        tips: [
          'Focus on your top 3 champions to build consistency',
          'Review your losses to identify common mistakes',
          'Avoid tilting - take breaks after 2 losses in a row',
          'Learn to recognize when to play safe vs aggressive',
        ],
        estimatedTimeframe: '1-2 months',
      });
    }

    // KDA Goal
    if (statistics.performanceMetrics.averageKDA < 3.0) {
      goals.push({
        id: 'kda',
        category: 'mechanical',
        title: 'Achieve 3.0+ KDA',
        description: 'Reduce deaths and increase kill participation',
        currentValue: parseFloat(statistics.performanceMetrics.averageKDA.toFixed(2)),
        targetValue: 3.0,
        unit: 'KDA',
        priority: 'high',
        progress: (statistics.performanceMetrics.averageKDA / 3.0) * 100,
        tips: [
          'Focus on positioning in team fights',
          'Avoid face-checking bushes without vision',
          'Learn when to disengage from unfavorable fights',
          'Practice trading patterns in lane',
        ],
        estimatedTimeframe: '3-4 weeks',
      });
    }

    // Vision Score Goal
    if (statistics.performanceMetrics.averageVisionScore < 40) {
      goals.push({
        id: 'vision',
        category: 'game-knowledge',
        title: 'Improve Vision Control',
        description: 'Increase average vision score to 40+',
        currentValue: Math.round(statistics.performanceMetrics.averageVisionScore),
        targetValue: 40,
        unit: 'score',
        priority: statistics.performanceMetrics.averageVisionScore < 25 ? 'high' : 'medium',
        progress: (statistics.performanceMetrics.averageVisionScore / 40) * 100,
        tips: [
          'Buy control wards every back (minimum 2 per game)',
          'Place wards before objectives spawn (2 min before)',
          'Clear enemy wards with red trinket',
          'Ward defensively when behind, offensively when ahead',
        ],
        estimatedTimeframe: '2-3 weeks',
      });
    }

    // Farm/Gold Goal
    if (statistics.performanceMetrics.averageGoldPerMinute < 350) {
      goals.push({
        id: 'farm',
        category: 'macro',
        title: 'Improve Gold Income',
        description: 'Increase average gold per minute through better farming',
        currentValue: Math.round(statistics.performanceMetrics.averageGoldPerMinute),
        targetValue: 350,
        unit: 'gold/min',
        priority: 'medium',
        progress: (statistics.performanceMetrics.averageGoldPerMinute / 350) * 100,
        tips: [
          'Practice last-hitting in practice tool for 10 minutes daily',
          'Aim for 7+ CS per minute',
          'Take jungle camps when your jungler is on opposite side',
          'Catch side lane waves instead of grouping mid unnecessarily',
        ],
        estimatedTimeframe: '2-4 weeks',
      });
    }

    // Champion Pool Goal
    if (statistics.championStats.length < 5) {
      goals.push({
        id: 'champion-pool',
        category: 'champion-pool',
        title: 'Expand Champion Pool',
        description: 'Build a pool of 5+ champions you can play confidently',
        currentValue: statistics.championStats.length,
        targetValue: 5,
        unit: 'champions',
        priority: 'low',
        progress: (statistics.championStats.length / 5) * 100,
        tips: [
          'Master 2-3 champions in your main role first',
          'Learn 1-2 safe blind picks for your role',
          'Practice new champions in normals before ranked',
          'Choose champions that complement each other',
        ],
        estimatedTimeframe: '1-2 months',
      });
    }

    return goals;
  }

  /**
   * Generate weekly focus areas
   */
  private generateWeeklyFocus(goals: ImprovementGoal[]): string[] {
    const focus: string[] = [];
    const highPriorityGoals = goals.filter((g) => g.priority === 'high');

    if (highPriorityGoals.length > 0) {
      focus.push(`Focus on ${highPriorityGoals[0].title.toLowerCase()}`);
    }

    focus.push('Play 3-5 ranked games daily for consistency');
    focus.push('Review one replay per day to identify mistakes');
    focus.push('Practice CSing for 10 minutes before first game');

    return focus.slice(0, 4);
  }

  /**
   * Get recommended champions to learn
   */
  private getRecommendedChampions(statistics: Statistics): string[] {
    // This would ideally be AI-generated based on the player's role and current champs
    // For now, return generic recommendations
    const currentChamps = statistics.championStats.map((c) => c.championName);

    // Example recommendations (would be role-specific in production)
    const allRecommendations = [
      'Annie',
      'Garen',
      'Malphite',
      'Ashe',
      'Leona',
      'Amumu',
    ];

    return allRecommendations
      .filter((champ) => !currentChamps.includes(champ))
      .slice(0, 3);
  }

  /**
   * Get training resources
   */
  private getTrainingResources(goals: ImprovementGoal[]) {
    const resources = [];

    if (goals.some((g) => g.category === 'mechanical')) {
      resources.push({
        type: 'practice' as const,
        title: 'Practice Tool - CSing Drill',
        description: 'Practice last-hitting minions for 10 minutes daily',
      });
    }

    if (goals.some((g) => g.category === 'game-knowledge')) {
      resources.push({
        type: 'guide' as const,
        title: 'Vision Control Guide',
        description: 'Learn optimal ward placements and timing',
      });
    }

    return resources;
  }

  // Helper methods
  private getSkillRank(level: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master' {
    if (level >= 80) return 'Master';
    if (level >= 65) return 'Expert';
    if (level >= 50) return 'Advanced';
    if (level >= 35) return 'Intermediate';
    return 'Beginner';
  }

  private calculateTrendScore(statistics: Statistics): number {
    // Simple trend calculation - would be more sophisticated with timeline data
    return 5;
  }

  private getMechanicalStrengths(kda: number, killParticipation: number): string[] {
    const strengths = [];
    if (kda >= 3.5) strengths.push('Excellent KDA ratio');
    if (killParticipation >= 65) strengths.push('High kill participation');
    if (strengths.length === 0) strengths.push('Room for growth');
    return strengths;
  }

  private getMechanicalWeaknesses(kda: number, killParticipation: number): string[] {
    const weaknesses = [];
    if (kda < 2.5) weaknesses.push('High death count');
    if (killParticipation < 55) weaknesses.push('Low kill participation');
    if (weaknesses.length === 0) weaknesses.push('Minor positioning improvements');
    return weaknesses;
  }

  private getKnowledgeStrengths(visionScore: number, champPool: number): string[] {
    const strengths = [];
    if (visionScore >= 45) strengths.push('Excellent vision control');
    if (champPool >= 8) strengths.push('Diverse champion pool');
    if (strengths.length === 0) strengths.push('Good foundation');
    return strengths;
  }

  private getKnowledgeWeaknesses(visionScore: number, champPool: number): string[] {
    const weaknesses = [];
    if (visionScore < 30) weaknesses.push('Needs more vision control');
    if (champPool < 5) weaknesses.push('Limited champion pool');
    if (weaknesses.length === 0) weaknesses.push('Minor game knowledge gaps');
    return weaknesses;
  }

  private getConsistencyStrengths(winRate: number, longestStreak: number): string[] {
    const strengths = [];
    if (winRate >= 53) strengths.push('Positive win rate');
    if (longestStreak >= 7) strengths.push('Can maintain win streaks');
    if (strengths.length === 0) strengths.push('Shows potential');
    return strengths;
  }

  private getConsistencyWeaknesses(winRate: number, longestStreak: number): string[] {
    const weaknesses = [];
    if (winRate < 48) weaknesses.push('Win rate below 50%');
    if (longestStreak < 4) weaknesses.push('Difficulty maintaining momentum');
    if (weaknesses.length === 0) weaknesses.push('Minor consistency issues');
    return weaknesses;
  }

  private getMacroStrengths(goldPerMin: number, damagePerMin: number): string[] {
    const strengths = [];
    if (goldPerMin >= 380) strengths.push('Excellent farming');
    if (damagePerMin >= 700) strengths.push('High damage output');
    if (strengths.length === 0) strengths.push('Solid foundation');
    return strengths;
  }

  private getMacroWeaknesses(goldPerMin: number, damagePerMin: number): string[] {
    const weaknesses = [];
    if (goldPerMin < 320) weaknesses.push('Low CS/farm efficiency');
    if (damagePerMin < 500) weaknesses.push('Low damage output');
    if (weaknesses.length === 0) weaknesses.push('Can optimize resource management');
    return weaknesses;
  }

  private getChampionStrengths(winRate: number, games: number): string[] {
    const strengths = [];
    if (winRate >= 55) strengths.push('High win rate on main champion');
    if (games >= 30) strengths.push('Good champion experience');
    if (strengths.length === 0) strengths.push('Building mastery');
    return strengths;
  }

  private getChampionWeaknesses(winRate: number, games: number): string[] {
    const weaknesses = [];
    if (winRate < 48) weaknesses.push('Negative win rate on main');
    if (games < 15) weaknesses.push('Needs more games for mastery');
    if (weaknesses.length === 0) weaknesses.push('Can deepen champion knowledge');
    return weaknesses;
  }
}

export const improvementAnalyzer = new ImprovementAnalyzer();
