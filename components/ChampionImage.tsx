'use client';

import { useState } from 'react';

interface ChampionImageProps {
  championName: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'square' | 'circle' | 'loading' | 'splash';
  showName?: boolean;
  className?: string;
}

// Riot Data Dragon CDN - using latest patch version
const DATA_DRAGON_VERSION = '14.1.1';
const DATA_DRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}`;

// Size mappings
const SIZE_MAP = {
  small: { width: 40, height: 40 },
  medium: { width: 64, height: 64 },
  large: { width: 96, height: 96 },
  xlarge: { width: 120, height: 120 },
};

export default function ChampionImage({
  championName,
  size = 'medium',
  variant = 'square',
  showName = false,
  className = '',
}: ChampionImageProps) {
  const [imageError, setImageError] = useState(false);

  // Normalize champion name for Data Dragon
  // Data Dragon uses PascalCase with no spaces/special characters
  const normalizeChampionName = (name: string): string => {
    const nameMap: { [key: string]: string } = {
      // Special cases where champion names differ
      'Wukong': 'MonkeyKing',
      'Renata Glasc': 'Renata',
      'Nunu & Willump': 'Nunu',
      'Dr. Mundo': 'DrMundo',
      'Twisted Fate': 'TwistedFate',
      'Jarvan IV': 'JarvanIV',
      'Kha\'Zix': 'Khazix',
      'Vel\'Koz': 'Velkoz',
      'Cho\'Gath': 'Chogath',
      'Kog\'Maw': 'KogMaw',
      'Rek\'Sai': 'RekSai',
      'Lee Sin': 'LeeSin',
      'Master Yi': 'MasterYi',
      'Miss Fortune': 'MissFortune',
      'Tahm Kench': 'TahmKench',
      'Xin Zhao': 'XinZhao',
      'Aurelion Sol': 'AurelionSol',
      'Bel\'Veth': 'Belveth',
    };

    // Check if we have a specific mapping
    if (nameMap[name]) {
      return nameMap[name];
    }

    // Default: remove spaces and special characters, ensure PascalCase
    return name.replace(/['\s]/g, '');
  };

  const normalizedName = normalizeChampionName(championName);
  const dimensions = SIZE_MAP[size];

  // Get image URL based on variant
  const getImageUrl = () => {
    switch (variant) {
      case 'splash':
        // Full splash art
        return `${DATA_DRAGON_BASE}/img/champion/splash/${normalizedName}_0.jpg`;
      case 'loading':
        // Loading screen art
        return `${DATA_DRAGON_BASE}/img/champion/loading/${normalizedName}_0.jpg`;
      default:
        // Square icon (default)
        return `${DATA_DRAGON_BASE}/img/champion/${normalizedName}.png`;
    }
  };

  const imageUrl = getImageUrl();

  // Fallback placeholder when image fails to load
  const renderFallback = () => (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 ${
        variant === 'circle' ? 'rounded-full' : 'rounded-lg'
      }`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <span className="text-white font-bold text-sm">
        {championName.substring(0, 2).toUpperCase()}
      </span>
    </div>
  );

  return (
    <div className={`relative inline-block ${className}`}>
      {!imageError ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt={championName}
            width={dimensions.width}
            height={dimensions.height}
            className={`object-cover transition-all duration-300 ${
              variant === 'circle' ? 'rounded-full' : 'rounded-lg'
            } ${
              variant === 'splash' || variant === 'loading'
                ? 'group-hover:scale-105'
                : 'group-hover:brightness-110'
            }`}
            onError={() => setImageError(true)}
            loading="lazy"
          />

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              variant === 'circle' ? 'rounded-full' : 'rounded-lg'
            }`}
          />

          {/* Border glow effect */}
          <div
            className={`absolute inset-0 border-2 border-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              variant === 'circle' ? 'rounded-full' : 'rounded-lg'
            }`}
          />
        </div>
      ) : (
        renderFallback()
      )}

      {/* Champion name label */}
      {showName && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-white truncate max-w-[120px]">
            {championName}
          </p>
        </div>
      )}
    </div>
  );
}

// Animated champion mastery card
export function ChampionMasteryCard({
  championName,
  gamesPlayed,
  winRate,
  kda,
  delay = 0,
}: {
  championName: string;
  gamesPlayed: number;
  winRate: number;
  kda: number;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 transition-all duration-500 hover:scale-105 hover:border-[var(--primary)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsVisible(true)}
    >
      {/* Background splash art */}
      <div className="absolute inset-0 opacity-20">
        <ChampionImage
          championName={championName}
          variant="splash"
          size="xlarge"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 space-y-3">
        {/* Champion icon + name */}
        <div className="flex items-center space-x-3">
          <ChampionImage championName={championName} size="large" variant="circle" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{championName}</h3>
            <p className="text-sm text-gray-400">{gamesPlayed} games</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700">
          <div>
            <p className="text-xs text-gray-500">Win Rate</p>
            <p
              className="text-xl font-bold"
              style={{
                color: winRate >= 55 ? '#10b981' : winRate >= 50 ? '#3b82f6' : '#ef4444',
              }}
            >
              {winRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">KDA</p>
            <p
              className="text-xl font-bold"
              style={{
                color: kda >= 3 ? '#10b981' : kda >= 2 ? '#3b82f6' : '#a855f7',
              }}
            >
              {kda.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Champion rank badge (for top champions)
export function ChampionRankBadge({
  rank,
  championName,
  size = 'medium',
}: {
  rank: number;
  championName: string;
  size?: 'small' | 'medium' | 'large';
}) {
  const getBadgeColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600'; // Gold
    if (rank === 2) return 'from-gray-300 to-gray-400'; // Silver
    if (rank === 3) return 'from-orange-600 to-orange-700'; // Bronze
    return 'from-gray-600 to-gray-700';
  };

  const getBadgeIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="relative inline-block">
      <ChampionImage championName={championName} size={size} variant="circle" />

      {/* Rank badge */}
      <div
        className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${getBadgeColor(
          rank
        )} flex items-center justify-center border-2 border-gray-900 shadow-lg`}
      >
        <span className="text-xs font-bold text-white">{getBadgeIcon(rank)}</span>
      </div>
    </div>
  );
}
