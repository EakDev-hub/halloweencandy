# 🎃 Halloween Candy Game - Pivot Architecture Plan

## Executive Summary

This document outlines the architectural changes required to pivot the Halloween Candy Allocation Game from an "equal division" mechanic to a "child-specific candy request" system with special children earning bonus points.

## Current vs. New Game Mechanics

### Current Game (Equal Division)
- Players have candy inventory
- Must divide each candy type equally among all children
- If not divisible, allocate 0
- 10 points for correct answer
- Random generation of rounds

### New Game (Request-Based Allocation)
- Players have starting candy inventory
- Each child has specific candy requests (e.g., "2 Lollipops, 1 Chocolate")
- Special children marked with 👑 (earn 2 points per candy)
- Regular children earn 1 point per candy
- Incorrect allocation earns 0.5 points
- No allocation earns 0 points
- All players globally play the same rounds (from JSON config)

## Architecture Changes

### 1. Data Structure Changes

#### New TypeScript Types

```typescript
// Child representation
export interface Child {
  id: string;                    // Unique identifier (e.g., "child-1")
  isSpecial: boolean;            // Special children earn 2x points
  requests: CandyRequest[];      // What this child wants
  emoji: string;                 // Visual representation (👧, 👦)
}

// Individual candy request per child
export interface CandyRequest {
  candyName: string;             // Name of candy type
  quantity: number;              // How many they want
}

// Player's allocation to a child
export interface ChildAllocation {
  childId: string;
  allocatedCandies: AllocatedCandy[];
}

export interface AllocatedCandy {
  candyName: string;
  quantity: number;
}

// Updated Round structure
export interface GameRound {
  roundNumber: number;
  initialCandies: CandyType[];   // Starting inventory
  children: Child[];              // Children with their requests
  timeLimit: number;
}

// Round result tracking
export interface RoundResult {
  roundNumber: number;
  pointsEarned: number;
  childResults: ChildResult[];
}

export interface ChildResult {
  childId: string;
  isCorrect: boolean;            // Full match
  isPartial: boolean;            // Wrong type/amount
  pointsEarned: number;          // 0, 0.5, 1, or 2
}
```

#### Game Config JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["gameSettings", "rounds"],
  "properties": {
    "gameSettings": {
      "type": "object",
      "properties": {
        "totalRounds": { "type": "number" },
        "timeLimitPerRound": { "type": "number" },
        "version": { "type": "string" }
      }
    },
    "rounds": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["roundNumber", "initialCandies", "children"],
        "properties": {
          "roundNumber": { "type": "number" },
          "timeLimit": { "type": "number" },
          "initialCandies": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "quantity": { "type": "number" },
                "color": { "type": "string" },
                "emoji": { "type": "string" }
              }
            }
          },
          "children": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "isSpecial": { "type": "boolean" },
                "emoji": { "type": "string" },
                "requests": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "candyName": { "type": "string" },
                      "quantity": { "type": "number" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 2. Example Game Config File

```json
{
  "gameSettings": {
    "totalRounds": 5,
    "timeLimitPerRound": 40,
    "version": "2.0.0"
  },
  "rounds": [
    {
      "roundNumber": 1,
      "timeLimit": 40,
      "initialCandies": [
        { "name": "Lollipop", "quantity": 10, "color": "#FF1493", "emoji": "🍭" },
        { "name": "Chocolate", "quantity": 8, "color": "#8B4513", "emoji": "🍫" },
        { "name": "Gummy Bears", "quantity": 12, "color": "#FF6347", "emoji": "🐻" }
      ],
      "children": [
        {
          "id": "child-1",
          "isSpecial": false,
          "emoji": "👧",
          "requests": [
            { "candyName": "Lollipop", "quantity": 2 },
            { "candyName": "Chocolate", "quantity": 1 }
          ]
        },
        {
          "id": "child-2",
          "isSpecial": true,
          "emoji": "👦",
          "requests": [
            { "candyName": "Gummy Bears", "quantity": 3 },
            { "candyName": "Lollipop", "quantity": 1 }
          ]
        },
        {
          "id": "child-3",
          "isSpecial": false,
          "emoji": "👧",
          "requests": [
            { "candyName": "Chocolate", "quantity": 2 },
            { "candyName": "Gummy Bears", "quantity": 2 }
          ]
        }
      ]
    }
  ]
}
```

### 3. Scoring System Logic

```typescript
/**
 * Calculate points earned for allocating candies to a child
 * 
 * @param child - The child receiving candy
 * @param allocation - What player gave to this child
 * @returns Score breakdown
 */
export function calculateChildScore(
  child: Child,
  allocation: AllocatedCandy[]
): ChildResult {
  const pointsPerCorrectCandy = child.isSpecial ? 2 : 1;
  const pointsPerIncorrectCandy = 0.5;
  
  // Check if allocation exactly matches requests
  const isExactMatch = isAllocationExactMatch(child.requests, allocation);
  
  if (isExactMatch) {
    // Full match: earn points for each candy
    const totalCandies = child.requests.reduce((sum, req) => sum + req.quantity, 0);
    return {
      childId: child.id,
      isCorrect: true,
      isPartial: false,
      pointsEarned: totalCandies * pointsPerCorrectCandy
    };
  }
  
  // Check if partially correct (wrong type or amount)
  const hasAllocation = allocation.length > 0 && 
    allocation.some(a => a.quantity > 0);
  
  if (hasAllocation) {
    // Incorrect allocation: earn 0.5 points
    return {
      childId: child.id,
      isCorrect: false,
      isPartial: true,
      pointsEarned: pointsPerIncorrectCandy
    };
  }
  
  // No allocation: 0 points
  return {
    childId: child.id,
    isCorrect: false,
    isPartial: false,
    pointsEarned: 0
  };
}

/**
 * Check if allocation exactly matches child's requests
 */
function isAllocationExactMatch(
  requests: CandyRequest[],
  allocation: AllocatedCandy[]
): boolean {
  // Must have same number of candy types
  if (requests.length !== allocation.length) return false;
  
  // Every request must match exactly
  return requests.every(request => {
    const allocated = allocation.find(a => a.candyName === request.candyName);
    return allocated && allocated.quantity === request.quantity;
  });
}

/**
 * Calculate total score for a round
 */
export function calculateRoundScore(
  children: Child[],
  allocations: ChildAllocation[]
): RoundResult {
  const childResults = children.map(child => {
    const allocation = allocations.find(a => a.childId === child.id);
    return calculateChildScore(
      child,
      allocation?.allocatedCandies || []
    );
  });
  
  const totalPoints = childResults.reduce(
    (sum, result) => sum + result.pointsEarned,
    0
  );
  
  return {
    roundNumber: 0, // Set by caller
    pointsEarned: totalPoints,
    childResults
  };
}
```

### 4. Component Changes

#### 4.1 GameBoard Component

**Changes Required:**
- Load game config from JSON instead of generating rounds
- Display starting candy inventory prominently
- Show all children with their specific requests
- Update allocation input to be per-child instead of per-candy
- Implement new scoring logic
- Show real-time feedback per child

**New State:**
```typescript
const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
const [allocations, setAllocations] = useState<ChildAllocation[]>([]);
const [remainingCandies, setRemainingCandies] = useState<CandyType[]>([]);
const [childResults, setChildResults] = useState<ChildResult[]>([]);
```

#### 4.2 AllocationInputs Component

**Current:** Allocates candies per candy type to all children
**New:** Allocates candies per child from inventory

**New Props:**
```typescript
interface AllocationInputsProps {
  children: Child[];
  availableCandies: CandyType[];
  allocations: ChildAllocation[];
  onChange: (allocations: ChildAllocation[]) => void;
  disabled?: boolean;
}
```

**UI Layout:**
```
For each child:
  [Child Avatar] [Special Indicator if special]
  Requests: 2🍭 + 1🍫
  Give:
    - Lollipop: [___] (available: 10)
    - Chocolate: [___] (available: 8)
```

#### 4.3 New Component: ChildCard

```typescript
interface ChildCardProps {
  child: Child;
  availableCandies: CandyType[];
  allocation: AllocatedCandy[];
  onChange: (allocation: AllocatedCandy[]) => void;
  disabled?: boolean;
  result?: ChildResult; // Show after submission
}
```

**Features:**
- Display child emoji
- Show special indicator (👑 for special children)
- Display requests clearly
- Input fields for allocation
- Real-time validation (can't allocate more than available)
- Show result after submission (✅ correct, ⚠️ partial, ❌ none)

#### 4.4 CandyInventory Component (New)

```typescript
interface CandyInventoryProps {
  initialCandies: CandyType[];
  remainingCandies: CandyType[];
}
```

**Display:**
```
🏠 Your Candy Inventory
Lollipop: 7/10 remaining 🍭
Chocolate: 5/8 remaining 🍫
Gummy Bears: 12/12 remaining 🐻
```

### 5. File Structure Changes

```
src/
├── config/
│   └── game-config.json          # NEW: Game configuration
├── types/
│   └── game.types.ts              # MODIFIED: Add new types
├── utils/
│   ├── candyAllocation.ts         # MODIFIED: New validation logic
│   ├── configLoader.ts            # NEW: Load and validate config
│   ├── scoringEngine.ts           # NEW: Calculate scores
│   └── constants.ts               # MODIFIED: Update constants
├── components/
│   └── game/
│       ├── AllocationInputs.tsx   # MODIFIED: Per-child allocation
│       ├── ChildCard.tsx          # NEW: Individual child display
│       ├── CandyInventory.tsx     # NEW: Inventory display
│       ├── GameBoard.tsx          # MODIFIED: New game flow
│       └── RoundSummary.tsx       # NEW: Show round results
└── validation/
    └── configSchema.ts            # NEW: JSON schema validation
```

### 6. Game Flow Changes

#### Old Flow:
```
1. Generate random round
2. Display candies and children count
3. Player allocates candy per type
4. Validate equal division
5. Award 10 points if correct
6. Next round
```

#### New Flow:
```
1. Load config from JSON
2. Display starting candy inventory
3. Display each child with their requests
4. Player allocates candy to each child individually
5. Calculate points per child:
   - Exact match: 1 point per candy (2 if special child)
   - Incorrect: 0.5 points
   - None: 0 points
6. Show results per child
7. Total round score
8. Next round
```

### 7. Validation Logic

```typescript
/**
 * Validate that allocations don't exceed available candy
 */
export function validateInventory(
  initialCandies: CandyType[],
  allocations: ChildAllocation[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Calculate total allocated per candy type
  const allocatedTotals = new Map<string, number>();
  
  allocations.forEach(childAlloc => {
    childAlloc.allocatedCandies.forEach(candy => {
      const current = allocatedTotals.get(candy.candyName) || 0;
      allocatedTotals.set(candy.candyName, current + candy.quantity);
    });
  });
  
  // Check against initial inventory
  initialCandies.forEach(candy => {
    const allocated = allocatedTotals.get(candy.name) || 0;
    if (allocated > candy.quantity) {
      errors.push(
        `Not enough ${candy.name}: allocated ${allocated}, have ${candy.quantity}`
      );
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 8. UI/UX Improvements

#### 8.1 Visual Hierarchy

```
┌─────────────────────────────────────────┐
│  Round 1/5        Score: 12.5    ⏰ 0:35 │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  🏠 Your Candy Inventory                │
│  🍭 Lollipop: 7/10                      │
│  🍫 Chocolate: 5/8                       │
│  🐻 Gummy Bears: 12/12                   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  👧 Child 1                             │
│  Wants: 2🍭 + 1🍫                        │
│  Give:                                  │
│    Lollipop: [__]  Chocolate: [__]     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  👦 Child 2 👑 (Special!)               │
│  Wants: 3🐻 + 1🍭                        │
│  Give:                                  │
│    Gummy Bears: [__]  Lollipop: [__]   │
└─────────────────────────────────────────┘
```

#### 8.2 Real-time Feedback

- Update remaining inventory as player types
- Highlight in red if trying to allocate more than available
- Show green checkmark when allocation matches request
- Show warning icon for partial match

### 9. Database Schema Updates

```sql
-- Add new columns to track detailed scoring
ALTER TABLE game_sessions 
ADD COLUMN IF NOT EXISTS average_points_per_round DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS perfect_rounds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS partial_rounds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS config_version VARCHAR(10);

-- Optional: Store detailed round results
CREATE TABLE IF NOT EXISTS round_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id),
  round_number INTEGER,
  points_earned DECIMAL(4,2),
  child_results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. Migration Strategy

#### Phase 1: Preparation (Architect Mode)
- [x] Design new architecture
- [ ] Create detailed implementation plan
- [ ] Design config file format
- [ ] Update type definitions

#### Phase 2: Core Implementation (Code Mode)
- [ ] Update type definitions
- [ ] Create config loader utility
- [ ] Implement new scoring engine
- [ ] Update validation logic

#### Phase 3: Component Updates (Code Mode)
- [ ] Create ChildCard component
- [ ] Create CandyInventory component
- [ ] Update AllocationInputs component
- [ ] Update GameBoard component
- [ ] Create RoundSummary component

#### Phase 4: Testing & Polish (Debug Mode)
- [ ] Test config loading
- [ ] Test scoring calculations
- [ ] Test UI interactions
- [ ] Test edge cases
- [ ] Performance optimization

#### Phase 5: Documentation (Architect Mode)
- [ ] Create config file guide
- [ ] Update README
- [ ] Create migration guide
- [ ] Document scoring system

## Implementation Complexity Breakdown

### High Complexity (Significant Changes)
- ✅ Game config system and loader
- ✅ Scoring engine (per-child calculation)
- ✅ AllocationInputs component (complete redesign)
- ✅ GameBoard component (major refactor)

### Medium Complexity (Moderate Changes)
- ✅ Type definitions (new interfaces)
- ✅ Validation logic (inventory tracking)
- ✅ ChildCard component (new component)
- ✅ CandyInventory component (new component)

### Low Complexity (Minor Changes)
- ✅ Constants updates
- ✅ UI styling adjustments
- ✅ Timer component (no changes)
- ✅ FeedbackModal updates

## Success Criteria

1. ✅ Game loads from JSON config file
2. ✅ All players see identical rounds
3. ✅ Children display with their specific requests
4. ✅ Special children clearly marked with 👑
5. ✅ Players can allocate candy per child
6. ✅ Inventory tracking prevents over-allocation
7. ✅ Scoring correctly calculates:
   - 1 point per candy for correct regular child allocation
   - 2 points per candy for correct special child allocation
   - 0.5 points for incorrect allocation
   - 0 points for no allocation
8. ✅ Round results show per-child breakdown
9. ✅ Game maintains all existing features (timer, leaderboard, etc.)

## Risk Assessment

### High Risk
- **Config file management**: Players might edit incorrectly
  - *Mitigation*: JSON schema validation, error messages
  
- **Complex UI for mobile**: More inputs per screen
  - *Mitigation*: Responsive design, collapsible sections

### Medium Risk
- **Score calculation bugs**: Multiple scoring paths
  - *Mitigation*: Comprehensive unit tests
  
- **Inventory tracking errors**: Real-time updates
  - *Mitigation*: Immutable state patterns

### Low Risk
- **Type safety**: TypeScript helps
- **Existing features**: Keep working components

## Performance Considerations

- Config file caching (load once)
- Optimized re-renders (React.memo for ChildCard)
- Efficient state updates (useReducer for complex state)
- Lazy loading for large config files

## Next Steps

1. **Review this architecture plan** with stakeholders
2. **Create example game config** with 5-10 rounds
3. **Switch to Code mode** to implement changes
4. **Implement in phases** (types → logic → UI → testing)
5. **Deploy and test** with real users

---

**Created:** 2025-10-28  
**Version:** 2.0.0  
**Status:** Ready for Implementation