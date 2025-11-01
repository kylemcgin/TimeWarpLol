'use client';

import { Statistics } from '@/types';
import AnimatedStat from './AnimatedStat';

interface AdvancedStatsSectionProps {
  statistics: Statistics;
}

export default function AdvancedStatsSection({ statistics }: AdvancedStatsSectionProps) {
  const { farmingStats, damageStats, combatStats, communicationStats, advancedStats } = statistics;

  return (
    <div className="space-y-8">
      {/* Farming Stats (Tier 1) */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gradient mb-6">🌾 Farming & Economy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedStat
            value={farmingStats.totalCS}
            label="Total CS"
            icon={<span className="text-2xl">🗡️</span>}
            color="#f39c12"
            delay={100}
          />
          <AnimatedStat
            value={farmingStats.averageCSPerMinute}
            label="CS Per Minute"
            decimals={1}
            icon={<span className="text-2xl">⏱️</span>}
            color="#3498db"
            delay={200}
          />
          <AnimatedStat
            value={farmingStats.averageCSPerGame}
            label="Average CS Per Game"
            decimals={1}
            icon={<span className="text-2xl">📊</span>}
            color="#9b59b6"
            delay={300}
          />
          <AnimatedStat
            value={farmingStats.enemyJungleCS}
            label="Enemy Jungle CS Stolen"
            icon={<span className="text-2xl">🦹</span>}
            color="#e74c3c"
            delay={400}
          />
        </div>
      </div>

      {/* Damage Stats (Tier 1) */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gradient mb-6">💥 Damage Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <AnimatedStat
            value={Math.round(damageStats.averageDamageToChampions)}
            label="Avg Damage to Champions"
            icon={<span className="text-2xl">⚔️</span>}
            color="#e74c3c"
            delay={500}
          />
          <AnimatedStat
            value={Math.round(damageStats.averageDamageTaken)}
            label="Avg Damage Taken"
            icon={<span className="text-2xl">🛡️</span>}
            color="#3498db"
            delay={600}
          />
          <AnimatedStat
            value={Math.round(damageStats.averageDamageMitigated)}
            label="Avg Damage Mitigated"
            icon={<span className="text-2xl">🔰</span>}
            color="#2ecc71"
            delay={700}
          />
        </div>

        {/* Damage Type Breakdown */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-4 text-gray-300">Damage Type Breakdown</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {damageStats.physicalDamagePercent.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Physical</div>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${damageStats.physicalDamagePercent}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {damageStats.magicDamagePercent.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Magic</div>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${damageStats.magicDamagePercent}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {damageStats.trueDamagePercent.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400 mt-1">True</div>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${damageStats.trueDamagePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combat Stats (Tier 2) */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gradient mb-6">⚡ Combat Prowess</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedStat
            value={combatStats.largestKillingSpree}
            label="Largest Killing Spree"
            icon={<span className="text-2xl">🔥</span>}
            color="#ff6b6b"
            delay={800}
          />
          <AnimatedStat
            value={combatStats.largestMultiKill}
            label="Largest Multikill"
            icon={<span className="text-2xl">💀</span>}
            color="#ff9ff3"
            delay={900}
          />
          <AnimatedStat
            value={combatStats.averageCCTimePerGame}
            label="Avg CC Time Per Game"
            decimals={1}
            suffix="s"
            icon={<span className="text-2xl">🌀</span>}
            color="#54a0ff"
            delay={1000}
          />
          <AnimatedStat
            value={Math.round(combatStats.averageHealingPerGame)}
            label="Avg Healing Per Game"
            icon={<span className="text-2xl">💚</span>}
            color="#2ecc71"
            delay={1100}
          />
        </div>
      </div>

      {/* Communication Stats (Tier 3) */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gradient mb-6">📢 Communication Style</h3>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg">Your Style:</span>
            <span className="text-2xl font-bold capitalize text-[var(--primary)]">
              {communicationStats.communicationStyle}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {communicationStats.averagePingsPerGame.toFixed(1)} pings per game
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(communicationStats.pingBreakdown).map(([type, count], index) => (
            <div key={type} className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[var(--primary)]">{count}</div>
              <div className="text-xs text-gray-400 capitalize mt-1">
                {type.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Stats (Tier 3) */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gradient mb-6">🎯 Advanced Mechanics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedStat
            value={advancedStats.totalAbilityCasts}
            label="Total Ability Casts"
            icon={<span className="text-2xl">✨</span>}
            color="#a29bfe"
            delay={1200}
          />
          <AnimatedStat
            value={advancedStats.averageAbilityCastsPerGame}
            label="Avg Ability Casts/Game"
            decimals={0}
            icon={<span className="text-2xl">🔮</span>}
            color="#fd79a8"
            delay={1300}
          />
          <AnimatedStat
            value={advancedStats.totalControlWards}
            label="Control Wards Placed"
            icon={<span className="text-2xl">👁️</span>}
            color="#fdcb6e"
            delay={1400}
          />
          <AnimatedStat
            value={advancedStats.totalConsumablesPurchased}
            label="Consumables Purchased"
            icon={<span className="text-2xl">🧪</span>}
            color="#00b894"
            delay={1500}
          />
        </div>
      </div>
    </div>
  );
}
