import { useState, useEffect } from 'react';
import type { Child, AllocatedCandy, CandyType, ChildResult } from '../../types/game.types';

interface ChildCardProps {
  child: Child;
  availableCandies: CandyType[];
  allocation: AllocatedCandy[];
  onChange: (allocation: AllocatedCandy[]) => void;
  disabled?: boolean;
  result?: ChildResult;
}

export default function ChildCard({
  child,
  availableCandies,
  allocation,
  onChange,
  disabled = false,
  result
}: ChildCardProps) {
  const [localAllocation, setLocalAllocation] = useState<AllocatedCandy[]>(allocation);

  // Update local state when parent allocation changes
  useEffect(() => {
    setLocalAllocation(allocation);
  }, [allocation]);

  const handleQuantityChange = (candyName: string, value: string) => {
    // Remove all non-numeric characters to allow only numbers
    const numericOnly = value.replace(/\D/g, '');
    const numValue = parseInt(numericOnly) || 0;
    
    // Find or create allocation for this candy
    const newAllocation = [...localAllocation];
    const existingIndex = newAllocation.findIndex(a => a.candyName === candyName);
    
    if (existingIndex >= 0) {
      newAllocation[existingIndex] = { candyName, quantity: numValue };
    } else {
      newAllocation.push({ candyName, quantity: numValue });
    }
    
    // Remove zero allocations
    const filtered = newAllocation.filter(a => a.quantity > 0);
    
    setLocalAllocation(filtered);
    onChange(filtered);
  };

  const getAllocatedQuantity = (candyName: string): number => {
    const allocated = localAllocation.find(a => a.candyName === candyName);
    return allocated?.quantity || 0;
  };

  const getAvailableQuantity = (candyName: string): number => {
    const candy = availableCandies.find(c => c.name === candyName);
    return candy?.quantity || 0;
  };

  // Get result indicator
  const getResultIndicator = () => {
    if (!result) return null;
    
    return (
      <div className="flex flex-col gap-1 items-end">
        {/* Main score */}
        <div className={`flex items-center gap-2 ${
          result.isCorrect ? 'text-green-400' :
          result.isPartial ? 'text-yellow-400' :
          'text-gray-400'
        }`}>
          <span className="text-2xl">
            {result.isCorrect ? '✅' : result.isPartial ? '⚠️' : '❌'}
          </span>
          <span className="font-bold">
            {result.pointsEarned > 0 ? '+' : ''}{result.pointsEarned} pts
          </span>
        </div>
        
        {/* Hate penalty indicator */}
        {result.hatePenalty && result.hatePenalty < 0 && (
          <div className="flex items-center gap-1 text-red-400 text-xs">
            <span>🚫</span>
            <span>{result.hatePenalty} hate penalty</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      card mb-2 transition-all p-2
      ${child.isSpecial ? 'border-2 border-yellow-400 bg-gradient-to-r from-halloween-purple/20 to-yellow-900/20' : ''}
      ${result?.isCorrect ? 'ring-2 ring-green-400' : ''}
      ${result?.isPartial ? 'ring-2 ring-yellow-400' : ''}
    `}>
      {/* Child Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-2xl">{child.emoji}</span>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-bold text-halloween-orange">
                {child.id.replace('child-', 'Child ')}
              </h3>
              {child.isSpecial && (
                <span className="text-lg" title="Special child - earns 2x points!">
                  👑
                </span>
              )}
              {child.isSpecial && (
              <div className="text-xs text-yellow-400">2x pts!</div>
              )}
            </div>
           
          </div>
        </div>
        
        {result && getResultIndicator()}
      </div>

      {/* Requests */}
      <div className="mb-1.5 p-1.5 bg-halloween-black/40 rounded-lg">
        <p className="text-xs text-gray-300 mb-1 font-semibold">Wants:</p>
        <div className="flex flex-wrap gap-1">
          {child.requests.map((request, index) => {
            const candy = availableCandies.find(c => c.name === request.candyName);
            return (
              <div
                key={index}
                className="flex items-center gap-0.5 px-1.5 py-0.5 bg-halloween-purple/40 rounded-full"
              >
                <span className="text-sm">{candy?.emoji || '🍬'}</span>
                <span className="font-bold text-halloween-orange text-xs">{request.quantity}</span>
                <span className="text-xs text-gray-300">{request.candyName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hated Candy */}
      {child.hatedCandy && (
        <div className="mb-1.5 p-1.5 bg-red-900/30 rounded-lg border border-red-500/50">
          <p className="text-xs text-red-400 mb-1 font-semibold flex items-center gap-1">
            <span>🚫</span>
            <span>Hates:</span>
          </p>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-800/40 rounded-full inline-flex">
            <span className="text-sm">
              {availableCandies.find(c => c.name === child.hatedCandy)?.emoji || '🍬'}
            </span>
            <span className="text-xs text-red-300 font-bold">{child.hatedCandy}</span>
            <span className="text-xs text-red-400">(-1 pt each)</span>
          </div>
        </div>
      )}

      {/* Allocation Inputs - Show ALL candy types */}
      <div className="space-y-1">
        <p className="text-xs text-gray-300 font-semibold mb-1">Give:</p>
        {availableCandies.map((candy) => {
          const allocated = getAllocatedQuantity(candy.name);
          const available = getAvailableQuantity(candy.name);
          const isOverAllocated = allocated > available;
          
          // Check if this candy is in the child's requests
          const requestedAmount = child.requests.find(r => r.candyName === candy.name)?.quantity || 0;
          const isCorrect = allocated === requestedAmount && requestedAmount > 0;
          const isRequested = requestedAmount > 0;
          
          // Check if this candy is hated by the child
          const isHated = child.hatedCandy === candy.name;
          
          return (
            <div
              key={candy.name}
              className={`
                flex items-center justify-between gap-1.5 p-1 rounded-lg
                ${isOverAllocated ? 'bg-red-900/30 border border-red-500' : 'bg-halloween-black/20'}
                ${!disabled && isCorrect ? 'border border-green-500' : ''}
                ${isRequested ? 'bg-halloween-purple/20' : ''}
              
              `}
            >
              <div className="flex items-center gap-1 flex-1 min-w-30">
                <span className="text-base flex-shrink-0">{candy.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color: candy.color }}>
                    {candy.name}
                  </p>
                </div>
              </div>
              
              <input
                type="text"
                value={allocated || ''}
                onChange={(e) => handleQuantityChange(candy.name, e.target.value)}
                disabled={disabled}
                placeholder="0"
                className={`
                  input-field text-center text-sm font-bold
                  ${isOverAllocated ? 'border-red-500 text-red-400' : ''}
                  ${!disabled && isCorrect ? 'border-green-500' : ''}
                  ${isHated && !isOverAllocated && !isCorrect ? 'border-red-400/50' : ''}
                  disabled:opacity-50
                `}
              />
            </div>
          );
        })}
        
        {/* Warning for over-allocation */}
        {!disabled && availableCandies.some(candy =>
          getAllocatedQuantity(candy.name) > getAvailableQuantity(candy.name)
        ) && (
          <div className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <span>⚠️</span>
            <span>Not enough!</span>
          </div>
        )}
      </div>
    </div>
  );
}
