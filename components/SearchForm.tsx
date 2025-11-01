'use client';

import { useState } from 'react';
import LoadingProgress from './LoadingProgress';

interface SearchFormProps {
  onSearch: (summonerName: string, region: string, year: number) => void;
  loading: boolean;
  error: string | null;
  loadingStage?: 'idle' | 'fetching-player' | 'fetching-matches' | 'processing' | 'generating-insights' | 'complete';
  matchProgress?: { current: number; total: number };
}

const REGIONS = [
  { value: 'NA', label: 'North America' },
  { value: 'EUW', label: 'Europe West' },
  { value: 'EUN', label: 'Europe Nordic & East' },
  { value: 'KR', label: 'Korea' },
  { value: 'BR', label: 'Brazil' },
  { value: 'JP', label: 'Japan' },
  { value: 'LAN', label: 'Latin America North' },
  { value: 'LAS', label: 'Latin America South' },
  { value: 'OCE', label: 'Oceania' },
  { value: 'TR', label: 'Turkey' },
];

export default function SearchForm({ onSearch, loading, error, loadingStage = 'idle', matchProgress }: SearchFormProps) {
  const [summonerName, setSummonerName] = useState('');
  const [region, setRegion] = useState('NA');
  const [year, setYear] = useState(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summonerName.trim()) {
      onSearch(summonerName.trim(), region, year);
    }
  };

  // Show loading progress when loading
  if (loading && loadingStage !== 'idle') {
    return (
      <LoadingProgress
        stage={loadingStage}
        matchCount={matchProgress?.current}
        totalMatches={matchProgress?.total}
      />
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="summonerName" className="block text-sm font-medium mb-2">
            Summoner Name or Riot ID
          </label>
          <input
            type="text"
            id="summonerName"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            placeholder="e.g., Doublelift or Doublelift#NA1"
            className="w-full px-4 py-3 bg-[#0a0e27] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] text-white"
            disabled={loading}
            required
          />
          <p className="mt-2 text-xs text-gray-400">
            💡 Supports both formats: <span className="text-[var(--primary)]">SummonerName</span> or <span className="text-[var(--primary)]">GameName#TAG</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="region" className="block text-sm font-medium mb-2">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0e27] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] text-white"
              disabled={loading}
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium mb-2">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#0a0e27] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] text-white"
              disabled={loading}
            >
              {[2024, 2023, 2022].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Generating Your Review...' : 'Generate Year in Review'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-200">
          <strong>Note:</strong> You'll need a valid Riot API key configured in your environment
          variables. This will analyze your full year of ranked matches and generate personalized
          insights using AWS Bedrock AI.
        </p>
      </div>
    </div>
  );
}
