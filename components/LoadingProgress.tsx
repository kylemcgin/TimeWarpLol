'use client';

import { useEffect, useState } from 'react';

interface LoadingProgressProps {
  stage: 'idle' | 'fetching-player' | 'fetching-matches' | 'processing' | 'generating-insights' | 'complete';
  matchCount?: number;
  totalMatches?: number;
}

const STAGE_INFO = {
  idle: { text: 'Preparing...', progress: 0 },
  'fetching-player': { text: 'Finding your summoner...', progress: 15 },
  'fetching-matches': { text: 'Loading match history...', progress: 35 },
  processing: { text: 'Analyzing your performance...', progress: 65 },
  'generating-insights': { text: 'Generating AI insights...', progress: 85 },
  complete: { text: 'Complete!', progress: 100 },
};

export default function LoadingProgress({ stage, matchCount, totalMatches }: LoadingProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const targetProgress = STAGE_INFO[stage].progress;

  // Smooth progress animation
  useEffect(() => {
    const increment = targetProgress > displayProgress ? 1 : -1;
    if (displayProgress === targetProgress) return;

    const timer = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev === targetProgress) {
          clearInterval(timer);
          return prev;
        }
        return prev + increment;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [targetProgress, displayProgress]);

  return (
    <div className="w-full max-w-2xl mx-auto p-8 space-y-6">
      {/* Animated Logo/Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{displayProgress}%</span>
          </div>
        </div>
      </div>

      {/* Stage Description */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">
          {STAGE_INFO[stage].text}
        </h3>
        {stage === 'fetching-matches' && matchCount !== undefined && totalMatches !== undefined && (
          <p className="text-gray-400">
            Loaded {matchCount} of {totalMatches} matches
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--primary)] via-purple-500 to-pink-500 transition-all duration-300 ease-out relative"
            style={{ width: `${displayProgress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Started</span>
          <span>{displayProgress}%</span>
          <span>Complete</span>
        </div>
      </div>

      {/* Loading Steps */}
      <div className="space-y-3 mt-8">
        {Object.entries(STAGE_INFO).slice(1, -1).map(([key, info]) => {
          const isComplete = STAGE_INFO[stage].progress > info.progress;
          const isCurrent = stage === key;

          return (
            <div
              key={key}
              className={`flex items-center space-x-3 transition-all duration-300 ${
                isCurrent ? 'scale-105' : ''
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isComplete
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-[var(--primary)] animate-pulse'
                    : 'bg-gray-700'
                }`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  isComplete || isCurrent ? 'text-white font-medium' : 'text-gray-500'
                }`}
              >
                {info.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Fun Loading Messages */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400 italic animate-pulse">
          {getLoadingMessage(stage)}
        </p>
      </div>
    </div>
  );
}

function getLoadingMessage(stage: LoadingProgressProps['stage']): string {
  const messages = {
    idle: 'Warming up the servers...',
    'fetching-player': 'Stalking your profile...',
    'fetching-matches': 'Reading your match history like a novel...',
    processing: 'Crunching the numbers...',
    'generating-insights': 'Asking AI what it thinks of your gameplay...',
    complete: 'All done!',
  };

  return messages[stage];
}
