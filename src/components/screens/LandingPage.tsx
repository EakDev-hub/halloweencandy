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
      <div className={`card max-w-3xl w-full text-center transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
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
            <span>Each child has specific candy requests!</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">🍬</span>
            <span>Give each child <strong>exactly</strong> what they want!</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">👑</span>
            <span>Special children earn <strong>2x points!</strong></span>
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">20</div>
            <div className="text-sm text-gray-300">Rounds</div>
          </div>
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">120s</div>
            <div className="text-sm text-gray-300">Per Round</div>
          </div>
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">1-2</div>
            <div className="text-sm text-gray-300">Points/Candy</div>
          </div>
          <div className="bg-halloween-black/30 rounded-lg p-4">
            <div className="text-3xl mb-1">🏆</div>
            <div className="text-sm text-gray-300">Leaderboard</div>
          </div>
        </div>

        {/* Scoring Info */}
        <div className="bg-halloween-purple/30 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-xl font-bold text-halloween-orange mb-3 flex items-center gap-2">
            <span>🎯</span>
            Scoring System:
          </h3>
          <div className="space-y-2 text-gray-200">
            <p>• <strong>Exact match (regular child):</strong> <span className="text-green-400">1 point per candy</span></p>
            <p>• <strong>Exact match (special child 👑):</strong> <span className="text-yellow-400">2 points per candy</span></p>
            <p>• <strong>Wrong type/amount:</strong> <span className="text-orange-400">0.5 points</span></p>
            <p>• <strong>No allocation:</strong> <span className="text-gray-400">0 points</span></p>
          </div>
        </div>

        {/* Example */}
        <div className="bg-halloween-purple/30 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-xl font-bold text-halloween-orange mb-3 flex items-center gap-2">
            <span>💡</span>
            Example:
          </h3>
          <div className="space-y-2 text-gray-200">
            <p>• <strong>Your inventory:</strong> 10🍭 Lollipop, 8🍫 Chocolate, 12🐻 Gummy Bears</p>
            <p className="mt-3"><strong>Children's requests:</strong></p>
            <p className="ml-4">• 👧 Child 1 wants: 2🍭 + 1🍫 → <span className="text-green-400">3 points if correct</span></p>
            <p className="ml-4">• 👦 Child 2 👑 (special) wants: 3🐻 + 1🍭 → <span className="text-yellow-400">8 points if correct!</span></p>
            <p className="ml-4">• 👧 Child 3 wants: 2🍫 + 2🐻 → <span className="text-green-400">4 points if correct</span></p>
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
          <p>Manage your candy wisely • Earn bonus points • Top the leaderboard!</p>
        </div>
      </div>
    </div>
  );
}