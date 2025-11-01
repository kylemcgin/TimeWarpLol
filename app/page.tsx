'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import YearReviewDashboard from '@/components/YearReviewDashboard';
import { YearInReview } from '@/types';

type LoadingStage = 'idle' | 'fetching-player' | 'fetching-matches' | 'processing' | 'generating-insights' | 'complete';

export default function Home() {
  const [yearInReview, setYearInReview] = useState<YearInReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('idle');

  const handleSearch = async (summonerName: string, region: string, year: number) => {
    setLoading(true);
    setError(null);
    setLoadingStage('fetching-player');

    try {
      // Simulate stage progression
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summonerName, region, year }),
      });

      setLoadingStage('fetching-matches');

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadingStage('processing');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate review');
      }

      setLoadingStage('generating-insights');
      const data = await response.json();

      setLoadingStage('complete');
      await new Promise(resolve => setTimeout(resolve, 500));

      setYearInReview(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoadingStage('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gradient mb-4">
            TimeWarp LoL
          </h1>
          <p className="text-xl text-gray-300">
            Your AI-Powered Year in Review
          </p>
        </header>

        {!yearInReview && (
          <SearchForm
            onSearch={handleSearch}
            loading={loading}
            error={error}
            loadingStage={loadingStage}
          />
        )}

        {yearInReview && (
          <YearReviewDashboard
            data={yearInReview}
            onReset={() => setYearInReview(null)}
          />
        )}
      </div>
    </main>
  );
}
