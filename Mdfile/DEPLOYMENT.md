# 🚀 Deployment Guide - Halloween Candy Game

This guide will help you deploy the Halloween Candy Allocation Game to Vercel with Supabase integration.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ GitHub/GitLab/Bitbucket account
- ✅ Vercel account (free tier works)
- ✅ Supabase account (free tier works)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: halloween-candy-game (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project initialization (~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. Verify success: You should see "Success. No rows returned"

### 1.3 Get API Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (the `anon` `public` key)

## Step 2: Prepare Your Repository

### 2.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Halloween Candy Game"
```

### 2.2 Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/halloween-candy-game.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Method A: Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

3. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   | Name | Value | Environments |
   |------|-------|--------------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production, Preview, Development |

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment
   - Your game will be live at `https://your-project.vercel.app`

### Method B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   # Paste your Supabase URL when prompted
   
   vercel env add VITE_SUPABASE_ANON_KEY
   # Paste your Supabase anon key when prompted
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Enter your domain name
4. Click "Add"

### 4.2 Update DNS Records

Add these DNS records at your domain registrar:

**For root domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.3 SSL Certificate

- ✅ Automatic SSL provisioning (takes ~1 minute)
- ✅ HTTPS forced by default
- ✅ Auto-renewal

## Step 5: Verify Deployment

### 5.1 Test Game Flow

1. Visit your Vercel URL
2. Click "Start Playing"
3. Enter a nickname
4. Play a few rounds
5. Check if score saves
6. Verify leaderboard shows your score

### 5.2 Check Database

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `game_sessions` table
4. Verify your game session appears

## Step 6: Post-Deployment

### 6.1 Enable Analytics (Optional)

1. In Vercel dashboard, go to **Analytics**
2. Enable Vercel Analytics
3. Add analytics script if needed

### 6.2 Monitor Performance

- **Speed Insights**: Check Core Web Vitals
- **Error Tracking**: Monitor runtime errors
- **Usage**: Track player engagement

### 6.3 Set Up Continuous Deployment

✅ Already configured! Every push to `main` branch auto-deploys.

To deploy from other branches:
1. Go to **Settings** → **Git**
2. Configure production and preview branches

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Locally verify build works:
npm install
npm run build
npm run preview
```

**TypeScript errors**
```bash
npm run type-check
```

### Environment Variables Not Working

1. Verify variables are named correctly:
   - Must start with `VITE_`
   - Exact names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```

### Leaderboard Not Showing

1. **Check Supabase Connection**
   - Open browser console
   - Look for Supabase errors
   - Verify API keys are correct

2. **Check RLS Policies**
   ```sql
   -- Run in Supabase SQL Editor
   SELECT * FROM pg_policies WHERE tablename = 'game_sessions';
   ```

3. **Test Database Access**
   - Go to Supabase → Table Editor
   - Manually add a test entry
   - Refresh game leaderboard

### CORS Issues

Supabase should allow all origins by default. If you have issues:

1. Go to Supabase → **Settings** → **API**
2. Check CORS settings
3. Add your Vercel domain if needed

## Performance Optimization

### Enable Caching

Already configured in `vercel.json`:
- Static assets cached
- Edge network distribution

### Optimize Images

If you add images later:
```javascript
import { Image } from 'next/image';
// Or use Vercel Image Optimization
```

### Bundle Size

Check bundle size:
```bash
npm run build
# Look for dist/ folder size
```

Current build should be ~500KB total.

## Monitoring & Maintenance

### Update Dependencies

```bash
npm outdated
npm update
```

### Security Updates

```bash
npm audit
npm audit fix
```

### Database Backup

1. Go to Supabase → **Settings** → **Database**
2. Enable Point-in-Time Recovery (paid plans)
3. Or manually export data periodically

## Cost Estimation

### Free Tier Limits

**Vercel Free:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- ✅ Custom domains
- ✅ SSL included

**Supabase Free:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth
- ✅ 50,000 monthly active users

### Expected Usage

For 1000 players/month:
- Database: ~5MB
- Bandwidth: ~50GB
- **Cost**: $0 (within free tier)

## Next Steps

1. ✅ Share your game URL
2. ✅ Monitor player feedback
3. ✅ Check leaderboard weekly
4. ✅ Update game if needed

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Review browser console for errors
4. Check Vercel deployment logs

## Congratulations! 🎉

Your Halloween Candy Game is now live and accessible worldwide with:
- ✅ HTTPS/SSL encryption
- ✅ Global CDN
- ✅ Database backend
- ✅ Leaderboard system
- ✅ Automatic deployments

**Share your game and have fun!** 🎃👻🍬