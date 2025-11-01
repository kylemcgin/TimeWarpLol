'use client';

import { WeirdStats } from '@/types';
import { useState, useRef, useEffect } from 'react';

interface WeirdStatsSectionProps {
  stats: WeirdStats;
}

export default function WeirdStatsSection({ stats }: WeirdStatsSectionProps) {
  return (
    <div className="card">
      <h2 className="text-3xl font-bold text-gradient mb-6 text-center">
        📊 Weird Stats That'll Make You Go "Wait, Really?"
      </h2>
      <p className="text-center text-gray-400 mb-8">
        The stats nobody asked for, but everyone needs to see
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.stats.map((stat, index) => (
          <WeirdStatCard key={index} stat={stat} delay={index * 100} />
        ))}
      </div>
    </div>
  );
}

function WeirdStatCard({
  stat,
  delay = 0,
}: {
  stat: {
    label: string;
    value: string | number;
    emoji: string;
    category: 'funny' | 'impressive' | 'concerning' | 'wild';
  };
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

  const categoryColors = {
    funny: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    impressive: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    concerning: 'from-red-500/20 to-pink-500/20 border-red-500/30',
    wild: 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
  };

  return (
    <div
      ref={ref}
      className={`p-6 rounded-xl bg-gradient-to-r ${categoryColors[stat.category]} border transition-all duration-500 hover:scale-105 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl flex-shrink-0">{stat.emoji}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-300 leading-relaxed">{stat.label}</p>
          {typeof stat.value === 'number' && stat.value > 100 && (
            <div className="mt-3 text-right">
              <CountUpNumber target={stat.value} isVisible={isVisible} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CountUpNumber({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span className="text-2xl font-bold text-[var(--primary)]">
      {count.toLocaleString()}
    </span>
  );
}
