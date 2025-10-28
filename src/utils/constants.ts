import type { CandyType } from '../types/game.types';

/**
 * @deprecated Config now loaded from game-config.json (v2.0)
 * Kept for backward compatibility
 */
export const GAME_CONFIG = {
  TOTAL_ROUNDS: 20,
  TIME_PER_ROUND: 40, // seconds
  POINTS_PER_CORRECT: 10,
  MIN_CHILDREN: 2,
  MAX_CHILDREN: 5,
  MIN_CANDIES: 1,
  MAX_CANDIES: 20,
  MIN_CANDY_TYPES: 2,
  MAX_CANDY_TYPES: 3,
};

/**
 * V2.0 Scoring constants for request-based allocation
 */
export const SCORING = {
  REGULAR_CHILD_PER_CANDY: 1,
  SPECIAL_CHILD_PER_CANDY: 2,
  INCORRECT_ALLOCATION: 0.5,
  NO_ALLOCATION: 0,
};

/**
 * Visual indicator for special children
 */
export const SPECIAL_CHILD_INDICATOR = '👑';

export const CANDY_TEMPLATES: Omit<CandyType, 'quantity'>[] = [
  {
    name: 'Lollipop',
    color: '#FF1493',
    emoji: '🍭'
  },
  {
    name: 'Chocolate',
    color: '#8B4513',
    emoji: '🍫'
  },
  {
    name: 'Gummy Bears',
    color: '#FF6347',
    emoji: '🐻'
  },
  {
    name: 'Candy Corn',
    color: '#FFA500',
    emoji: '🌽'
  },
  {
    name: 'Lemon Drop',
    color: '#FFFF00',
    emoji: '🍋'
  },
  {
    name: 'Mint',
    color: '#98FF98',
    emoji: '🍬'
  }
];

export const ANIMATION_DURATIONS = {
  CANDY_FLOAT: 800,
  FEEDBACK: 1500,
  SCORE_UPDATE: 600,
  ROUND_TRANSITION: 1000,
};

export const MESSAGES = {
  CORRECT: [
    '🎃 Perfect allocation!',
    '👻 Spooktacular!',
    '🦇 Amazing work!',
    '🕷️ You nailed it!',
    '💀 Brilliant!',
  ],
  INCORRECT: [
    '👻 Oops! Try again!',
    '🎃 Not quite right!',
    '🦇 Keep trying!',
    '💀 Close, but not equal!',
  ],
  TIME_UP: '⏰ Time\'s up!',
  GAME_OVER: '🎃 Game Over!',
};