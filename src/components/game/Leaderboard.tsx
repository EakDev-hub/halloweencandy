import { useState, useEffect } from 'react';
import { getLeaderboard, isSupabaseConfigured } from '../../lib/supabaseClient';
import type { LeaderboardEntry } from '../../types/game.types';

interface LeaderboardProps {
  currentScore?: number;
}

export default function Leaderboard({ currentScore }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const data = await getLeaderboard(10);
      
      if (data.length > 0) {
        setEntries(data);
      } else {
        setError(true);
      }
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className="card text-center">
        <div className="text-4xl mb-2">🏆</div>
        <h2 className="text-2xl font-bold text-halloween-orange mb-2">Leaderboard</h2>
        <p className="text-gray-400">
          Configure Supabase to enable the leaderboard feature!
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="text-4xl mb-2 animate-bounce">🏆</div>
        <p className="text-gray-300">Loading leaderboard...</p>
      </div>
    );
  }

  if (error || entries.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-4xl mb-2">🏆</div>
        <h2 className="text-2xl font-bold text-halloween-orange mb-2">Leaderboard</h2>
        <p className="text-gray-400">Be the first to set a high score!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-3xl font-bold text-halloween-orange mb-6 text-center flex items-center justify-center gap-2">
        <span>🏆</span>
        Top Players
        <span>🏆</span>
      </h2>

      <div className="space-y-2">
        {entries.map((entry, index) => {
          const isCurrentScore = currentScore !== undefined && entry.total_score === currentScore;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👻';

          return (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                isCurrentScore
                  ? 'bg-halloween-orange/30 border-2 border-halloween-orange'
                  : 'bg-halloween-black/30 hover:bg-halloween-black/50'
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-3xl">{medal}</span>
                <div className="flex-1">
                  <p className="font-bold text-lg text-white">
                    {entry.player_nickname}              
                  </p>
                  <p className="text-sm text-gray-400">
                    {entry.rounds_completed} rounds completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-halloween-orange">
                  {entry.total_score}
                </p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          );
        })}
      </div>

      {entries.length >= 10 && (
        <p className="text-center text-gray-400 text-sm mt-4">
          Showing top 10 players
        </p>
      )}
    </div>
  );
}