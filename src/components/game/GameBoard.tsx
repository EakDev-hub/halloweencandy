import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  GameRound,
  GameConfig,
  ChildAllocation,
  FeedbackState,
  CandyType
} from '../../types/game.types';
import { loadGameConfig } from '../../utils/configLoader';
import { calculateRoundScore, getRoundFeedback, getRoundPercentage } from '../../utils/scoringEngine';
import { validateInventory, calculateRemainingCandies } from '../../utils/candyAllocation';
import { MESSAGES } from '../../utils/constants';
import CandyInventory from './CandyInventory';
import ChildCard from './ChildCard';
import Timer from './Timer';
import ScoreDisplay from './ScoreDisplay';
import FeedbackModal from './FeedbackModal';

export default function GameBoard() {
  const navigate = useNavigate();
  const [playerNickname] = useState(() => localStorage.getItem('playerNickname') || 'Player');
  
  // V2.0 State
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [allocations, setAllocations] = useState<ChildAllocation[]>([]);
  const [remainingCandies, setRemainingCandies] = useState<CandyType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    isCorrect: false,
    message: ''
  });

  const currentRound = rounds[currentRoundIndex];

  // Load game configuration on mount
  useEffect(() => {
    loadGameConfig()
      .then(config => {
        setGameConfig(config);
        setRounds(config.rounds);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load game config:', error);
        setLoadError(error.message);
        setIsLoading(false);
      });
  }, []);

  // Initialize allocations and inventory for current round
  useEffect(() => {
    if (currentRound) {
      // Initialize empty allocations for all children
      const initialAllocations: ChildAllocation[] = currentRound.children.map(child => ({
        childId: child.id,
        allocatedCandies: []
      }));
      
      setAllocations(initialAllocations);
      setRemainingCandies(currentRound.initialCandies);
    }
  }, [currentRound]);

  // Update remaining candies when allocations change
  useEffect(() => {
    if (currentRound) {
      const remaining = calculateRemainingCandies(currentRound.initialCandies, allocations);
      setRemainingCandies(remaining);
    }
  }, [allocations, currentRound]);

  // Handle allocation change for a specific child
  const handleChildAllocationChange = useCallback((childId: string, childAllocation: ChildAllocation) => {
    setAllocations(prev => {
      const newAllocations = prev.filter(a => a.childId !== childId);
      return [...newAllocations, childAllocation];
    });
  }, []);

  // Submit answer
  const handleSubmit = useCallback((isTimeUp = false) => {
    if (isSubmitting || feedback.show || !currentRound) return;
    
    setIsSubmitting(true);
    
    // Validate inventory
    const validation = validateInventory(currentRound.initialCandies, allocations);
    
    if (!validation.valid) {
      setFeedback({
        show: true,
        isCorrect: false,
        message: `❌ ${validation.errors[0]}`
      });
      setIsSubmitting(false);
      
      setTimeout(() => {
        setFeedback({ show: false, isCorrect: false, message: '' });
      }, 2000);
      return;
    }
    
    // Calculate score for this round
    const roundResult = calculateRoundScore(currentRound.children, allocations);
    roundResult.roundNumber = currentRound.roundNumber;
    
    const percentage = getRoundPercentage(roundResult, currentRound.children);
    const isCorrect = percentage === 100;
    
    const message = isTimeUp 
      ? MESSAGES.TIME_UP 
      : getRoundFeedback(percentage);

    setFeedback({
      show: true,
      isCorrect,
      message
    });

    // Update score
    setScore(prev => prev + roundResult.pointsEarned);

    // Move to next round or end game
    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false, message: '' });
      setIsSubmitting(false);

      if (currentRoundIndex + 1 >= rounds.length) {
        // Game over
        const finalScore = score + roundResult.pointsEarned;
        localStorage.setItem('finalScore', finalScore.toString());
        localStorage.setItem('roundsCompleted', rounds.length.toString());
        navigate('/game-over');
      } else {
        setCurrentRoundIndex(prev => prev + 1);
      }
    }, 2000);
  }, [allocations, currentRound, currentRoundIndex, rounds.length, score, isSubmitting, feedback.show, navigate]);
  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (!isSubmitting && !feedback.show) {
      handleSubmit(true);
    }
  }, [isSubmitting, feedback.show, handleSubmit]);


  // Redirect if no nickname
  useEffect(() => {
    if (!playerNickname) {
      navigate('/nickname');
    }
  }, [playerNickname, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-halloween-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎃</div>
          <p className="text-xl text-halloween-orange">Loading game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError || !gameConfig || !currentRound) {
    return (
      <div className="min-h-screen bg-halloween-gradient flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-halloween-orange mb-4">Error Loading Game</h2>
          <p className="text-gray-300 mb-4">
            {loadError || 'Failed to load game configuration'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-halloween-gradient p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-halloween text-halloween-orange">
              🎃 Round {currentRound.roundNumber}/{rounds.length}
            </h1>
            <ScoreDisplay score={score} />
          </div>
           {/* Player Info */}
          <div className="flex items-center gap-4">
            <p className="text-center text-2xl md:text-3xl font-halloween text-halloween-orange">
              Player: <span className="text-2xl md:text-3xl font-halloween text-halloween-orange">{playerNickname}</span>
            </p>
          </div>
          <Timer
            timeRemaining={currentRound.timeLimit}
            totalTime={currentRound.timeLimit}
            onTimeUp={handleTimeUp}
            isPaused={isSubmitting || feedback.show}
          />
        </div>  

        {/* Candy Inventory */} 
        <CandyInventory 
          initialCandies={currentRound.initialCandies}
          remainingCandies={remainingCandies}
        />

        {/* Children Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-halloween-orange mb-4 flex items-center gap-2">
            <span>👧👦</span>
            {currentRound.children.length} Children waiting for candy!
          </h2>
          <p className="text-sm text-gray-300 mb-4">
            Give each child exactly what they request to earn points!
          </p>
          
          {/* Child Cards - 3 Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRound.children.map(child => {
              const childAllocation = allocations.find(a => a.childId === child.id) || {
                childId: child.id,
                allocatedCandies: []
              };
              
              return (
                <ChildCard
                  key={child.id}
                  child={child}
                  availableCandies={remainingCandies}
                  allocation={childAllocation.allocatedCandies}
                  onChange={(newAllocation) => 
                    handleChildAllocationChange(child.id, {
                      childId: child.id,
                      allocatedCandies: newAllocation
                    })
                  }
                  disabled={isSubmitting || feedback.show}
                />
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting || feedback.show}
          className="btn-primary w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Checking...' : 'Submit Allocations! 🎯'}
        </button>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-300 text-sm space-y-1">
          <p>💡 <strong>Tip:</strong> Give each child exactly what they request!</p>
          <p>👑 Special children earn <strong>2 points per candy</strong></p>
          <p>⚠️ Wrong amounts earn only <strong>0.5 points</strong></p>
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