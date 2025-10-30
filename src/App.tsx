import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/screens/LandingPage';
import NicknameEntry from './components/screens/NicknameEntry';
import GameBoard from './components/game/GameBoard';
import GameOverScreen from './components/screens/GameOverScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nickname" element={<NicknameEntry />} />
        <Route path="/game" element={<GameBoard />} />
        <Route path="/game-over" element={<GameOverScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
