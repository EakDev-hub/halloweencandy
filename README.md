# 🎃 Halloween Candy Allocation Game

A fun Halloween-themed web game where players must allocate candies based on children's specific requests. Built with React, TypeScript, Tailwind CSS, and Supabase.

![Halloween Candy Game](https://img.shields.io/badge/Game-Halloween%20Candy-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)

## 🎮 Game Rules

### Core Mechanics
- Each round, children come trick-or-treating with **specific candy requests**
- Each child wants certain types and amounts of candies
- Some children are **special (👑)** and earn **2x points**
- Each child has a **hated candy (🚫)** that causes **penalties**
- Complete **15 rounds** with a countdown timer per round
- Manage your limited candy inventory wisely!

### Scoring System

- **Perfect Match (Regular Child)**: `1 point per candy` ✅
- **Perfect Match (Special Child 👑)**: `2 points per candy` 👑
- **Incorrect/Partial Allocation**: `0.5 points per candy` ⚠️
- **Hated Candy Penalty**: `-1 point per piece` 🚫
- **No Allocation**: `0 points` ❌

### Example Round

**Your Inventory:**
- 🍭 Lollipop: 5 pieces
- 🍫 Chocolate: 6 pieces
- 🐻 Gummy Bears: 4 pieces

**Child 1 (👑 Special):**
- Wants: 2 Lollipops, 3 Chocolates
- Hates: Gummy Bears 🚫
- Perfect allocation = (2 + 3) × 2 = **10 points**

**Child 2 (Regular):**
- Wants: 3 Lollipops
- Hates: Chocolate 🚫
- Perfect allocation = 3 × 1 = **3 points**

**Total possible**: 13 points

⚠️ **Warning**: Giving hated candy will reduce your score!

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Custom CSS animations
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
│   ├── decorations/
│   │   ├── GameDecorations.tsx     # In-game decorations
│   │   └── HalloweenDecorations.tsx # Landing page decorations
│   ├── game/
│   │   ├── CandyDisplay.tsx        # Visual candy representation
│   │   ├── CandyInventory.tsx      # Remaining candy display
│   │   ├── ChildCard.tsx           # Individual child card with requests
│   │   ├── FeedbackModal.tsx       # Round feedback with breakdown
│   │   ├── GameBoard.tsx           # Main game logic
│   │   ├── Leaderboard.tsx         # Leaderboard component
│   │   ├── ScoreBreakdownDetails.tsx # Detailed score calculation
│   │   ├── ScoreDisplay.tsx        # Current score display
│   │   └── Timer.tsx               # Countdown timer
│   └── screens/
│       ├── GameOverScreen.tsx      # Final results (POST score)
│       ├── LandingPage.tsx         # Welcome screen
│       ├── LeaderboardScreen.tsx   # Leaderboard page (GET data)
│       └── NicknameEntry.tsx       # Player nickname input
├── lib/
│   └── supabaseClient.ts           # Supabase configuration
├── types/
│   └── game.types.ts               # TypeScript interfaces
├── utils/
│   ├── candyAllocation.ts          # Inventory validation
│   ├── configLoader.ts             # Game config loader
│   ├── constants.ts                # Game constants
│   ├── gameGenerator.ts            # Round generation (deprecated)
│   └── scoringEngine.ts            # Score calculation logic
├── App.tsx                         # Root component with routing
├── index.css                       # Global styles + Tailwind
└── main.tsx                        # Entry point
```

## 🎨 Features

- ✅ **Anonymous Play**: No login required, just pick a nickname
- ✅ **15 Challenging Rounds**: Progressive difficulty with varied requests
- ✅ **Real-time Timer**: Dynamic timer per round (varies by difficulty)
- ✅ **Request-Based Allocation**: Each child has unique candy preferences
- ✅ **Special Children**: Some children earn 2x points (👑)
- ✅ **Hate Candy Penalties**: Avoid giving children candy they hate (🚫)
- ✅ **Detailed Score Breakdown**: See exactly how points were calculated
- ✅ **Global Leaderboard**: Compete with other players worldwide
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Halloween Theme**: Spooky colors, emojis, and animations
- ✅ **Score Tracking**: Dynamic scoring based on performance

## 🎯 Game Flow

```
Landing Page → Nickname Entry → Game (15 Rounds) → Game Over (POST score) 
→ 3s Countdown → Leaderboard (GET rankings)
```

### Page Details

1. **Landing Page**: Game introduction and rules
2. **Nickname Entry**: Enter your player name
3. **Game Board**: 15 rounds of candy allocation challenges
4. **Game Over Screen**: 
   - Displays final score and stats
   - POSTs score to database
   - Shows 3-second countdown
   - Auto-redirects to leaderboard
5. **Leaderboard Screen**: 
   - Displays top 10 players
   - Shows your ranking
   - Options to play again or return home

## 🔧 Configuration

### Game Settings

The game uses a JSON configuration file at `public/game-config.json`:

```json
{
  "gameSettings": {
    "totalRounds": 15,
    "timeLimitPerRound": 40,
    "version": "2.1.0"
  },
  "rounds": [
    {
      "roundNumber": 1,
      "timeLimit": 50,
      "initialCandies": [...],
      "children": [...]
    }
  ]
}
```

Each round defines:
- Initial candy inventory
- Children with their requests
- Each child's hated candy
- Whether a child is special (2x points)

### Tailwind Theme

Edit `tailwind.config.js` for custom Halloween colors:

```javascript
halloween: {
  orange: '#FF6B1A',
  purple: '#6B2D5C',
  black: '#1A1A1A',
  lightOrange: '#FFA500',
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
- `session_data`: JSONB (optional game state)
- Row Level Security (RLS) enabled for anonymous access

See `supabase-schema.sql` for complete schema.

## 🎮 Scoring Engine

The game uses a sophisticated scoring system:

```typescript
// Regular child: 1 point per correct candy
// Special child: 2 points per correct candy
// Incorrect allocation: 0.5 points per candy
// Hated candy penalty: -1 point per piece
// Minimum score per child: 0 (no negative scores per child)
```

### Score Calculation Example

Child requests 3 Lollipops (regular child):
- Give 3 Lollipops: `3 × 1 = 3 points` ✅
- Give 2 Lollipops: `2 × 1 = 2 points` (partial)
- Give 3 Chocolates: `3 × 0.5 = 1.5 points` (wrong type)
- Give 1 hated candy: `-1 point` penalty
- Give nothing: `0 points`

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

### Game config not loading
- Ensure `public/game-config.json` exists
- Check JSON syntax is valid
- Verify all required fields are present

## 📝 Environment Variables

Required for production:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Game will work without Supabase but leaderboard will be disabled.

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

**Built with** ❤️ **and** 🎃 **for spooky fun!**
