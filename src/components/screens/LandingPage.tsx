import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStartGame = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/nickname');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-halloween-gradient">
      <div className={`card max-w-2xl w-full text-center transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-halloween text-halloween-orange mb-4 animate-pulse-slow">
            🎃 Halloween Candy 🎃
          </h1>
          <h2 className="text-3xl md:text-4xl font-creepy text-halloween-lightOrange mb-2">
            Allocation Game
          </h2>
        </div>

        {/* Game Description */}
        <div className="mb-8 space-y-4 text-lg text-gray-200">
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">🏠</span>
            <span>You have a household with candies!</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">👧👦</span>
            <span>Children come to trick-or-treat!</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">🍬</span>
            <span>Divide candies <strong>equally</strong> among all children</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span>If not equal? Give <strong>0</strong> of that candy type!</span>
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">20</div>
            <div className="text-sm text-gray-300">Rounds</div>
          </div>
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">40s</div>
            <div className="text-sm text-gray-300">Per Round</div>
          </div>
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">+10</div>
            <div className="text-sm text-gray-300">Points</div>
          </div>
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-sm text-gray-300">Leaderboard</div>
          </div>
        </div>

        {/* Example */}
        <div className="bg-halloween-purple/30 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-xl font-bold text-halloween-orange mb-3 flex items-center gap-2">
            <span>💡</span>
            Example:
          </h3>
          <div className="space-y-2 text-gray-200">
            <p>• <strong>3 children</strong> are waiting</p>
            <p>• You have: <span className="font-bold">Candy A: 6</span>, <span className="font-bold">Candy B: 5</span>, <span className="font-bold">Candy C: 9</span></p>
            <p className="text-halloween-lightOrange mt-3">✅ Correct answer:</p>
            <p className="ml-4">• Candy A: <strong>2</strong> per child (6 ÷ 3 = 2)</p>
            <p className="ml-4">• Candy B: <strong>0</strong> per child (5 ÷ 3 = not equal!)</p>
            <p className="ml-4">• Candy C: <strong>3</strong> per child (9 ÷ 3 = 3)</p>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="btn-primary text-2xl py-4 px-12 w-full md:w-auto"
        >
          🎮 Start Playing! 🎮
        </button>

        {/* Footer */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>Race against time • Test your math skills • Top the leaderboard!</p>
        </div>
      </div>
    </div>
  );
}