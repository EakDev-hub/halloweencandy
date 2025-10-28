export interface CandyType {
  name: string;
  quantity: number;
  color: string;
  emoji: string;
}

// New v2.0 interfaces for request-based allocation
export interface CandyRequest {
  candyName: string;
  quantity: number;
}

export interface Child {
  id: string;
  isSpecial: boolean;
  requests: CandyRequest[];
  emoji: string;
}

export interface AllocatedCandy {
  candyName: string;
  quantity: number;
}

export interface ChildAllocation {
  childId: string;
  allocatedCandies: AllocatedCandy[];
}

export interface ChildResult {
  childId: string;
  isCorrect: boolean;
  isPartial: boolean;
  pointsEarned: number;
}

export interface RoundResult {
  roundNumber: number;
  pointsEarned: number;
  childResults: ChildResult[];
}

export interface GameConfig {
  gameSettings: {
    totalRounds: number;
    timeLimitPerRound: number;
    version: string;
  };
  rounds: GameRound[];
}

// Updated GameRound for v2.0
export interface GameRound {
  roundNumber: number;
  initialCandies: CandyType[];
  children: Child[];
  timeLimit: number;
}

/**
 * @deprecated Use ChildAllocation instead (v2.0)
 */
export interface AllocationInput {
  candyName: string;
  perChild: number;
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  score: number;
  rounds: GameRound[];
  playerNickname: string;
  timeRemaining: number;
  isGameOver: boolean;
  currentAllocation: ChildAllocation[];
  roundResults: RoundResult[];
}

export interface GameSession {
  id?: string;
  player_nickname: string;
  total_score: number;
  rounds_completed: number;
  total_rounds: number;
  started_at?: string;
  completed_at?: string;
  session_data?: Record<string, unknown>;
  created_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  player_nickname: string;
  total_score: number;
  rounds_completed: number;
  completed_at: string;
  rank?: number;
}

export const GameStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  ROUND_COMPLETE: 'ROUND_COMPLETE',
  GAME_OVER: 'GAME_OVER'
} as const;

export type GameStatusType = typeof GameStatus[keyof typeof GameStatus];

export interface FeedbackState {
  show: boolean;
  isCorrect: boolean;
  message: string;
}