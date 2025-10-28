import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NicknameEntry() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate nickname
    const trimmedNickname = nickname.trim();
    
    if (!trimmedNickname) {
      setError('Please enter a nickname!');
      return;
    }
    
    if (trimmedNickname.length < 2) {
      setError('Nickname must be at least 2 characters!');
      return;
    }
    
    if (trimmedNickname.length > 50) {
      setError('Nickname must be less than 50 characters!');
      return;
    }
    
    // Store nickname and navigate to game
    setIsSubmitting(true);
    localStorage.setItem('playerNickname', trimmedNickname);
    
    setTimeout(() => {
      navigate('/game');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-halloween-gradient">
      <div className={`card max-w-md w-full transform transition-all duration-300 ${isSubmitting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-slow">👻</div>
          <h2 className="text-3xl font-halloween text-halloween-orange mb-2">
            Enter Your Name
          </h2>
          <p className="text-gray-300">
            Choose a spooky nickname for the leaderboard!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="Enter your nickname..."
              className="input-field"
              maxLength={50}
              autoFocus
              autoComplete="off"
            />
            {error && (
              <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            )}
            <p className="mt-2 text-gray-400 text-xs">
              {nickname.length}/50 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={!nickname.trim() || isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Game! 🎮
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 p-4 bg-halloween-purple/20 rounded-lg">
          <h3 className="text-sm font-bold text-halloween-orange mb-2">💡 Tips:</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Choose a memorable name for the leaderboard</li>
            <li>• You can play multiple times with different names</li>
            <li>• No account needed - just pick a name and play!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}