import type { GameRound, CandyType } from '../types/game.types';
import { GAME_CONFIG, CANDY_TEMPLATES } from './constants';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a random number between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a single game round with random candy types, quantities, and children count
 */
export function generateRound(roundNumber: number): GameRound {
  // Random number of candy types (2-3)
  const numCandyTypes = randomInt(
    GAME_CONFIG.MIN_CANDY_TYPES,
    GAME_CONFIG.MAX_CANDY_TYPES
  );

  // Random number of children (2-5)
  const childrenCount = randomInt(
    GAME_CONFIG.MIN_CHILDREN,
    GAME_CONFIG.MAX_CHILDREN
  );

  // Select random candy types
  const selectedTemplates = shuffleArray(CANDY_TEMPLATES).slice(0, numCandyTypes);

  // Generate candies with random quantities
  const candies: CandyType[] = selectedTemplates.map(template => ({
    ...template,
    quantity: randomInt(GAME_CONFIG.MIN_CANDIES, GAME_CONFIG.MAX_CANDIES)
  }));

  return {
    roundNumber,
    candies,
    childrenCount,
    timeLimit: GAME_CONFIG.TIME_PER_ROUND
  };
}

/**
 * Generates all rounds for a complete game session
 */
export function generateAllRounds(totalRounds: number = GAME_CONFIG.TOTAL_ROUNDS): GameRound[] {
  const rounds: GameRound[] = [];
  
  for (let i = 1; i <= totalRounds; i++) {
    rounds.push(generateRound(i));
  }
  
  return rounds;
}

/**
 * Gets difficulty label based on round number
 */
export function getDifficultyLabel(roundNumber: number): string {
  if (roundNumber <= 5) return 'Easy';
  if (roundNumber <= 10) return 'Medium';
  if (roundNumber <= 15) return 'Hard';
  return 'Expert';
}