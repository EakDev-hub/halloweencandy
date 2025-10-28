import type { CandyType } from '../../types/game.types';

interface CandyDisplayProps {
  candies: CandyType[];
}

export default function CandyDisplay({ candies }: CandyDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {candies.map((candy, index) => (
        <div
          key={candy.name}
          className="bg-halloween-black/30 rounded-lg p-4 transform transition-all hover:scale-105"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{candy.emoji}</span>
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: candy.color }}
            />
          </div>
          <h3 className="font-bold text-lg text-halloween-orange mb-1">
            {candy.name}
          </h3>
          <p className="text-2xl font-bold text-white">
            Quantity: {candy.quantity}
          </p>
        </div>
      ))}
    </div>
  );
}