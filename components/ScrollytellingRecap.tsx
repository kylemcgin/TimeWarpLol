'use client';

import { useState, useEffect, useRef } from 'react';
import { YearInReview } from '@/types';
import ChampionImage from './ChampionImage';

interface ScrollytellingRecapProps {
  data: YearInReview;
  onComplete?: () => void;
}

interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: string;
}

export default function ScrollytellingRecap({ data, onComplete }: ScrollytellingRecapProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const chapters: Chapter[] = [
    {
      id: 'intro',
      title: `Your ${data.year}`,
      subtitle: 'A Year in League of Legends',
      content: (
        <div className="text-center space-y-6">
          <p className="text-2xl text-gray-300">Get ready to relive your journey...</p>
          <div className="animate-bounce mt-12">
            <svg className="w-12 h-12 mx-auto text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="text-sm text-gray-400 mt-2">Scroll to begin</p>
          </div>
        </div>
      ),
    },
    {
      id: 'journey-start',
      title: 'Your Journey Began',
      subtitle: data.summary.startDate,
      content: (
        <div className="space-y-8 text-center">
          <div className="text-6xl">🎮</div>
          <p className="text-xl text-gray-300">
            You queued up for your first ranked game of the year
          </p>
          <div className="inline-block px-8 py-4 bg-[var(--primary)]/20 border border-[var(--primary)] rounded-lg">
            <p className="text-4xl font-bold text-white">{data.summary.totalGames}</p>
            <p className="text-sm text-gray-400">games later...</p>
          </div>
        </div>
      ),
    },
    {
      id: 'main-champion',
      title: `You Became a ${data.summary.favoriteChampion} Main`,
      content: (
        <div className="space-y-8">
          <div className="flex justify-center">
            <ChampionImage
              championName={data.summary.favoriteChampion}
              size="xlarge"
              variant="circle"
            />
          </div>
          <div className="text-center space-y-4">
            <p className="text-xl text-gray-300">
              {data.statistics.championStats[0]?.gamesPlayed} games played
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-3xl font-bold text-green-400">
                  {data.statistics.championStats[0]?.winRate.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-400">Win Rate</p>
              </div>
              <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-3xl font-bold text-blue-400">
                  {data.statistics.championStats[0]?.avgKDA.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">KDA</p>
              </div>
            </div>
          </div>
        </div>
      ),
      background: `linear-gradient(135deg, rgba(10, 14, 39, 0.95), rgba(26, 31, 58, 0.95))`,
    },
    {
      id: 'best-moment',
      title: 'Your Best Moments',
      content: (
        <div className="space-y-6 text-center">
          <div className="text-6xl">🏆</div>
          {data.achievements.slice(0, 3).map((achievement, i) => (
            <div
              key={i}
              className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg"
            >
              <p className="text-2xl">{achievement.icon}</p>
              <p className="text-lg font-bold text-white mt-2">{achievement.title}</p>
              <p className="text-sm text-gray-400">{achievement.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'personality',
      title: 'Your League Personality',
      subtitle: data.personality?.title,
      content: (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {data.personality?.type === 'calculated-assassin' && '🎯'}
              {data.personality?.type === 'reckless-warrior' && '⚔️'}
              {data.personality?.type === 'strategic-mastermind' && '🧠'}
              {data.personality?.type === 'one-trick-pony' && '💎'}
              {data.personality?.type === 'flex-player' && '🎭'}
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {data.personality?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {data.personality && Object.entries(data.personality.playstyleScore).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 capitalize">{key}</span>
                  <span className="text-white font-bold">{value}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-purple-500 transition-all duration-1000"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-[var(--primary)]">Your Traits:</p>
            {data.personality?.traits.map((trait, i) => (
              <p key={i} className="text-sm text-gray-300">• {trait}</p>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'looking-forward',
      title: 'Looking Forward',
      subtitle: `See you in ${data.year + 1}`,
      content: (
        <div className="space-y-8 text-center">
          <div className="text-6xl">🚀</div>
          <p className="text-xl text-gray-300">
            You've come so far this year
          </p>
          <div className="space-y-3">
            <p className="text-lg text-[var(--primary)] font-bold">Ready to level up?</p>
            <p className="text-gray-400">Check out your personalized improvement plan below</p>
          </div>
          <button
            onClick={onComplete}
            className="btn-primary mt-8"
          >
            View Full Dashboard
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const chapterHeight = windowHeight * 0.8;

      const newChapter = Math.min(
        Math.floor(scrollPosition / chapterHeight),
        chapters.length - 1
      );

      setCurrentChapter(newChapter);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky chapter display */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-700 ${
                currentChapter === index
                  ? 'opacity-100 scale-100'
                  : currentChapter > index
                  ? 'opacity-0 scale-95 -translate-y-12'
                  : 'opacity-0 scale-95 translate-y-12'
              }`}
              style={{
                background: chapter.background || 'transparent',
              }}
            >
              <div className="text-center space-y-6 max-w-3xl">
                <h2 className="text-5xl md:text-7xl font-bold text-gradient animate-fade-in">
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="text-xl md:text-2xl text-[var(--primary)]">
                    {chapter.subtitle}
                  </p>
                )}
                <div className="mt-12">{chapter.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {chapters.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentChapter
                  ? 'w-12 bg-[var(--primary)]'
                  : index < currentChapter
                  ? 'w-2 bg-[var(--primary)]/50'
                  : 'w-2 bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Spacer for scroll */}
      <div style={{ height: `${chapters.length * 80}vh` }} />
    </div>
  );
}
