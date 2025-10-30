import type { Child, RoundResult, CandyType } from '../../types/game.types';
import ScoreBreakdownDetails from './ScoreBreakdownDetails';

interface FeedbackModalProps {
  isCorrect: boolean;
  message: string;
  roundResult?: RoundResult;
  children?: Child[];
  availableCandies?: CandyType[];
  onClose: () => void;
  isLastRound?: boolean;
}

export default function FeedbackModal({
  isCorrect,
  message,
  roundResult,
  children,
  availableCandies,
  onClose,
  isLastRound = false
}: FeedbackModalProps) {
  const hasHatePenalties = roundResult?.childResults.some(r => r.hatePenalty && r.hatePenalty < 0);
  const totalHatePenalty = roundResult?.childResults.reduce((sum, r) => sum + (r.hatePenalty || 0), 0) || 0;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className={`card max-w-2xl w-full text-center transform transition-all animate-bounce-slow ${
          isCorrect ? 'border-green-500' : 'border-red-500'
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="text-8xl mb-4">
          {isCorrect ? '🎉' : '😢'}
        </div>
        <h2
          className={`text-3xl font-bold mb-4 ${
            isCorrect ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isCorrect ? 'Perfect Round!' : 'Round Complete!'}
        </h2>
        <p className="text-xl text-gray-200 mb-4">{message}</p>

        {/* Round Score */}
        {roundResult && (
          <div className="mb-6">
            <div className="text-4xl font-bold text-halloween-orange mb-2">
              +{roundResult.pointsEarned} points
            </div>
            {hasHatePenalties && (
              <div className="text-sm text-red-400 flex items-center justify-center gap-2">
                <span>🚫</span>
                <span>Includes {totalHatePenalty} hate penalty</span>
              </div>
            )}
          </div>
        )}

        {/* Detailed Results */}
        {roundResult && children && availableCandies && (
          <div className="bg-halloween-black/40 rounded-lg p-4 mb-4 text-left">
            <h3 className="text-lg font-bold text-halloween-orange mb-3 text-center">
              Results Breakdown
            </h3>
            
            <div className="space-y-2">
              {roundResult.childResults.map((result) => {
                const child = children.find(c => c.id === result.childId);
                if (!child) return null;

                const hasHatePenalty = result.hatePenalty && result.hatePenalty < 0;
                const hatedCandyEmoji = child.hatedCandy 
                  ? availableCandies.find(c => c.name === child.hatedCandy)?.emoji || '🍬'
                  : '';

                return (
                  <div
                    key={result.childId}
                    className={`
                      p-3 rounded-lg border-2
                      ${result.isCorrect ? 'bg-green-900/20 border-green-500/50' : ''}
                      ${result.isPartial ? 'bg-yellow-900/20 border-yellow-500/50' : ''}
                      ${!result.isCorrect && !result.isPartial ? 'bg-gray-900/20 border-gray-500/50' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{child.emoji}</span>
                        <span className="font-bold text-sm">
                          {child.id.replace('child-', 'Child ')}
                        </span>
                        {child.isSpecial && (
                          <span className="text-base" title="Special child - 2x points!">👑</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {result.isCorrect ? '✅' : result.isPartial ? '⚠️' : '❌'}
                        </span>
                        <span className={`font-bold text-sm ${
                          result.isCorrect ? 'text-green-400' :
                          result.isPartial ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {result.pointsEarned > 0 ? '+' : ''}{result.pointsEarned} pts
                        </span>
                      </div>
                    </div>

                    {/* Hate Penalty Details */}
                    {hasHatePenalty && (
                      <div className="mt-2 p-2 bg-red-900/30 border border-red-500/50 rounded flex items-center gap-2">
                        <span className="text-sm">🚫</span>
                        <span className="text-xs text-red-300">
                          Hate penalty: {result.hatePenalty} pts from {hatedCandyEmoji} {child.hatedCandy}
                        </span>
                      </div>
                    )}

                    {/* Detailed Score Breakdown */}
                    {result.breakdown && (
                      <ScoreBreakdownDetails
                        child={child}
                        breakdown={result.breakdown}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-4 pt-3 border-t border-halloween-orange/30">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-green-400 font-bold text-lg">
                    {roundResult.childResults.filter(r => r.isCorrect).length}
                  </div>
                  <div className="text-gray-400">Perfect ✅</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold text-lg">
                    {roundResult.childResults.filter(r => r.isPartial).length}
                  </div>
                  <div className="text-gray-400">Partial ⚠️</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold text-lg">
                    {roundResult.childResults.filter(r => !r.isCorrect && !r.isPartial).length}
                  </div>
                  <div className="text-gray-400">Missed ❌</div>
                </div>
              </div>
            </div>

            {/* Hate Candy Warning */}
            {hasHatePenalties && (
              <div className="mt-3 p-2 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-sm font-bold text-red-400 mb-1 text-center">
                  ⚠️ Hate Candy Penalties Applied!
                </p>
                <p className="text-xs text-red-300 text-center">
                  Remember to check which candies each child hates (🚫) to avoid penalties
                </p>
              </div>
            )}
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="btn-primary w-full text-lg py-3"
          >
            {isLastRound ? 'View Final Results 🎉' : 'Continue to Next Round →'}
          </button>
        </div>
      </div>
    </div>
  );
}