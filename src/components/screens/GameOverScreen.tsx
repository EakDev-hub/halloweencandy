import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveGameSession, isSupabaseConfigured } from '../../lib/supabaseClient';
import { GAME_CONFIG } from '../../utils/constants';
import HalloweenDecorations from '../decorations/HalloweenDecorations';

export default function GameOverScreen() {
  const navigate = useNavigate();
  const [nickname] = useState(() => localStorage.getItem('playerNickname') || 'Player');
  const [finalScore] = useState(() => parseInt(localStorage.getItem('finalScore') || '0'));
  const [roundsCompleted] = useState(() => parseInt(localStorage.getItem('roundsCompleted') || '0'));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasSaved = useRef(false);

  const maxScore = GAME_CONFIG.TOTAL_ROUNDS * GAME_CONFIG.POINTS_PER_CORRECT;
  const percentage = Math.round((finalScore / maxScore) * 100);

  // Save game session to database
  useEffect(() => {
    // Prevent duplicate saves
    if (hasSaved.current) {
      return;
    }

    const saveSession = async () => {
      if (!isSupabaseConfigured()) {
        // If no Supabase, skip saving and proceed to countdown
        setSaveSuccess(true);
        return;
      }

      hasSaved.current = true;
      setIsSaving(true);
      
      const result = await saveGameSession(
        nickname,
        finalScore,
        roundsCompleted,
        GAME_CONFIG.TOTAL_ROUNDS
      );

      setIsSaving(false);
      
      if (result) {
        setSaveSuccess(true);
      } else {
        setSaveError(true);
        hasSaved.current = false; // Allow retry on error
      }
    };

    saveSession();
  }, [nickname, finalScore, roundsCompleted]);

  // Countdown and redirect after save completes
  useEffect(() => {
    if (!saveSuccess) return;

    // Start countdown after successful save
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsRedirecting(true);
          // Redirect to leaderboard
          setTimeout(() => {
            navigate('/leaderboard');
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [saveSuccess, navigate]);

  return (
    <div className="min-h-screen bg-halloween-gradient p-4 md:p-8 relative">
      <HalloweenDecorations />
      
      <div className="max-w-4xl mx-auto relative z-10">
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

        {/* Saving Status */}
        {isSaving && (
          <div className="card text-center animate-pulse">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-300">Saving your score...</p>
          </div>
        )}

        {/* Save Error */}
        {saveError && (
          <div className="card text-center bg-red-900/20 border-red-500">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-red-300 mb-2">Could not save your score. Check your connection.</p>
            <p className="text-sm text-gray-400">You'll be redirected to the leaderboard anyway...</p>
          </div>
        )}

        {/* Countdown and Redirect */}
        {saveSuccess && !isRedirecting && (
          <div className="card text-center bg-green-900/20 border-green-500">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-300 mb-2">Score saved successfully!</p>
            <div className="text-6xl font-bold text-halloween-orange mb-2 animate-pulse">
              {countdown}
            </div>
            <p className="text-gray-300">Redirecting to leaderboard...</p>
          </div>
        )}

        {/* Redirecting Message */}
        {isRedirecting && (
          <div className="card text-center">
            <div className="text-4xl mb-2 animate-spin">🎃</div>
            <p className="text-gray-300">Loading leaderboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}