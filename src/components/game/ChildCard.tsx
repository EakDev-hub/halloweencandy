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
    const numValue = parseInt(value) || 0;
    
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
    
    if (result.isCorrect) {
      return (
        <div className="flex items-center gap-2 text-green-400">
          <span className="text-2xl">✅</span>
          <span className="font-bold">+{result.pointsEarned} points</span>
        </div>
      );
    }
    
    if (result.isPartial) {
      return (
        <div className="flex items-center gap-2 text-yellow-400">
          <span className="text-2xl">⚠️</span>
          <span className="font-bold">+{result.pointsEarned} points (partial)</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <span className="text-2xl">❌</span>
        <span className="font-bold">No points</span>
      </div>
    );
  };

  return (
    <div className={`
      card mb-4 transition-all
      ${child.isSpecial ? 'border-2 border-yellow-400 bg-gradient-to-r from-halloween-purple/20 to-yellow-900/20' : ''}
      ${result?.isCorrect ? 'ring-2 ring-green-400' : ''}
      ${result?.isPartial ? 'ring-2 ring-yellow-400' : ''}
    `}>
      {/* Child Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{child.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-halloween-orange">
                {child.id.replace('child-', 'Child ')}
              </h3>
              {child.isSpecial && (
                <span className="text-2xl" title="Special child - earns 2x points!">
                  👑
                </span>
              )}
            </div>
            {child.isSpecial && (
              <p className="text-xs text-yellow-400">Special - 2x points!</p>
            )}
          </div>
        </div>
        
        {result && getResultIndicator()}
      </div>

      {/* Requests */}
      <div className="mb-4 p-3 bg-halloween-black/40 rounded-lg">
        <p className="text-sm text-gray-300 mb-2 font-semibold">Wants:</p>
        <div className="flex flex-wrap gap-2">
          {child.requests.map((request, index) => {
            const candy = availableCandies.find(c => c.name === request.candyName);
            return (
              <div 
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-halloween-purple/40 rounded-full"
              >
                <span className="text-xl">{candy?.emoji || '🍬'}</span>
                <span className="font-bold text-halloween-orange">{request.quantity}</span>
                <span className="text-xs text-gray-300">{request.candyName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation Inputs */}
      <div className="space-y-2">
        <p className="text-sm text-gray-300 font-semibold mb-2">Give to this child:</p>
        {child.requests.map((request) => {
          const candy = availableCandies.find(c => c.name === request.candyName);
          const allocated = getAllocatedQuantity(request.candyName);
          const available = getAvailableQuantity(request.candyName);
          const isOverAllocated = allocated > available;
          const isCorrect = allocated === request.quantity;
          
          if (!candy) return null;
          
          return (
            <div 
              key={request.candyName}
              className={`
                flex items-center justify-between p-2 rounded-lg
                ${isOverAllocated ? 'bg-red-900/30 border border-red-500' : 'bg-halloween-black/20'}
                ${!disabled && isCorrect ? 'border border-green-500' : ''}
              `}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-2xl">{candy.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: candy.color }}>
                    {candy.name}
                  </p>                 
                </div>
              </div>
              
              <input
                type="number"
                min="0"
                max={available}
                value={allocated}
                onChange={(e) => handleQuantityChange(request.candyName, e.target.value)}
                disabled={disabled}
                className={`
                  input-field w-20 text-center text-lg font-bold
                  ${isOverAllocated ? 'border-red-500 text-red-400' : ''}
                  ${!disabled && isCorrect ? 'border-green-500' : ''}
                  disabled:opacity-50
                `}
              />
            </div>
          );
        })}
        
        {/* Warning for over-allocation */}
        {!disabled && child.requests.some(req => 
          getAllocatedQuantity(req.candyName) > getAvailableQuantity(req.candyName)
        ) && (
          <div className="text-xs text-red-400 flex items-center gap-1 mt-2">
            <span>⚠️</span>
            <span>Not enough candy in inventory!</span>
          </div>
        )}
      </div>
    </div>
  );
}