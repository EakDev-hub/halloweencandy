interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="bg-halloween-black/50 rounded-lg px-6 py-3 border-2 border-halloween-orange/50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <div>
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-2xl font-bold text-halloween-orange">{score}</div>
        </div>
      </div>
    </div>
  );
}