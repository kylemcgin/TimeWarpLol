'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedStatProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  delay?: number;
  duration?: number;
  icon?: React.ReactNode;
  color?: string;
}

export default function AnimatedStat({
  value,
  label,
  suffix = '',
  prefix = '',
  decimals = 0,
  delay = 0,
  duration = 2000,
  icon,
  color = 'var(--primary)',
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection observer for reveal on scroll
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

  // Animate counter
  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (easeOutExpo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayValue(value * easeOutExpo);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <div
      ref={ref}
      className={`relative p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Animated gradient border effect */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ${
          isVisible ? 'opacity-20' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${color}, transparent)`,
        }}
      />

      <div className="relative z-10 space-y-3">
        {/* Icon */}
        {icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-500 ${
              isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}
            style={{
              backgroundColor: `${color}20`,
              transitionDelay: `${delay + 100}ms`,
            }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        )}

        {/* Value */}
        <div className="space-y-1">
          <div
            className="text-4xl font-bold tracking-tight"
            style={{ color: isVisible ? color : '#4B5563' }}
          >
            {prefix}
            {displayValue.toFixed(decimals)}
            {suffix}
          </div>

          {/* Progress bar under number */}
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                backgroundColor: color,
                transitionDelay: `${delay + 200}ms`,
              }}
            />
          </div>
        </div>

        {/* Label */}
        <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      </div>

      {/* Pulse animation on reveal */}
      {isVisible && (
        <div
          className="absolute inset-0 rounded-xl animate-ping opacity-20"
          style={{
            backgroundColor: color,
            animationDuration: '1s',
            animationIterationCount: '1',
          }}
        />
      )}
    </div>
  );
}

// Specialized stat component for KDA
export function AnimatedKDAStat({ kills, deaths, assists, delay = 0 }: { kills: number; deaths: number; assists: number; delay?: number }) {
  const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;
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

  const getKDAColor = (kda: number) => {
    if (kda >= 4) return '#10b981'; // green
    if (kda >= 3) return '#3b82f6'; // blue
    if (kda >= 2) return '#a855f7'; // purple
    return '#6b7280'; // gray
  };

  return (
    <div
      ref={ref}
      className={`p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 transform transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="space-y-3">
        <h3 className="text-sm text-gray-400 font-medium uppercase tracking-wide">Average KDA</h3>

        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: getKDAColor(kda), transitionDelay: `${delay}ms` }}>
            {kills.toFixed(1)}
          </span>
          <span className="text-gray-500">/</span>
          <span className={`text-2xl font-bold transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: '#ef4444', transitionDelay: `${delay + 100}ms` }}>
            {deaths.toFixed(1)}
          </span>
          <span className="text-gray-500">/</span>
          <span className={`text-2xl font-bold transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ color: '#3b82f6', transitionDelay: `${delay + 200}ms` }}>
            {assists.toFixed(1)}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold" style={{ color: getKDAColor(kda) }}>
              {kda.toFixed(2)}
            </span>
            <span className="text-gray-400">KDA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Win rate circle stat
export function AnimatedWinRateStat({ winRate, delay = 0 }: { winRate: number; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
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

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setProgress(winRate * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, winRate]);

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColor = (rate: number) => {
    if (rate >= 55) return '#10b981';
    if (rate >= 50) return '#3b82f6';
    if (rate >= 45) return '#a855f7';
    return '#ef4444';
  };

  return (
    <div
      ref={ref}
      className={`p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 transform transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-sm text-gray-400 font-medium uppercase tracking-wide">Win Rate</h3>

        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-full h-full">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#374151"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke={getColor(winRate)}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-2000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-bold" style={{ color: getColor(winRate) }}>
              {progress.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 uppercase">Win Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
