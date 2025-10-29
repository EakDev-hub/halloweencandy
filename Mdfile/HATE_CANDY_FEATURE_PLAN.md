# Hate Candy Feature - Implementation Plan

## Overview
Add a "hate candy" mechanic where each child has exactly **one candy type they dislike**. If allocated that candy, the player receives a **-1 point penalty per piece** of the hated candy.

---

## Feature Requirements

### Core Rules
- ✅ Each child hates exactly **1 candy type**
- ✅ Hated candy is **always different** from their requested candies
- ✅ Penalty: **-1 point per piece** of hated candy allocated
- ✅ Applies to **all 15 rounds**
- ✅ Visual indicator showing which candy is hated

---

## Scoring Examples

### Example 1: Correct Allocation (Regular Child)
**Child wants:** 3 Lollipop, 2 Chocolate  
**Child hates:** Gummy Bears  
**Player gives:** 3 Lollipop, 2 Chocolate  
**Score:** +5 points (1 point × 5 candies) ✅

### Example 2: Correct Allocation with Hated Candy (Regular Child)
**Child wants:** 3 Lollipop, 2 Chocolate  
**Child hates:** Gummy Bears  
**Player gives:** 3 Lollipop, 2 Chocolate, 2 Gummy Bears  
**Score:** +5 - 2 = **+3 points** ⚠️

### Example 3: Wrong Allocation with Hated Candy (Regular Child)
**Child wants:** 3 Lollipop, 2 Chocolate  
**Child hates:** Mint  
**Player gives:** 2 Lollipop, 3 Mint  
**Score:** 2.5 (partial) - 3 (hate penalty) = **-0.5 points** ❌

### Example 4: Special Child with Hated Candy
**Child wants:** 4 Chocolate, 3 Lollipop (Special child 👑)  
**Child hates:** Candy Corn  
**Player gives:** 4 Chocolate, 3 Lollipop, 1 Candy Corn  
**Score:** +14 - 1 = **+13 points** (7 candies × 2 points - 1 hate) ⚠️

### Example 5: Only Hated Candy Given
**Child wants:** 3 Lollipop  
**Child hates:** Chocolate  
**Player gives:** 5 Chocolate  
**Score:** 2.5 (partial for 5 candies) - 5 (hate penalty) = **-2.5 points** ❌

---

## Technical Architecture

### 1. Type Definitions Changes

**File:** [`src/types/game.types.ts`](../src/types/game.types.ts)

```typescript
export interface Child {
  id: string;
  isSpecial: boolean;
  requests: CandyRequest[];
  emoji: string;
  hatedCandy?: string; // NEW: Name of candy the child hates
}

export interface ChildResult {
  childId: string;
  isCorrect: boolean;
  isPartial: boolean;
  pointsEarned: number;
  hatePenalty?: number; // NEW: Points deducted for hated candy
}
```

### 2. Scoring Engine Changes

**File:** [`src/utils/scoringEngine.ts`](../src/utils/scoringEngine.ts)

**New Constant:**
```typescript
/**
 * Penalty points per piece of hated candy
 */
export const POINTS_HATE_PENALTY = -1;
```

**Updated Function:**
```typescript
export function calculateChildScore(
  child: Child,
  allocation: AllocatedCandy[]
): ChildResult {
  const pointsPerCorrectCandy = child.isSpecial 
    ? POINTS_SPECIAL_CHILD 
    : POINTS_REGULAR_CHILD;
  
  // Calculate hate penalty FIRST
  let hatePenalty = 0;
  if (child.hatedCandy) {
    const hatedAllocation = allocation.find(a => a.candyName === child.hatedCandy);
    if (hatedAllocation && hatedAllocation.quantity > 0) {
      hatePenalty = hatedAllocation.quantity * POINTS_HATE_PENALTY;
    }
  }
  
  // Check if allocation exactly matches child's requests
  const isExactMatch = isAllocationExactMatch(child.requests, allocation);
  
  if (isExactMatch && hatePenalty === 0) {
    // Perfect match with no hate penalty
    const totalCandies = child.requests.reduce(
      (sum, req) => sum + req.quantity, 
      0
    );
    return {
      childId: child.id,
      isCorrect: true,
      isPartial: false,
      pointsEarned: totalCandies * pointsPerCorrectCandy,
      hatePenalty: 0
    };
  }
  
  // If there's a hate penalty, even exact match becomes partial
  if (isExactMatch && hatePenalty < 0) {
    const totalCandies = child.requests.reduce(
      (sum, req) => sum + req.quantity, 
      0
    );
    const basePoints = totalCandies * pointsPerCorrectCandy;
    return {
      childId: child.id,
      isCorrect: false,
      isPartial: true,
      pointsEarned: Math.max(0, basePoints + hatePenalty), // Can't go below 0 total
      hatePenalty: hatePenalty
    };
  }
  
  // Check if player gave something (even if wrong)
  const hasAllocation = allocation.length > 0 &&
    allocation.some(a => a.quantity > 0);
  
  if (hasAllocation) {
    // Incorrect allocation: partial credit per candy + hate penalty
    const totalAllocated = allocation.reduce(
      (sum, candy) => sum + candy.quantity,
      0
    );
    const partialPoints = totalAllocated * POINTS_INCORRECT_PER_CANDY;
    return {
      childId: child.id,
      isCorrect: false,
      isPartial: true,
      pointsEarned: Math.max(0, partialPoints + hatePenalty), // Can't go below 0 total
      hatePenalty: hatePenalty
    };
  }
  
  // No allocation: zero points
  return {
    childId: child.id,
    isCorrect: false,
    isPartial: false,
    pointsEarned: POINTS_NONE,
    hatePenalty: 0
  };
}
```

### 3. Game Configuration Changes

**File:** [`public/game-config.json`](../public/game-config.json)

For each child in all 15 rounds, add a `hatedCandy` field:

```json
{
  "id": "child-1",
  "isSpecial": false,
  "emoji": "👧",
  "requests": [
    { "candyName": "Lollipop", "quantity": 3 },
    { "candyName": "Chocolate", "quantity": 2 }
  ],
  "hatedCandy": "Gummy Bears"
}
```

**Selection Strategy:**
- For each child, randomly select 1 candy type available in that round
- Ensure hated candy ≠ any candy in their `requests` array
- Prefer candies with higher availability to create interesting strategic choices

### 4. UI Component Changes

#### A. ChildCard Component

**File:** [`src/components/game/ChildCard.tsx`](../src/components/game/ChildCard.tsx)

**Display hated candy in the header section:**
```tsx
{/* After requests section, add hated candy display */}
{child.hatedCandy && (
  <div className="mb-1.5 p-1.5 bg-red-900/30 rounded-lg border border-red-500">
    <p className="text-xs text-red-400 mb-1 font-semibold flex items-center gap-1">
      <span>🚫</span>
      <span>Hates:</span>
    </p>
    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-800/40 rounded-full inline-flex">
      <span className="text-sm">
        {availableCandies.find(c => c.name === child.hatedCandy)?.emoji || '🍬'}
      </span>
      <span className="text-xs text-red-300 font-bold">{child.hatedCandy}</span>
      <span className="text-xs text-red-400">(-1 pt each)</span>
    </div>
  </div>
)}
```

**Highlight hated candy in allocation inputs:**
```tsx
{availableCandies.map((candy) => {
  const isHated = child.hatedCandy === candy.name;
  
  return (
    <div
      className={`
        // ... existing classes
        ${isHated ? 'bg-red-900/20 border border-red-500/50' : ''}
      `}
    >
      {/* ... existing content */}
      {isHated && (
        <span className="text-red-400 text-xs">🚫</span>
      )}
    </div>
  );
})}
```

**Update result indicator to show hate penalty:**
```tsx
const getResultIndicator = () => {
  if (!result) return null;
  
  return (
    <div className="flex flex-col gap-1">
      {/* Main score */}
      <div className={`flex items-center gap-2 ${
        result.isCorrect ? 'text-green-400' : 
        result.isPartial ? 'text-yellow-400' : 
        'text-gray-400'
      }`}>
        <span className="text-2xl">
          {result.isCorrect ? '✅' : result.isPartial ? '⚠️' : '❌'}
        </span>
        <span className="font-bold">
          {result.pointsEarned > 0 ? '+' : ''}{result.pointsEarned} points
        </span>
      </div>
      
      {/* Hate penalty indicator */}
      {result.hatePenalty && result.hatePenalty < 0 && (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <span>🚫</span>
          <span>{result.hatePenalty} from hated candy</span>
        </div>
      )}
    </div>
  );
};
```

#### B. FeedbackModal Component

**File:** [`src/components/game/FeedbackModal.tsx`](../src/components/game/FeedbackModal.tsx)

Add summary of hate penalties in the feedback modal:
```tsx
{/* Show hate penalty summary */}
{roundResult.childResults.some(r => r.hatePenalty && r.hatePenalty < 0) && (
  <div className="mt-3 p-2 bg-red-900/20 border border-red-500 rounded-lg">
    <p className="text-sm font-bold text-red-400 mb-1">⚠️ Hate Candy Penalties:</p>
    {roundResult.childResults
      .filter(r => r.hatePenalty && r.hatePenalty < 0)
      .map(r => {
        const child = children.find(c => c.id === r.childId);
        return (
          <div key={r.childId} className="text-xs text-red-300">
            {child?.emoji} {r.childId}: {r.hatePenalty} points ({child?.hatedCandy})
          </div>
        );
      })}
  </div>
)}
```

---

## Strategic Impact

### Game Balance Considerations

1. **Increased Difficulty:**
   - Players must now track both wanted AND hated candies
   - Risk of accidentally giving hated candy increases cognitive load
   - Strategic depth: sometimes better to give nothing than wrong candy

2. **Special Children Impact:**
   - Hated candy penalties are more impactful on special children
   - Example: 5 correct candies (10 pts) + 3 hated (−3) = 7 pts net

3. **Scarcity Rounds (8-15):**
   - Hate candy adds another layer of complexity
   - Players might intentionally skip a child rather than risk hate penalty

### Example Strategic Scenario

**Round 12 with Hate Candy:**

**Available:**
- Lollipop: 10
- Chocolate: 8
- Gummy Bears: 6

**Children:**
1. 👑 Special (wants 5 Lollipop, 3 Chocolate | hates Gummy Bears)
2. Regular (wants 4 Gummy, 2 Lollipop | hates Chocolate)
3. Regular (wants 3 Lollipop, 2 Chocolate | hates Mint)

**Optimal Strategy:**
- Give Special child exactly what they want: +16 pts
- Give Child 2 partial allocation avoiding chocolate
- Save remaining for Child 3
- **Avoid giving any hated candies at all costs**

---

## Implementation Checklist

### Phase 1: Core Implementation
- [ ] Update [`Child`](../src/types/game.types.ts:14) interface with `hatedCandy?: string`
- [ ] Update [`ChildResult`](../src/types/game.types.ts:31) interface with `hatePenalty?: number`
- [ ] Add `POINTS_HATE_PENALTY = -1` constant to [`scoringEngine.ts`](../src/utils/scoringEngine.ts:28)
- [ ] Modify [`calculateChildScore()`](../src/utils/scoringEngine.ts:42) to apply hate penalty
- [ ] Ensure minimum score of 0 (can't go negative per child)

### Phase 2: Configuration
- [ ] Add `hatedCandy` to all children in Round 1-3 (learning phase)
- [ ] Add `hatedCandy` to all children in Round 4-7 (strategy phase)
- [ ] Add `hatedCandy` to all children in Round 8-15 (challenge phase)
- [ ] Ensure no child hates candy from their requests

### Phase 3: UI Updates
- [ ] Add hate candy display section to [`ChildCard.tsx`](../src/components/game/ChildCard.tsx)
- [ ] Highlight hated candy in allocation inputs with red border/background
- [ ] Show hate penalty in result indicator
- [ ] Update [`FeedbackModal.tsx`](../src/components/game/FeedbackModal.tsx) to show hate penalties

### Phase 4: Documentation
- [ ] Update [`GAME_STRATEGY_DESIGN.md`](GAME_STRATEGY_DESIGN.md) with hate candy rules
- [ ] Add hate candy examples to scoring documentation
- [ ] Update [`QUICK_START_GUIDE.md`](QUICK_START_GUIDE.md) with hate candy explanation

### Phase 5: Testing
- [ ] Test correct allocation with no hate candy
- [ ] Test correct allocation + hated candy (should be partial with penalty)
- [ ] Test wrong allocation + hated candy (double penalty)
- [ ] Test only hated candy given (negative or zero score)
- [ ] Test special children with hate penalties
- [ ] Verify UI displays hate candy correctly
- [ ] Verify feedback modal shows penalties correctly

---

## Visual Design

### Color Scheme for Hate Candy
- **Border:** `border-red-500` / `border-red-500/50`
- **Background:** `bg-red-900/20` to `bg-red-900/30`
- **Text:** `text-red-400` for labels, `text-red-300` for content
- **Icon:** 🚫 (no entry sign)

### Layout Priority
1. Child emoji + ID + special indicator
2. **Requests section** (existing)
3. **Hated candy section** (NEW - prominent red styling)
4. Allocation inputs (with hate candy highlighted)

---

## Potential Edge Cases

### 1. All Allocated Candy is Hated
**Scenario:** Child wants 3 Lollipop, hates Chocolate, player gives 5 Chocolate  
**Expected:** Partial (5 × 0.5 = 2.5) + Hate (5 × -1 = -5) = max(0, -2.5) = **0 points**

### 2. Mixed Correct and Hated
**Scenario:** Special child wants 4 Chocolate, hates Mint, player gives 4 Chocolate + 2 Mint  
**Expected:** Correct (8 pts) + Hate (-2) = **6 points** (marked as partial due to hate)

### 3. No Hated Candy Defined
**Scenario:** Child has `hatedCandy: undefined` or missing field  
**Expected:** No penalty applied, works as before

---

## Questions for Review

1. **Should total score per child go negative?**
   - Current plan: Use `Math.max(0, score)` to prevent negative
   - Alternative: Allow negative scores per child

2. **Should exact match + hate = partial or wrong?**
   - Current plan: Partial (visual feedback of mixed result)
   - Alternative: Mark as wrong

3. **Visual prominence of hate candy?**
   - Current plan: Red section between requests and inputs
   - Alternative: Smaller inline indicator

---

## Success Criteria

✅ All 15 rounds have hate candy configured  
✅ Scoring correctly applies -1 per hated candy piece  
✅ UI clearly shows which candy is hated  
✅ Players can see hate penalties in results  
✅ Documentation explains the mechanic  
✅ Game remains balanced and fun  

---

*This feature adds strategic depth while maintaining the core gameplay loop. Players must now consider both positive and negative outcomes when allocating candy.*