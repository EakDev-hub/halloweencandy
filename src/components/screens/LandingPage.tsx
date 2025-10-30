import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HalloweenDecorations from '../decorations/HalloweenDecorations';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-halloween-gradient relative">
      {/* Halloween Decorations with Animations */}
      <HalloweenDecorations />
      
      <div className={`card max-w-3xl w-full text-center transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'} relative z-20`}>
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
            <span>You have a household with limited candies!</span>
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
          <p className="flex items-center justify-center gap-2">
            <span className="text-2xl">🚫</span>
            <span><strong>Avoid</strong> giving children candy they hate!</span>
          </p>
        </div>

        {/* Scoring Info */}
        <div className="bg-halloween-purple/30 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-xl font-bold text-halloween-orange mb-3 flex items-center gap-2">
            <span>🎯</span>
            Scoring System:
          </h3>
          <div className="space-y-2 text-gray-200">
            <p>• <strong>Perfect match (regular child):</strong> <span className="text-green-400">1 point per candy</span></p>
            <p>• <strong>Perfect match (special child 👑):</strong> <span className="text-yellow-400">2 points per candy</span></p>
            <p>• <strong>Wrong type/amount:</strong> <span className="text-orange-400">0.5 points per candy</span></p>
            <p>• <strong>Hate candy penalty (🚫):</strong> <span className="text-red-400">-1 point per piece</span></p>
            <p>• <strong>No allocation:</strong> <span className="text-gray-400">0 points</span></p>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-halloween-black/30 rounded-lg p-4 mb-6">
          <p className="text-gray-300">
            <span className="text-halloween-orange font-bold">15 Rounds</span> • 
            <span className="text-halloween-orange font-bold"> Varied Time Limits</span> • 
            <span className="text-halloween-orange font-bold"> Strategic Allocation</span>
          </p>
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