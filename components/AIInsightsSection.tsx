import { AIInsights } from '@/types';

interface AIInsightsSectionProps {
  insights: AIInsights;
}

export default function AIInsightsSection({ insights }: AIInsightsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Personalized Summary */}
      <div className="card glow">
        <div className="flex items-start gap-4">
          <div className="text-4xl">✨</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gradient mb-3">Your Year in a Nutshell</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              {insights.personalizedSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Playstyle Analysis */}
      {insights.playstyleAnalysis && (
        <div className="card">
          <h3 className="text-xl font-bold text-gradient mb-4">🎯 Your Playstyle</h3>
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">
            {insights.playstyleAnalysis}
          </p>
        </div>
      )}

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-green-400 mb-4">💪 Your Strengths</h3>
          <ul className="space-y-3">
            {insights.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-gray-200">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-blue-400 mb-4">📈 Areas to Improve</h3>
          <ul className="space-y-3">
            {insights.areasForImprovement.map((area, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">→</span>
                <span className="text-gray-200">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fun Facts */}
      {insights.funFacts.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gradient mb-4">🎉 Fun Facts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.funFacts.map((fact, index) => (
              <div key={index} className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <p className="text-gray-200">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="card glow text-center">
        <div className="text-3xl mb-3">🚀</div>
        <p className="text-xl font-semibold text-gradient mb-2">
          {insights.motivationalMessage}
        </p>
        {insights.predictedRankNextSeason && (
          <p className="text-gray-400">
            Predicted next season: <span className="text-[var(--primary)]">{insights.predictedRankNextSeason}</span>
          </p>
        )}
      </div>
    </div>
  );
}
