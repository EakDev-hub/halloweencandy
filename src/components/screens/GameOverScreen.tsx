import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveGameSession, isSupabaseConfigured } from '../../lib/supabaseClient';
import Leaderboard from '../game/Leaderboard';
import { GAME_CONFIG } from '../../utils/constants';

export default function GameOverScreen() {
  const navigate = useNavigate();
  const [nickname] = useState(() => localStorage.getItem('playerNickname') || 'Player');
  const [finalScore] = useState(() => parseInt(localStorage.getItem('finalScore') || '0'));
  const [roundsCompleted] = useState(() => parseInt(localStorage.getItem('roundsCompleted') || '0'));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const maxScore = GAME_CONFIG.TOTAL_ROUNDS * GAME_CONFIG.POINTS_PER_CORRECT;
  const percentage = Math.round((finalScore / maxScore) * 100);

  useEffect(() => {
    // Save game session to database
    const saveSession = async () => {
      if (!isSupabaseConfigured()) {
        setShowLeaderboard(true);
        return;
      }

      setIsSaving(true);
      const result = await saveGameSession(
        nickname,
        finalScore,
        roundsCompleted,
        GAME_CONFIG.TOTAL_ROUNDS
      );

      if (result) {
        setShowLeaderboard(true);
      } else {
        setSaveError(true);
      }
      setIsSaving(false);
    };

    saveSession();
  }, [nickname, finalScore, roundsCompleted]);

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
    <div className="min-h-screen bg-halloween-gradient p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-halloween text-halloween-orange mb-4 animate-pulse-slow">
            🎃 Game Over! 🎃
          </h1>
          <p className="text-2xl text-gray-200 mb-2">
            Great job, <span className="text-halloween-orange font-bold">{nickname}</span>!
          </p>
        </div>

        {/* Score Card */}
        <div className="card mb-6">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : percentage >= 40 ? '🥉' : '🎃'}
            </div>
            <h2 className="text-4xl font-bold text-halloween-orange mb-2">
              {finalScore} Points
            </h2>
            <p className="text-xl text-gray-300">
              {roundsCompleted} / {GAME_CONFIG.TOTAL_ROUNDS} Rounds Completed
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-halloween-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-halloween-orange">{percentage}%</div>
              <div className="text-sm text-gray-300">Accuracy</div>
            </div>
            <div className="bg-halloween-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-halloween-orange">
                {Math.floor(finalScore / GAME_CONFIG.POINTS_PER_CORRECT)}
              </div>
              <div className="text-sm text-gray-300">Correct</div>
            </div>
            <div className="bg-halloween-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-halloween-orange">
                {roundsCompleted - Math.floor(finalScore / GAME_CONFIG.POINTS_PER_CORRECT)}
              </div>
              <div className="text-sm text-gray-300">Wrong</div>
            </div>
            <div className="bg-halloween-black/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-halloween-orange">{maxScore}</div>
              <div className="text-sm text-gray-300">Max Score</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="mt-6 p-4 bg-halloween-purple/30 rounded-lg text-center">
            <p className="text-lg text-gray-200">
              {percentage >= 80 && '🌟 Outstanding! You\'re a candy master!'}
              {percentage >= 60 && percentage < 80 && '👏 Great job! Keep practicing!'}
              {percentage >= 40 && percentage < 60 && '👍 Good effort! You\'re getting better!'}
              {percentage < 40 && '💪 Keep trying! Practice makes perfect!'}
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        {isSaving && (
          <div className="card text-center">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-300">Saving your score...</p>
          </div>
        )}

        {saveError && (
          <div className="card text-center bg-red-900/20 border-red-500">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-red-300">Could not save your score. Check your connection.</p>
          </div>
        )}

        {showLeaderboard && <Leaderboard currentScore={finalScore} />}

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