# 🎃 Halloween Candy Allocation Game

A fun Halloween-themed web game where players must correctly allocate candies equally among children. Built with React, TypeScript, Tailwind CSS, and Supabase.

![Halloween Candy Game](https://img.shields.io/badge/Game-Halloween%20Candy-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)

## 🎮 Game Rules

- You have a household with various types of candies
- Children come to trick-or-treat
- Allocate each candy type equally among all children
- **Important**: If a candy type cannot be divided equally, give **0** to each child
- Each correct allocation earns **10 points**
- Complete **20 rounds** with a **40-second** timer per round

### Example

**Scenario**: 3 children waiting
- Candy A: 6 pieces → **2 per child** (6 ÷ 3 = 2) ✅
- Candy B: 5 pieces → **0 per child** (5 ÷ 3 = not equal!) ✅
- Candy C: 9 pieces → **3 per child** (9 ÷ 3 = 3) ✅

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: anime.js
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router v6
- **Deployment**: Vercel
- **SSL/HTTPS**: Automatic (via Vercel)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for leaderboard features)
- Vercel account (for deployment)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd halloweencandy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (Optional but recommended)
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Run the SQL schema in Supabase SQL Editor:
   ```bash
   # Copy contents from supabase-schema.sql
   ```
   
   c. Get your Supabase credentials from Project Settings → API

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173)

## 🏗️ Build

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🌐 Deployment to Vercel

### Method 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add environment variables in Vercel**
   - Go to your project settings on Vercel
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Redeploy if needed

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Configure environment variables in project settings
4. Deploy!

### SSL/HTTPS

- ✅ Automatic SSL certificate from Vercel
- ✅ HTTPS enforced by default
- ✅ Custom domain support with auto SSL

## 📁 Project Structure

```
src/
├── components/
│   ├── game/
│   │   ├── AllocationInputs.tsx    # Candy allocation input fields
│   │   ├── CandyDisplay.tsx        # Visual candy representation
│   │   ├── FeedbackModal.tsx       # Correct/incorrect feedback
│   │   ├── GameBoard.tsx           # Main game logic
│   │   ├── Leaderboard.tsx         # Global leaderboard
│   │   ├── ScoreDisplay.tsx        # Current score display
│   │   └── Timer.tsx               # Countdown timer
│   └── screens/
│       ├── GameOverScreen.tsx      # Final results screen
│       ├── LandingPage.tsx         # Welcome screen
│       └── NicknameEntry.tsx       # Player nickname input
├── lib/
│   └── supabaseClient.ts           # Supabase configuration
├── types/
│   └── game.types.ts               # TypeScript interfaces
├── utils/
│   ├── candyAllocation.ts          # Validation logic
│   ├── constants.ts                # Game constants
│   └── gameGenerator.ts            # Round generation
├── App.tsx                         # Root component with routing
├── index.css                       # Global styles + Tailwind
└── main.tsx                        # Entry point
```

## 🎨 Features

- ✅ **Anonymous Play**: No login required, just pick a nickname
- ✅ **20 Challenging Rounds**: Progressive difficulty
- ✅ **Real-time Timer**: 40 seconds per round
- ✅ **Instant Feedback**: Know if you're correct immediately
- ✅ **Global Leaderboard**: Compete with other players
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Halloween Theme**: Spooky colors and emojis
- ✅ **Smooth Animations**: Enhanced with anime.js
- ✅ **Score Tracking**: 10 points per correct answer

## 🎯 Game Flow

```
Landing Page → Nickname Entry → Game (20 Rounds) → Game Over → Leaderboard
```

## 🔧 Configuration

### Game Settings

Edit `src/utils/constants.ts`:

```typescript
export const GAME_CONFIG = {
  TOTAL_ROUNDS: 20,        // Number of rounds
  TIME_PER_ROUND: 40,      // Seconds per round
  POINTS_PER_CORRECT: 10,  // Points for correct answer
  MIN_CHILDREN: 2,         // Minimum children
  MAX_CHILDREN: 5,         // Maximum children
  MIN_CANDIES: 1,          // Minimum candy quantity
  MAX_CANDIES: 20,         // Maximum candy quantity
};
```

### Tailwind Theme

Edit `tailwind.config.js` for custom Halloween colors:

```javascript
halloween: {
  orange: '#FF6B1A',
  purple: '#6B2D5C',
  black: '#1A1A1A',
  // ... more colors
}
```

## 📊 Database Schema

The game uses Supabase PostgreSQL with the following table:

**game_sessions**
- `id`: UUID (primary key)
- `player_nickname`: VARCHAR(50)
- `total_score`: INTEGER
- `rounds_completed`: INTEGER
- `total_rounds`: INTEGER
- `completed_at`: TIMESTAMP
- Row Level Security (RLS) enabled for anonymous access

See `supabase-schema.sql` for complete schema.

## 🐛 Troubleshooting

### Leaderboard not working
- Check Supabase credentials in `.env`
- Verify RLS policies are enabled
- Check browser console for errors

### Build errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript errors
```bash
npm run type-check
```

## 📝 Environment Variables

Required for production:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or your own games!

## 🎃 Happy Halloween! 🎃

Enjoy the game and may you allocate all candies correctly!

---

**Built with** ❤️ **and** 🎃 **by your development team**
