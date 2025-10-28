-- Halloween Candy Game Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_nickname VARCHAR(50) NOT NULL,
  total_score INTEGER DEFAULT 0 CHECK (total_score >= 0),
  rounds_completed INTEGER DEFAULT 0 CHECK (rounds_completed >= 0),
  total_rounds INTEGER DEFAULT 20 CHECK (total_rounds > 0),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  session_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_rounds CHECK (rounds_completed <= total_rounds)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_score 
  ON game_sessions(total_score DESC);

CREATE INDEX IF NOT EXISTS idx_game_sessions_completed 
  ON game_sessions(completed_at DESC) 
  WHERE completed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_game_sessions_nickname 
  ON game_sessions(player_nickname);

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
-- Allow anyone to insert new game sessions
CREATE POLICY "Allow anonymous insert" 
  ON game_sessions
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow anyone to read game sessions (for leaderboard)
CREATE POLICY "Allow public read" 
  ON game_sessions
  FOR SELECT 
  TO anon 
  USING (true);

-- Optional: Add policy for authenticated users if you want to add auth later
CREATE POLICY "Allow authenticated insert" 
  ON game_sessions
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read" 
  ON game_sessions
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create a view for the leaderboard (top 100 scores)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  id,
  player_nickname,
  total_score,
  rounds_completed,
  completed_at,
  ROW_NUMBER() OVER (ORDER BY total_score DESC, completed_at ASC) as rank
FROM game_sessions
WHERE completed_at IS NOT NULL
ORDER BY total_score DESC, completed_at ASC
LIMIT 100;

-- Grant access to the view
GRANT SELECT ON leaderboard TO anon;
GRANT SELECT ON leaderboard TO authenticated;

-- Optional: Create a function to get player rank
CREATE OR REPLACE FUNCTION get_player_rank(session_id UUID)
RETURNS INTEGER AS $$
  SELECT rank::INTEGER
  FROM leaderboard
  WHERE id = session_id;
$$ LANGUAGE SQL STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_player_rank(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_player_rank(UUID) TO authenticated;

-- Add helpful comments
COMMENT ON TABLE game_sessions IS 'Stores all game sessions for the Halloween Candy Allocation Game';
COMMENT ON COLUMN game_sessions.player_nickname IS 'Player chosen nickname (max 50 characters)';
COMMENT ON COLUMN game_sessions.total_score IS 'Final score (10 points per correct round)';
COMMENT ON COLUMN game_sessions.rounds_completed IS 'Number of rounds completed';
COMMENT ON COLUMN game_sessions.completed_at IS 'When the game was finished (NULL for incomplete games)';
COMMENT ON VIEW leaderboard IS 'Top 100 completed games ordered by score';