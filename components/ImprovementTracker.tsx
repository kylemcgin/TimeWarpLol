'use client';

import { useState, useRef, useEffect } from 'react';
import { ImprovementPlan, ImprovementGoal, SkillAssessment } from '@/types';

interface ImprovementTrackerProps {
  plan: ImprovementPlan;
}

export default function ImprovementTracker({ plan }: ImprovementTrackerProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'goals' | 'skills'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Your Improvement Plan</h2>
        <p className="text-gray-400">Personalized roadmap to level up your gameplay</p>
      </div>

      {/* Overall Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Player Performance Score</h3>
            <p className="text-sm text-gray-400">Based on your year performance</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-gradient">{plan.overallScore}</div>
            <div className="text-sm text-gray-400">/ 100</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--primary)] via-purple-500 to-pink-500 transition-all duration-1000"
            style={{ width: `${plan.overallScore}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
          </div>
        </div>

        {/* Score interpretation */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            {plan.overallScore >= 80
              ? '🌟 Excellent! You\'re in the top tier of players'
              : plan.overallScore >= 60
              ? '💪 Great work! You\'re above average'
              : plan.overallScore >= 40
              ? '📈 Good foundation! Focus on the goals below'
              : '🎯 Lots of room to grow! Let\'s get started'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-6 py-3 font-medium transition-colors ${
            selectedTab === 'overview'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('goals')}
          className={`px-6 py-3 font-medium transition-colors ${
            selectedTab === 'goals'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Goals ({plan.goals.length})
        </button>
        <button
          onClick={() => setSelectedTab('skills')}
          className={`px-6 py-3 font-medium transition-colors ${
            selectedTab === 'skills'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Skill Assessment
        </button>
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && <OverviewTab plan={plan} />}
      {selectedTab === 'goals' && <GoalsTab goals={plan.goals} />}
      {selectedTab === 'skills' && <SkillsTab assessments={plan.skillAssessments} />}
    </div>
  );
}

// Overview Tab
function OverviewTab({ plan }: { plan: ImprovementPlan }) {
  return (
    <div className="space-y-6">
      {/* Weekly Focus */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">🎯 This Week's Focus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.weeklyFocus.map((focus, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-[var(--primary)]/10 to-transparent border border-[var(--primary)]/30"
            >
              <span className="text-2xl">{index + 1}</span>
              <p className="text-sm text-gray-200">{focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Priority Goals */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">🔥 High Priority Goals</h3>
        <div className="space-y-4">
          {plan.goals
            .filter((g) => g.priority === 'high')
            .slice(0, 3)
            .map((goal) => (
              <GoalCard key={goal.id} goal={goal} compact />
            ))}
        </div>
      </div>

      {/* Recommended Champions */}
      {plan.recommendedChampions.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">
            👑 Recommended Champions to Master
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.recommendedChampions.map((champ) => (
              <div
                key={champ}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white font-medium"
              >
                {champ}
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-400">
            These champions complement your playstyle and can help you climb
          </p>
        </div>
      )}
    </div>
  );
}

// Goals Tab
function GoalsTab({ goals }: { goals: ImprovementGoal[] }) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredGoals =
    filter === 'all' ? goals : goals.filter((g) => g.priority === filter);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
          <button
            key={priority}
            onClick={() => setFilter(priority)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === priority
                ? 'bg-[var(--primary)] text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {priority === 'all' ? 'All Goals' : `${priority.charAt(0).toUpperCase()}${priority.slice(1)} Priority`}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}

// Goal Card Component
function GoalCard({ goal, compact = false }: { goal: ImprovementGoal; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    high: 'from-red-500/20 to-orange-500/20 border-red-500/30',
    medium: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
    low: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  };

  const categoryIcons = {
    mechanical: '⚔️',
    'game-knowledge': '📚',
    consistency: '📈',
    macro: '🗺️',
    'champion-pool': '🎮',
  };

  return (
    <div
      className={`rounded-xl bg-gradient-to-r ${priorityColors[goal.priority]} border p-6 transition-all duration-300 hover:scale-102`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{categoryIcons[goal.category]}</span>
            <h4 className="text-lg font-bold text-white">{goal.title}</h4>
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${
                goal.priority === 'high'
                  ? 'bg-red-500 text-white'
                  : goal.priority === 'medium'
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {goal.priority.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-300">{goal.description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">
            Current: {goal.currentValue} {goal.unit}
          </span>
          <span className="text-[var(--primary)] font-bold">
            Target: {goal.targetValue} {goal.unit}
          </span>
        </div>
        <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{goal.progress}% complete</span>
          <span>⏱️ {goal.estimatedTimeframe}</span>
        </div>
      </div>

      {/* Tips Toggle */}
      {!compact && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-[var(--primary)] hover:underline"
        >
          {expanded ? '▼ Hide Tips' : '▶ Show Tips'}
        </button>
      )}

      {/* Tips (Expandable) */}
      {expanded && !compact && (
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-bold text-white">💡 Tips to Achieve This Goal:</h5>
          <ul className="space-y-2">
            {goal.tips.map((tip, index) => (
              <li
                key={index}
                className="text-sm text-gray-300 flex items-start gap-2"
              >
                <span className="text-[var(--primary)] mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Skills Tab
function SkillsTab({ assessments }: { assessments: SkillAssessment[] }) {
  return (
    <div className="space-y-6">
      {assessments.map((assessment, index) => (
        <SkillAssessmentCard key={index} assessment={assessment} delay={index * 100} />
      ))}
    </div>
  );
}

// Skill Assessment Card
function SkillAssessmentCard({
  assessment,
  delay = 0,
}: {
  assessment: SkillAssessment;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Master':
        return '#f59e0b';
      case 'Expert':
        return '#a855f7';
      case 'Advanced':
        return '#3b82f6';
      case 'Intermediate':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      ref={ref}
      className={`card transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{assessment.category}</h3>
        <span
          className="px-4 py-2 rounded-lg font-bold"
          style={{ backgroundColor: `${getRankColor(assessment.rank)}20`, color: getRankColor(assessment.rank) }}
        >
          {assessment.rank}
        </span>
      </div>

      {/* Dual Progress Bars */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Current Level</span>
            <span className="text-white font-bold">{assessment.currentLevel}/100</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
              style={{ width: isVisible ? `${assessment.currentLevel}%` : '0%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Potential Level</span>
            <span className="text-[var(--primary)] font-bold">{assessment.potentialLevel}/100</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-purple-500 transition-all duration-1000"
              style={{ width: isVisible ? `${assessment.potentialLevel}%` : '0%', transitionDelay: '200ms' }}
            />
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-bold text-green-400 mb-2">✅ Strengths</h4>
          <ul className="space-y-1">
            {assessment.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-gray-300">
                • {strength}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-orange-400 mb-2">📍 Areas to Improve</h4>
          <ul className="space-y-1">
            {assessment.weaknesses.map((weakness, i) => (
              <li key={i} className="text-sm text-gray-300">
                • {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
