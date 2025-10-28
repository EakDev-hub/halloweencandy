import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameRound, AllocationInput, FeedbackState } from '../../types/game.types';
import { generateAllRounds } from '../../utils/gameGenerator';
import { validateAllocation } from '../../utils/candyAllocation';
import { GAME_CONFIG, MESSAGES } from '../../utils/constants';
import CandyDisplay from './CandyDisplay';
import AllocationInputs from './AllocationInputs';
import Timer from './Timer';
import ScoreDisplay from './ScoreDisplay';
import FeedbackModal from './FeedbackModal';

export default function GameBoard() {
  const navigate = useNavigate();
  const [playerNickname] = useState(() => localStorage.getItem('playerNickname') || 'Player');
  const [rounds] = useState<GameRound[]>(() => generateAllRounds(GAME_CONFIG.TOTAL_ROUNDS));
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [allocation, setAllocation] = useState<AllocationInput[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.TIME_PER_ROUND);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    isCorrect: false,
    message: ''
  });

  const currentRound = rounds[currentRoundIndex];

  // Initialize allocation inputs for current round
  useEffect(() => {
    if (currentRound) {
      setAllocation(
        currentRound.candies.map(candy => ({
          candyName: candy.name,
          perChild: 0
        }))
      );
      setTimeRemaining(GAME_CONFIG.TIME_PER_ROUND);
    }
  }, [currentRound]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (!isSubmitting && !feedback.show) {
      handleSubmit(true);
    }
  }, [isSubmitting, feedback.show]);

  // Submit answer
  const handleSubmit = useCallback((isTimeUp = false) => {
    if (isSubmitting || feedback.show) return;
    
    setIsSubmitting(true);
    
    const isCorrect = validateAllocation(
      currentRound.candies,
      currentRound.childrenCount,
      allocation
    );

    const message = isTimeUp 
      ? MESSAGES.TIME_UP 
      : isCorrect
        ? MESSAGES.CORRECT[Math.floor(Math.random() * MESSAGES.CORRECT.length)]
        : MESSAGES.INCORRECT[Math.floor(Math.random() * MESSAGES.INCORRECT.length)];

    setFeedback({
      show: true,
      isCorrect,
      message
    });

    if (isCorrect) {
      setScore(prev => prev + GAME_CONFIG.POINTS_PER_CORRECT);
    }

    // Move to next round or end game
    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setIsSubmitting(false);

      if (currentRoundIndex + 1 >= rounds.length) {
        // Game over
        const finalScore = isCorrect ? score + GAME_CONFIG.POINTS_PER_CORRECT : score;
        localStorage.setItem('finalScore', finalScore.toString());
        localStorage.setItem('roundsCompleted', rounds.length.toString());
        navigate('/game-over');
      } else {
        setCurrentRoundIndex(prev => prev + 1);
      }
    }, 1500);
  }, [allocation, currentRound, currentRoundIndex, rounds.length, score, isSubmitting, feedback.show, navigate]);

  // Redirect if no nickname
  useEffect(() => {
    if (!playerNickname) {
      navigate('/nickname');
    }
  }, [playerNickname, navigate]);

  if (!currentRound) {
    return null;
  }

  return (
    <div className="min-h-screen bg-halloween-gradient p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-halloween text-halloween-orange">
              🎃 Round {currentRound.roundNumber}/{rounds.length}
            </h1>
            <ScoreDisplay score={score} />
          </div>
          <Timer
            timeRemaining={timeRemaining}
            totalTime={GAME_CONFIG.TIME_PER_ROUND}
            onTimeUp={handleTimeUp}
            isPaused={isSubmitting || feedback.show}
            onTick={(time: number) => setTimeRemaining(time)}
          />
        </div>

        {/* Player Info */}
        <div className="card mb-6">
          <p className="text-center text-gray-300">
            Player: <span className="text-halloween-orange font-bold">{playerNickname}</span>
          </p>
        </div>

        {/* Main Game Area */}
        <div className="card mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-halloween-orange mb-4 flex items-center gap-2">
              <span>🏠</span>
              Your Candies:
            </h2>
            <CandyDisplay candies={currentRound.candies} />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-halloween-orange mb-4 flex items-center gap-2">
              <span>👧👦</span>
              {currentRound.childrenCount} Children waiting!
            </h2>
            <div className="flex justify-center gap-2">
              {Array.from({ length: currentRound.childrenCount }).map((_, i) => (
                <div key={i} className="text-5xl animate-bounce-slow" style={{ animationDelay: `${i * 0.2}s` }}>
                  {i % 2 === 0 ? '👧' : '👦'}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-halloween-orange mb-4 flex items-center gap-2">
              <span>⚖️</span>
              How many candies per child?
            </h2>
            <AllocationInputs
              candies={currentRound.candies}
              allocation={allocation}
              onChange={setAllocation}
              disabled={isSubmitting || feedback.show}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting || feedback.show}
          className="btn-primary w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer! 🎯'}
        </button>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>💡 Remember: If candies can't be divided equally, enter <strong>0</strong>!</p>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedback.show && (
        <FeedbackModal
          isCorrect={feedback.isCorrect}
          message={feedback.message}
        />
      )}
    </div>
  );
}