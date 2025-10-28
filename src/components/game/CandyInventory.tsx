import type { CandyType } from '../../types/game.types';

interface CandyInventoryProps {
  initialCandies: CandyType[];
  remainingCandies: CandyType[];
}

export default function CandyInventory({
  initialCandies,
  remainingCandies
}: CandyInventoryProps) {
  const getRemaining = (candyName: string): number => {
    const remaining = remainingCandies.find(c => c.name === candyName);
    return remaining?.quantity || 0;
  };

  const getPercentageRemaining = (candyName: string): number => {
    const initial = initialCandies.find(c => c.name === candyName);
    const remaining = getRemaining(candyName);
    if (!initial || initial.quantity === 0) return 0;
    return Math.round((remaining / initial.quantity) * 100);
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold text-halloween-orange mb-4 flex items-center gap-2">
        <span>🏠</span>
        Your Candy Inventory
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialCandies.map((candy) => {
          const remaining = getRemaining(candy.name);
          const percentage = getPercentageRemaining(candy.name);
          const isLow = percentage < 30 && percentage > 0;
          const isEmpty = remaining === 0;
          
          return (
            <div 
              key={candy.name}
              className={`
                p-4 rounded-lg transition-all
                ${isEmpty ? 'bg-gray-800/40 opacity-60' : 'bg-halloween-black/30'}
                ${isLow ? 'border border-yellow-500' : ''}
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{candy.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: candy.color }}>
                    {candy.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    {remaining} / {candy.quantity}
                  </p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`
                    h-full transition-all duration-300 rounded-full
                    ${isEmpty ? 'bg-gray-600' : ''}
                    ${isLow ? 'bg-yellow-500' : ''}
                    ${!isEmpty && !isLow ? 'bg-green-500' : ''}
                  `}
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: !isEmpty && !isLow ? candy.color : undefined
                  }}
                />
              </div>
              
              {/* Status */}
              <div className="mt-2 text-xs text-center">
                {isEmpty && (
                  <span className="text-gray-400">All gone! 🎃</span>
                )}
                {isLow && !isEmpty && (
                  <span className="text-yellow-400">Running low! ⚠️</span>
                )}
                {!isLow && !isEmpty && (
                  <span className="text-gray-400">{percentage}% remaining</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Total candies allocated:</span>
          <span className="font-bold text-halloween-orange">
            {initialCandies.reduce((sum, candy) => {
              const remaining = getRemaining(candy.name);
              return sum + (candy.quantity - remaining);
            }, 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-300">Total candies remaining:</span>
          <span className="font-bold text-halloween-orange">
            {remainingCandies.reduce((sum, candy) => sum + candy.quantity, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}