'use client';

import { ChampionStats as ChampionStatsType } from '@/types';
import { ChampionRankBadge } from './ChampionImage';

interface ChampionStatsProps {
  champions: ChampionStatsType[];
}

export default function ChampionStats({ champions }: ChampionStatsProps) {
  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gradient mb-6">Champion Performance</h3>

      {/* Grid view for top 3 champions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {champions.slice(0, 3).map((champ, index) => (
          <div
            key={champ.championName}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 p-6 hover:scale-105 transition-all duration-300 hover:border-[var(--primary)]"
          >
            {/* Rank badge + Champion image */}
            <div className="flex items-start justify-between mb-4">
              <ChampionRankBadge
                rank={index + 1}
                championName={champ.championName}
                size="large"
              />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{champ.gamesPlayed}</p>
                <p className="text-xs text-gray-400">games</p>
              </div>
            </div>

            {/* Champion name */}
            <h4 className="text-lg font-bold text-white mb-3">{champ.championName}</h4>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Win Rate</p>
                <p
                  className="text-xl font-bold"
                  style={{
                    color:
                      champ.winRate >= 55
                        ? '#10b981'
                        : champ.winRate >= 45
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                >
                  {champ.winRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">KDA</p>
                <p
                  className="text-xl font-bold"
                  style={{
                    color:
                      champ.avgKDA >= 3
                        ? '#10b981'
                        : champ.avgKDA >= 2
                        ? '#3b82f6'
                        : '#a855f7',
                  }}
                >
                  {champ.avgKDA.toFixed(2)}
                </p>
              </div>
            </div>

            {/* K/D/A breakdown */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                <span className="text-green-400">{champ.avgKills.toFixed(1)}</span>
                {' / '}
                <span className="text-red-400">{champ.avgDeaths.toFixed(1)}</span>
                {' / '}
                <span className="text-blue-400">{champ.avgAssists.toFixed(1)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table view for remaining champions */}
      {champions.length > 3 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-4">Champion</th>
                <th className="text-center py-3 px-4">Games</th>
                <th className="text-center py-3 px-4">Win Rate</th>
                <th className="text-center py-3 px-4">KDA</th>
                <th className="text-center py-3 px-4">Avg K/D/A</th>
              </tr>
            </thead>
            <tbody>
              {champions.slice(3).map((champ, index) => (
                <tr
                  key={champ.championName}
                  className="border-b border-[var(--border)]/30 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">#{index + 4}</span>
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champ.championName.replace(/['\s]/g, '')}.png`}
                        alt={champ.championName}
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span>{champ.championName}</span>
                    </div>
                  </td>
                <td className="text-center py-3 px-4">{champ.gamesPlayed}</td>
                <td className="text-center py-3 px-4">
                  <span
                    className={
                      champ.winRate >= 55
                        ? 'text-green-400'
                        : champ.winRate >= 45
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }
                  >
                    {champ.winRate.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center py-3 px-4">
                  <span
                    className={
                      champ.avgKDA >= 3
                        ? 'text-green-400'
                        : champ.avgKDA >= 2
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }
                  >
                    {champ.avgKDA.toFixed(2)}
                  </span>
                </td>
                <td className="text-center py-3 px-4 text-sm text-gray-400">
                  {champ.avgKills.toFixed(1)} / {champ.avgDeaths.toFixed(1)} /{' '}
                  {champ.avgAssists.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
