import { createClient } from '@supabase/supabase-js';
import type { GameSession, LeaderboardEntry } from '../types/game.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Database features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Anonymous play - no session persistence
    autoRefreshToken: false,
  },
});

/**
 * Save a completed game session to the database
 */
export async function saveGameSession(
  nickname: string,
  score: number,
  roundsCompleted: number,
  totalRounds: number
): Promise<GameSession | null> {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        player_nickname: nickname,
        total_score: score,
        rounds_completed: roundsCompleted,
        total_rounds: totalRounds,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving game session:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Failed to save game session:', err);
    return null;
  }
}

/**
 * Get top scores from the leaderboard
 */
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('id, player_nickname, total_score, rounds_completed, completed_at')
      .not('completed_at', 'is', null)
      .order('total_score', { ascending: false })
      .order('completed_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    // Add rank to each entry
    return (data || []).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    return [];
  }
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}