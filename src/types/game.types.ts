export interface CandyType {
  name: string;
  quantity: number;
  color: string;
  emoji: string;
}

export interface GameRound {
  roundNumber: number;
  candies: CandyType[];
  childrenCount: number;
  timeLimit: number;
}

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
  currentAllocation: AllocationInput[];
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