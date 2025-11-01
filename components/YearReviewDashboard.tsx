'use client';

import { YearInReview } from '@/types';
import SummaryCard from './SummaryCard';
import ChampionStats from './ChampionStats';
import PerformanceChart from './PerformanceChart';
import AchievementsList from './AchievementsList';
import AIInsightsSection from './AIInsightsSection';
import ShareButtons from './ShareButtons';
import AnimatedStat, { AnimatedWinRateStat } from './AnimatedStat';
import ChampionImage from './ChampionImage';
import ImprovementTracker from './ImprovementTracker';
import WeirdStatsSection from './WeirdStatsSection';
import EvolutionTimelineSection from './EvolutionTimelineSection';
import AdvancedStatsSection from './AdvancedStatsSection';

interface YearReviewDashboardProps {
  data: YearInReview;
  onReset: () => void;
}

export default function YearReviewDashboard({ data, onReset }: YearReviewDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-gradient">
          Your {data.year} Journey
        </h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Search Again
        </button>
      </div>

      {/* Animated Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatedStat
          value={data.summary.totalGames}
          label="Total Games Played"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
          }
          color="#c89b3c"
          delay={100}
        />

        <AnimatedWinRateStat
          winRate={data.summary.winRate}
          delay={300}
        />

        <AnimatedStat
          value={data.statistics.performanceMetrics.averageKDA}
          label="Average KDA"
          decimals={2}
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          }
          color={data.statistics.performanceMetrics.averageKDA >= 3 ? '#10b981' : data.statistics.performanceMetrics.averageKDA >= 2 ? '#3b82f6' : '#a855f7'}
          delay={500}
        />
      </div>

      {/* Additional Animated Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedStat
          value={Math.floor(data.summary.totalPlaytime / 60)}
          label="Hours Played"
          suffix=" hrs"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="#0bc4e2"
          delay={700}
        />

        <AnimatedStat
          value={data.statistics.championStats.length}
          label="Champions Played"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
          color="#a855f7"
          delay={900}
        />

        <AnimatedStat
          value={data.statistics.streaks.longestWinStreak}
          label="Longest Win Streak"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          }
          color="#10b981"
          delay={1100}
        />

        <AnimatedStat
          value={data.statistics.performanceMetrics.averageVisionScore}
          label="Average Vision Score"
          decimals={1}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          color="#f59e0b"
          delay={1300}
        />
      </div>

      {/* Objective Control Stats (Baron & Dragons) */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gradient mb-6">🐉 Objective Control</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedStat
            value={data.statistics.objectiveStats.totalDragonsKilled}
            label="Total Dragons Slain"
            icon={
              <span className="text-2xl">🐉</span>
            }
            color="#e74c3c"
            delay={1500}
          />

          <AnimatedStat
            value={data.statistics.objectiveStats.totalBaronsKilled}
            label="Total Barons Slain"
            icon={
              <span className="text-2xl">👹</span>
            }
            color="#9b59b6"
            delay={1700}
          />

          <AnimatedStat
            value={data.statistics.objectiveStats.dragonKillRate}
            label="Dragons Per Game"
            decimals={2}
            icon={
              <span className="text-2xl">📊</span>
            }
            color="#e67e22"
            delay={1900}
          />

          <AnimatedStat
            value={data.statistics.objectiveStats.objectiveControlScore}
            label="Objective Control Score"
            suffix="/100"
            icon={
              <span className="text-2xl">⚔️</span>
            }
            color={
              data.statistics.objectiveStats.objectiveControlScore >= 70
                ? '#10b981'
                : data.statistics.objectiveStats.objectiveControlScore >= 40
                ? '#3b82f6'
                : '#ef4444'
            }
            delay={2100}
          />
        </div>
      </div>

      {/* Featured Champion Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-[var(--primary)]/30 p-8 animate-fade-in">
        {/* Background Splash Art */}
        <div className="absolute inset-0 opacity-30">
          <ChampionImage
            championName={data.summary.favoriteChampion}
            variant="splash"
            size="xlarge"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Champion Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <ChampionImage
                championName={data.summary.favoriteChampion}
                size="xlarge"
                variant="circle"
              />
              <div className="absolute -bottom-2 -right-2 bg-[var(--primary)] text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                👑 Main
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold text-white mb-2">
              {data.summary.favoriteChampion}
            </h3>
            <p className="text-lg text-[var(--primary)] mb-4">
              {data.summary.favoriteRole} • Your Most Played Champion
            </p>

            {data.statistics.championStats[0] && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Games</p>
                  <p className="text-2xl font-bold text-white">
                    {data.statistics.championStats[0].gamesPlayed}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Win Rate</p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color:
                        data.statistics.championStats[0].winRate >= 55
                          ? '#10b981'
                          : data.statistics.championStats[0].winRate >= 50
                          ? '#3b82f6'
                          : '#ef4444',
                    }}
                  >
                    {data.statistics.championStats[0].winRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">KDA</p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color:
                        data.statistics.championStats[0].avgKDA >= 3
                          ? '#10b981'
                          : data.statistics.championStats[0].avgKDA >= 2
                          ? '#3b82f6'
                          : '#a855f7',
                    }}
                  >
                    {data.statistics.championStats[0].avgKDA.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <AIInsightsSection insights={data.insights} />

      {/* Achievements */}
      <AchievementsList achievements={data.achievements} />

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          title="Win Rate Over Time"
          data={data.visualizations.winRateOverTime}
          dataKey="winRate"
          color="#c89b3c"
        />
        <PerformanceChart
          title="Performance Radar"
          data={data.visualizations.performanceRadar}
          type="radar"
        />
      </div>

      {/* Champion Statistics */}
      <ChampionStats champions={data.statistics.championStats.slice(0, 10)} />

      {/* Advanced Stats (New Tier 1, 2, 3 Stats) */}
      <AdvancedStatsSection statistics={data.statistics} />

      {/* Weird Stats */}
      {data.weirdStats && (
        <WeirdStatsSection stats={data.weirdStats} />
      )}

      {/* Evolution Timeline */}
      {data.evolutionTimeline && (
        <EvolutionTimelineSection timeline={data.evolutionTimeline} />
      )}

      {/* Improvement Plan */}
      {data.improvementPlan && (
        <ImprovementTracker plan={data.improvementPlan} />
      )}

      {/* Share Section */}
      <ShareButtons shareableCards={data.shareableCards} playerId={data.playerId} />
    </div>
  );
}
