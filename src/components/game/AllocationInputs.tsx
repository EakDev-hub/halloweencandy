import type { CandyType, AllocationInput } from '../../types/game.types';

interface AllocationInputsProps {
  candies: CandyType[];
  allocation: AllocationInput[];
  onChange: (allocation: AllocationInput[]) => void;
  disabled?: boolean;
}

export default function AllocationInputs({
  candies,
  allocation,
  onChange,
  disabled = false
}: AllocationInputsProps) {
  const handleChange = (candyName: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newAllocation = allocation.map(a =>
      a.candyName === candyName ? { ...a, perChild: numValue } : a
    );
    onChange(newAllocation);
  };

  return (
    <div className="space-y-4">
      {candies.map((candy) => {
        const currentAllocation = allocation.find(a => a.candyName === candy.name);
        
        return (
          <div
            key={candy.name}
            className="bg-halloween-black/30 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{candy.emoji}</span>
              <div>
                <p className="font-bold text-halloween-orange">{candy.name}</p>
                <p className="text-sm text-gray-300">Total: {candy.quantity}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor={`candy-${candy.name}`} className="text-sm text-gray-300 whitespace-nowrap">
                Per child:
              </label>
              <input
                id={`candy-${candy.name}`}
                type="number"
                min="0"
                max={candy.quantity}
                value={currentAllocation?.perChild ?? 0}
                onChange={(e) => handleChange(candy.name, e.target.value)}
                disabled={disabled}
                className="input-field w-24 text-center text-xl font-bold disabled:opacity-50"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}