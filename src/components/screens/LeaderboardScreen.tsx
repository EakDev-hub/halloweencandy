import { useNavigate } from 'react-router-dom';
import Leaderboard from '../game/Leaderboard';
import HalloweenDecorations from '../decorations/HalloweenDecorations';

export default function LeaderboardScreen() {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    localStorage.removeItem('finalScore');
    localStorage.removeItem('roundsCompleted');
    navigate('/nickname');
  };

  const handleBackHome = () => {
    localStorage.removeItem('finalScore');
    localStorage.removeItem('roundsCompleted');
    localStorage.removeItem('playerNickname');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-halloween-gradient p-4 md:p-8 relative">
      <HalloweenDecorations />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="card text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-halloween text-halloween-orange mb-2 animate-pulse-slow">
            🏆 Leaderboard 🏆
          </h1>
          <p className="text-lg text-gray-300">
            See how you rank against other players!
          </p>
        </div>

        {/* Leaderboard Component */}
        <Leaderboard />

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button onClick={handlePlayAgain} className="btn-primary flex-1 text-xl py-4">
            🎮 Play Again
          </button>
          <button onClick={handleBackHome} className="btn-secondary flex-1 text-xl py-4">
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}