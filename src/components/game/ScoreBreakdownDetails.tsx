import { useState } from 'react';
import type { Child, DetailedScoreBreakdown } from '../../types/game.types';

interface ScoreBreakdownDetailsProps {
  child: Child;
  breakdown: DetailedScoreBreakdown;
}

export default function ScoreBreakdownDetails({ child, breakdown }: ScoreBreakdownDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to check if a candy was requested
  const wasRequested = (candyName: string, quantity: number): boolean => {
    const request = breakdown.requested.find(r => r.candyName === candyName);
    return request ? quantity <= request.quantity : false;
  };

  return (
    <div className="mt-2">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 bg-halloween-black/40 hover:bg-halloween-black/60 rounded-lg transition-colors border border-halloween-orange/30"
      >
        <span className="text-sm font-semibold text-halloween-orange flex items-center gap-2">
          <span>📊</span>
          Calculation Breakdown
        </span>
        <span className="text-halloween-orange text-lg">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-2 p-3 bg-halloween-black/30 rounded-lg border border-halloween-orange/20 space-y-3 animate-fade-in">
          {/* What They Wanted */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-2">What they wanted:</h4>
            <div className="space-y-1">
              {breakdown.requested.length > 0 ? (
                breakdown.requested.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{req.emoji}</span>
                    <span className="text-gray-200">{req.candyName} × {req.quantity}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Nothing requested</p>
              )}
            </div>
          </div>

          {/* What You Gave */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-2">What you gave:</h4>
            <div className="space-y-1">
              {breakdown.allocated.length > 0 ? (
                breakdown.allocated.map((alloc, idx) => {
                  const isCorrect = wasRequested(alloc.candyName, alloc.quantity);
                  const isHated = alloc.candyName === child.hatedCandy;
                  
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{alloc.emoji}</span>
                      <span className="text-gray-200">{alloc.candyName} × {alloc.quantity}</span>
                      {isHated && (
                        <span className="text-red-400 text-xs">🚫 Hated!</span>
                      )}
                      {!isHated && isCorrect && (
                        <span className="text-green-400">✅</span>
                      )}
                      {!isHated && !isCorrect && (
                        <span className="text-yellow-400">⚠️</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-400 italic">Nothing given</p>
              )}
            </div>
          </div>

          {/* Points Calculation */}
          <div className="pt-2 border-t border-halloween-orange/20">
            <h4 className="text-xs font-bold text-gray-400 mb-2">Points Calculation:</h4>
            <div className="space-y-1.5 text-sm">
              {/* Correct Points */}
              {breakdown.correctCandies > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-green-400 flex items-center gap-1">
                    <span>✅</span>
                    <span>Correct candies: {breakdown.correctCandies} × {breakdown.pointsPerCorrect}</span>
                  </span>
                  <span className="text-green-400 font-bold">
                    +{breakdown.correctPoints} pts
                  </span>
                </div>
              )}
              
              {/* Incorrect Points */}
              {breakdown.incorrectCandies > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Incorrect candies: {breakdown.incorrectCandies} × 0.5</span>
                  </span>
                  <span className="text-yellow-400 font-bold">
                    +{breakdown.incorrectPoints} pts
                  </span>
                </div>
              )}
              
              {/* Hate Penalty */}
              {breakdown.hatedCandiesGiven > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-red-400 flex items-center gap-1">
                    <span>🚫</span>
                    <span>Hate penalty: {breakdown.hatedCandiesGiven} × -1</span>
                  </span>
                  <span className="text-red-400 font-bold">
                    {breakdown.hatePenaltyPoints} pts
                  </span>
                </div>
              )}
              
              {/* No allocation message */}
              {breakdown.correctCandies === 0 && breakdown.incorrectCandies === 0 && (
                <div className="text-gray-400 italic">
                  No candies given = 0 pts
                </div>
              )}
              
              {/* Total Line */}
              <div className="pt-1.5 mt-1.5 border-t border-halloween-orange/30 flex items-center justify-between font-bold">
                <span className="text-halloween-orange">Total:</span>
                <span className="text-halloween-orange text-lg">
                  {breakdown.totalPoints > 0 ? '+' : ''}{breakdown.totalPoints} pts
                </span>
              </div>
              
              {/* Special Child Bonus Note */}
              {breakdown.isSpecial && breakdown.correctCandies > 0 && (
                <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-xs text-yellow-300 flex items-center gap-1">
                  <span>👑</span>
                  <span>Special child bonus applied (2× points for correct candies)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}