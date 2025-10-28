# 🎃 Implementation Checklist - Halloween Candy Game v2.0

## Overview

This checklist tracks the implementation of the pivot from "equal division" to "request-based allocation" gameplay.

## 📋 Pre-Implementation Review

- [x] Architecture designed ([`PIVOT_ARCHITECTURE.md`](PIVOT_ARCHITECTURE.md:1))
- [x] Config format documented ([`GAME_CONFIG_GUIDE.md`](GAME_CONFIG_GUIDE.md:1))
- [x] Migration plan created ([`MIGRATION_GUIDE.md`](MIGRATION_GUIDE.md:1))
- [ ] Stakeholder approval obtained
- [ ] Development environment ready

## 🏗️ Phase 1: Type Definitions & Core Utilities

### TypeScript Types
- [ ] Add `Child` interface to [`src/types/game.types.ts`](src/types/game.types.ts:1)
- [ ] Add `CandyRequest` interface
- [ ] Add `ChildAllocation` interface
- [ ] Add `AllocatedCandy` interface
- [ ] Add `ChildResult` interface
- [ ] Add `RoundResult` interface
- [ ] Add `GameConfig` interface
- [ ] Update `GameRound` interface (rename `candies` to `initialCandies`, change `childrenCount` to `children[]`)
- [ ] Update `GameState` interface (change `currentAllocation` type, add `roundResults`)
- [ ] Mark `AllocationInput` as deprecated

### Config Loader
- [ ] Create [`src/utils/configLoader.ts`](src/utils/configLoader.ts:1)
- [ ] Implement `loadGameConfig()` function
- [ ] Implement `validateGameConfig()` function
- [ ] Add error handling and user-friendly messages
- [ ] Add TypeScript validation

### Scoring Engine
- [ ] Create [`src/utils/scoringEngine.ts`](src/utils/scoringEngine.ts:1)
- [ ] Implement `calculateChildScore()` function
- [ ] Implement `isAllocationExactMatch()` helper
- [ ] Implement `calculateRoundScore()` function
- [ ] Add scoring constants
- [ ] Add comprehensive comments

### Validation Logic
- [ ] Update [`src/utils/candyAllocation.ts`](src/utils/candyAllocation.ts:1)
- [ ] Add `validateInventory()` function
- [ ] Add `calculateRemainingCandies()` function
- [ ] Mark old `validateAllocation()` as deprecated
- [ ] Add inventory tracking utilities

### Constants
- [ ] Update [`src/utils/constants.ts`](src/utils/constants.ts:1)
- [ ] Add `SCORING` constants
- [ ] Add `SPECIAL_CHILD_INDICATOR` constant
- [ ] Mark old `GAME_CONFIG` as deprecated

## 🎨 Phase 2: New Components

### ChildCard Component
- [ ] Create [`src/components/game/ChildCard.tsx`](src/components/game/ChildCard.tsx:1)
- [ ] Implement child display (emoji, special indicator)
- [ ] Display candy requests clearly
- [ ] Create allocation inputs per child
- [ ] Add real-time validation
- [ ] Show remaining candy availability
- [ ] Add result display (after submission)
- [ ] Style with Halloween theme
- [ ] Make responsive

### CandyInventory Component
- [ ] Create [`src/components/game/CandyInventory.tsx`](src/components/game/CandyInventory.tsx:1)
- [ ] Display initial candy amounts
- [ ] Show remaining candy dynamically
- [ ] Use progress bars or visual indicators
- [ ] Add candy emojis and colors
- [ ] Make responsive

### RoundSummary Component
- [ ] Create [`src/components/game/RoundSummary.tsx`](src/components/game/RoundSummary.tsx:1)
- [ ] Display round results
- [ ] Show per-child breakdown
- [ ] Highlight correct/partial/incorrect allocations
- [ ] Display points earned
- [ ] Add animations for feedback

## 🔄 Phase 3: Update Existing Components

### GameBoard Component
- [ ] Update [`src/components/game/GameBoard.tsx`](src/components/game/GameBoard.tsx:1)
- [ ] Replace random generation with config loading
- [ ] Add `gameConfig` state
- [ ] Update `allocations` state (change from `AllocationInput[]` to `ChildAllocation[]`)
- [ ] Add `remainingCandies` state
- [ ] Add `roundResults` state
- [ ] Update round initialization logic
- [ ] Integrate new scoring engine
- [ ] Update submit handler
- [ ] Add inventory validation
- [ ] Update UI layout (add inventory display)
- [ ] Replace old AllocationInputs with new per-child system
- [ ] Update feedback messages
- [ ] Test round progression

### AllocationInputs Component
- [ ] Rewrite [`src/components/game/AllocationInputs.tsx`](src/components/game/AllocationInputs.tsx:1)
- [ ] Update props interface
- [ ] Map children to ChildCard components
- [ ] Handle per-child allocation changes
- [ ] Aggregate allocations for parent
- [ ] Add layout styling

### CandyDisplay Component
- [ ] Review [`src/components/game/CandyDisplay.tsx`](src/components/game/CandyDisplay.tsx:1)
- [ ] Update if needed for "initial" vs "remaining" display
- [ ] Consider adding state indicators

### FeedbackModal Component
- [ ] Update [`src/components/game/FeedbackModal.tsx`](src/components/game/FeedbackModal.tsx:1)
- [ ] Support new feedback types (correct, partial, none)
- [ ] Show per-child results if applicable
- [ ] Update messages

### ScoreDisplay Component
- [ ] Update [`src/components/game/ScoreDisplay.tsx`](src/components/game/ScoreDisplay.tsx:1)
- [ ] Handle decimal points (0.5 increments)
- [ ] Possibly show round score separately

### Timer Component
- [ ] Review [`src/components/game/Timer.tsx`](src/components/game/Timer.tsx:1)
- [ ] No changes expected (keep as-is)

### GameOverScreen Component
- [ ] Update [`src/components/screens/GameOverScreen.tsx`](src/components/screens/GameOverScreen.tsx:1)
- [ ] Show per-round breakdown if desired
- [ ] Update statistics display

## 📄 Phase 4: Game Configuration

### Create Config File
- [ ] Create [`public/game-config.json`](public/game-config.json:1)
- [ ] Design 5-10 rounds of varying difficulty
- [ ] Balance special vs regular children
- [ ] Ensure candy names match exactly
- [ ] Validate JSON syntax
- [ ] Test solvability of each round
- [ ] Add progressive difficulty

### Config Examples
- [ ] Create [`public/game-config-easy.json`](public/game-config-easy.json:1) (optional)
- [ ] Create [`public/game-config-hard.json`](public/game-config-hard.json:1) (optional)

## 🗄️ Phase 5: Database Updates

### Schema Migration
- [ ] Run database migration (see [`MIGRATION_GUIDE.md`](MIGRATION_GUIDE.md:1))
- [ ] Add `average_points_per_round` column
- [ ] Add `perfect_rounds` column
- [ ] Add `partial_rounds` column
- [ ] Add `config_version` column
- [ ] Create `round_results` table (optional)
- [ ] Create indexes for performance

### Supabase Client
- [ ] Update [`src/lib/supabaseClient.ts`](src/lib/supabaseClient.ts:1) if needed
- [ ] Add types for new columns
- [ ] Update insert/update queries

## 🧪 Phase 6: Testing

### Unit Tests
- [ ] Test `configLoader.ts` functions
- [ ] Test `scoringEngine.ts` calculations
- [ ] Test `candyAllocation.ts` validation
- [ ] Test edge cases (empty allocations, over-allocation, etc.)

### Integration Tests
- [ ] Test config loading in app
- [ ] Test complete game flow
- [ ] Test scoring across multiple rounds
- [ ] Test inventory tracking
- [ ] Test special children scoring

### User Testing
- [ ] Mobile responsiveness
- [ ] Desktop layout
- [ ] Cross-browser compatibility
- [ ] Accessibility
- [ ] Performance

## 📚 Phase 7: Documentation

### Update README
- [ ] Update [`README.md`](README.md:1) with new mechanics
- [ ] Add config file instructions
- [ ] Update scoring explanation
- [ ] Add screenshots of new UI

### Update PROJECT_SUMMARY
- [ ] Update [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md:1)
- [ ] Document v2.0 features
- [ ] Update architecture section

### Create CHANGELOG
- [ ] Create `CHANGELOG.md`
- [ ] Document all changes from v1.x to v2.0
- [ ] List breaking changes

## 🚀 Phase 8: Deployment

### Pre-deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Version bumped to 2.0.0
- [ ] Git tag created
- [ ] Backup created

### Deployment
- [ ] Deploy to staging (test environment)
- [ ] Full QA testing on staging
- [ ] Fix any issues found
- [ ] Deploy to production (Vercel)
- [ ] Verify production deployment

### Post-deployment
- [ ] Monitor error logs (24 hours)
- [ ] Check user feedback
- [ ] Verify leaderboard working
- [ ] Measure performance metrics
- [ ] Document any issues

## ✅ Definition of Done

Each feature is considered complete when:
- [ ] Code implemented and working
- [ ] TypeScript types correct
- [ ] Unit tests written and passing
- [ ] Integration tested
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA approved

## 📊 Success Criteria

The migration is successful when:
- [ ] All players can load and play the game
- [ ] Config loads without errors
- [ ] Scoring calculates correctly
- [ ] Special children award 2x points
- [ ] Partial credit works (0.5 points)
- [ ] Inventory validation prevents over-allocation
- [ ] All players see the same rounds
- [ ] Leaderboard updates properly
- [ ] No critical bugs in first week
- [ ] User completion rate ≥ v1.x

## 🐛 Known Issues / TODOs

Track issues discovered during implementation:
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]
- [ ] Issue 3: [Description]

## 📝 Notes

Add implementation notes here:
- Date started: ___________
- Date completed: ___________
- Team members: ___________
- Challenges faced: ___________
- Lessons learned: ___________

## 🔗 Related Documents

- [`PIVOT_ARCHITECTURE.md`](PIVOT_ARCHITECTURE.md:1) - Technical architecture
- [`GAME_CONFIG_GUIDE.md`](GAME_CONFIG_GUIDE.md:1) - Config file reference
- [`MIGRATION_GUIDE.md`](MIGRATION_GUIDE.md:1) - Step-by-step migration
- [`README.md`](README.md:1) - User guide
- [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md:1) - Project overview

---

**Version:** 2.0.0  
**Last Updated:** 2025-10-28  
**Status:** Ready for Implementation 🚀