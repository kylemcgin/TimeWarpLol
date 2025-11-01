'use client';

import { EvolutionTimeline } from '@/types';
import { useState, useRef, useEffect } from 'react';

interface EvolutionTimelineSectionProps {
  timeline: EvolutionTimeline;
}

export default function EvolutionTimelineSection({ timeline }: EvolutionTimelineSectionProps) {
  return (
    <div className="card">
      <h2 className="text-3xl font-bold text-gradient mb-6 text-center">
        📈 Your Evolution Timeline
      </h2>
      <p className="text-center text-gray-400 mb-12">
        Key moments that defined your year
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] via-purple-500 to-pink-500" />

        {/* Milestones */}
        <div className="space-y-12">
          {timeline.milestones.map((milestone, index) => (
            <TimelineMilestone
              key={index}
              milestone={milestone}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineMilestone({
  milestone,
  index,
  isLeft,
}: {
  milestone: EvolutionTimeline['milestones'][0];
  index: number;
  isLeft: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const typeColors = {
    achievement: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50',
    milestone: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
    setback: 'from-red-500/20 to-pink-500/20 border-red-500/50',
    highlight: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
  };

  const typeIcons = {
    achievement: '🏆',
    milestone: '📍',
    setback: '⚠️',
    highlight: '⭐',
  };

  return (
    <div
      ref={ref}
      className={`relative flex items-center ${
        isLeft ? 'md:flex-row-reverse' : ''
      } transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${isLeft ? 'translate-x-8' : '-translate-x-8'}`
      }`}
    >
      {/* Timeline dot */}
      <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-gray-900 z-10 transform -translate-x-1/2 md:translate-x-0">
        <div className="absolute inset-0 rounded-full bg-[var(--primary)] animate-ping opacity-75" />
      </div>

      {/* Month indicator */}
      <div className="absolute left-14 md:left-1/2 transform md:-translate-x-1/2 -translate-y-8 md:translate-y-0">
        <span className="px-3 py-1 bg-[var(--primary)] text-gray-900 text-xs font-bold rounded-full">
          {milestone.month}
        </span>
      </div>

      {/* Content card */}
      <div className={`flex-1 ml-20 md:ml-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
        <div
          className={`p-6 rounded-xl bg-gradient-to-r ${typeColors[milestone.type]} border backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">{typeIcons[milestone.type]}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
              <p className="text-sm text-gray-300 mb-4">{milestone.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-black/20 rounded">
                  <p className="text-xs text-gray-400">Win Rate</p>
                  <p className="text-lg font-bold text-[var(--primary)]">
                    {milestone.stats.winRate.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center p-2 bg-black/20 rounded">
                  <p className="text-xs text-gray-400">KDA</p>
                  <p className="text-lg font-bold text-blue-400">
                    {milestone.stats.kda.toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-2 bg-black/20 rounded">
                  <p className="text-xs text-gray-400">Games</p>
                  <p className="text-lg font-bold text-white">
                    {milestone.stats.gamesPlayed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
