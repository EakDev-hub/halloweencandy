# Halloween Candy Game - Strategic Design (15 Rounds)

## Game Mechanics Summary

### Scoring System
- **Regular Child**: 1 point per candy (exact match)
- **Special Child** 👑: 2 points per candy (exact match)
- **Incorrect Allocation**: 0.5 points per candy
- **Hated Candy** 🚫: -1 point per piece (NEW!)
- **No Allocation**: 0 points

### Strategic Element
Players must make **resource allocation decisions** when candy is limited. Should they:
- Prioritize special children for 2x points?
- Satisfy more regular children for consistent points?
- Risk some children getting nothing to maximize special child bonuses?
- **Avoid giving hated candies to prevent penalties?** (NEW!)

---

## Hate Candy Mechanic 🚫

### Overview
Each child has exactly **one candy type they hate**. If you give them that candy:
- **-1 point penalty per piece** of hated candy
- The penalty applies regardless of other allocations
- Hated candy is always different from their requests

### Examples

**Example 1: Perfect Allocation (No Hate)**
- Child wants: 3 Lollipop, 2 Chocolate
- Child hates: Gummy Bears
- You give: 3 Lollipop, 2 Chocolate
- **Score: +5 points** ✅

**Example 2: Perfect + Hated Candy**
- Child wants: 3 Lollipop, 2 Chocolate
- Child hates: Gummy Bears
- You give: 3 Lollipop, 2 Chocolate, 2 Gummy Bears
- **Score: +5 - 2 = +3 points** ⚠️

**Example 3: Wrong + Hated (Double Penalty)**
- Child wants: 3 Lollipop
- Child hates: Chocolate
- You give: 5 Chocolate
- **Score: 2.5 (partial) - 5 (hate) = max(0, -2.5) = 0 points** ❌

**Example 4: Special Child with Hate Penalty**
- Special child wants: 4 Chocolate, 3 Lollipop (14 pts if perfect)
- Child hates: Candy Corn
- You give: 4 Chocolate, 3 Lollipop, 1 Candy Corn
- **Score: +14 - 1 = +13 points** ⚠️

### Strategic Impact
- **Think before allocating**: Don't just give all available candy
- **Read carefully**: Check both wants AND hates for each child
- **Sometimes less is more**: No candy is better than hated candy
- **Increased difficulty**: Adds cognitive load, especially in later rounds

---

## 15-Round Progressive Difficulty Design

### Phase 1: Learning Phase (Rounds 1-3)
**Objective**: Teach basic mechanics without pressure

**Characteristics**:
- ❌ **NO special children** - only regular children
- ✅ **Abundant candy** - more than enough to satisfy all children
- ✅ **Simple requests** - 2-3 candy types, small quantities
- 🚫 **Hate candy present** - teaches mechanic early
- ⏱️ **Generous time** - 45-50 seconds
- 👦👧 **2-3 children** per round

**Expected Max Points Per Round**: 6-10 points

---

### Phase 2: Introduction to Strategy (Rounds 4-7)
**Objective**: Introduce special children with manageable resources

**Characteristics**:
- 👑 **1-2 special children** per round
- ✅ **Still manageable candy** - just enough or slightly under
- 📊 **Mixed requests** - some overlap in candy types
- 🚫 **Hate penalties** - must avoid hated candies while optimizing
- ⏱️ **Moderate time** - 40-45 seconds
- 👦👧 **3-4 children** per round

**Strategic Decision**:
- Players start learning the value of special children
- Candy is usually sufficient but requires planning
- Small mistakes are forgivable

**Expected Max Points Per Round**: 12-18 points

---

### Phase 3: Strategic Challenge (Rounds 8-15)
**Objective**: Force difficult resource allocation decisions

**Characteristics**:
- 👑 **2-3 special children** per round
- ⚠️ **LIMITED CANDY** - **NOT enough to satisfy everyone**
- 🎯 **Competing demands** - children want same candy types
- 🚫 **Critical hate avoidance** - penalties hurt more with scarcity
- ⏱️ **Time pressure** - 30-40 seconds
- 👦👧 **4-5 children** per round

**Strategic Decisions Required**:
1. **Scarcity Management**: Cannot satisfy everyone
2. **Point Optimization**: Choose between:
   - Satisfying 1 special child (6-10 points) vs 2 regular children (6-8 points)
   - Giving perfect allocations vs spreading resources
3. **Hate Avoidance**: Must track each child's hated candy to avoid penalties
4. **Risk vs Reward**: Go for high-value special children or play it safe?
5. **Triple Threat**: Manage wants, hates, AND limited inventory simultaneously

**Candy Scarcity Pattern**:
- Round 8-9: 80% of total demand (slightly short)
- Round 10-11: 70% of total demand (noticeable shortage)
- Round 12-13: 60% of total demand (significant shortage)
- Round 14-15: 50% of total demand (extreme shortage - BOSS ROUNDS)

**Expected Max Points Per Round**: 15-25 points (if optimal choices made)

---

## Difficulty Progression Table

| Round | Special Children | Candy Availability | Children Count | Time Limit | Difficulty |
|-------|-----------------|-------------------|----------------|------------|------------|
| 1     | 0               | 120%              | 2              | 50s        | ⭐ Easy    |
| 2     | 0               | 115%              | 3              | 48s        | ⭐ Easy    |
| 3     | 0               | 110%              | 3              | 45s        | ⭐ Easy    |
| 4     | 1               | 100%              | 3              | 45s        | ⭐⭐ Medium |
| 5     | 1               | 95%               | 3              | 43s        | ⭐⭐ Medium |
| 6     | 2               | 90%               | 4              | 40s        | ⭐⭐ Medium |
| 7     | 2               | 85%               | 4              | 40s        | ⭐⭐ Medium |
| 8     | 2               | 80%               | 4              | 38s        | ⭐⭐⭐ Hard |
| 9     | 2               | 75%               | 4              | 38s        | ⭐⭐⭐ Hard |
| 10    | 2               | 70%               | 5              | 35s        | ⭐⭐⭐ Hard |
| 11    | 3               | 70%               | 5              | 35s        | ⭐⭐⭐ Hard |
| 12    | 3               | 65%               | 5              | 33s        | ⭐⭐⭐⭐ Very Hard |
| 13    | 3               | 60%               | 5              | 33s        | ⭐⭐⭐⭐ Very Hard |
| 14    | 3               | 55%               | 5              | 30s        | ⭐⭐⭐⭐⭐ Boss |
| 15    | 4               | 50%               | 5              | 30s        | ⭐⭐⭐⭐⭐ Boss |

---

## Strategic Scenarios (Rounds 8-15 Examples)

### Example Scenario: Round 12 (With Hate Candy)
**Available Candy**:
- Lollipop: 10
- Chocolate: 8
- Gummy Bears: 6

**Children**:
1. 👑 Special Child A: wants 5 Lollipop, 3 Chocolate | **hates Gummy Bears** (16 pts - penalties)
2. 👑 Special Child B: wants 4 Gummy Bears, 2 Lollipop | **hates Chocolate** (12 pts - penalties)
3. Regular Child C: wants 3 Lollipop, 2 Chocolate | **hates Mint** (5 points)
4. 👑 Special Child D: wants 3 Chocolate, 2 Gummy Bears | **hates Lollipop** (10 pts - penalties)
5. Regular Child E: wants 2 Lollipop, 1 Gummy Bears | **hates Chocolate** (3 pts - penalties)

**Total Demand**:
- Lollipop: 12 (have 10) ❌
- Chocolate: 8 (have 8) ✓
- Gummy Bears: 7 (have 6) ❌

**Strategic Decision**:
- Cannot satisfy everyone!
- **CRITICAL**: Don't give Gummy Bears to Child A (special = -2 pts loss if 2 given)
- **CRITICAL**: Don't give Chocolate to Child B or E
- Best strategy: Prioritize special children while avoiding their hated candies
- Must sacrifice 1-2 children completely
- Hate penalties make wrong allocations even more costly
- Optimal play earns ~25-30 points out of 46 possible (hate candy adds complexity)

---

## Expected Player Experience

### Rounds 1-3: Confidence Building
*"This is fun! I can make all the children happy!"*

### Rounds 4-7: Learning Value
*"Oh, special children give more points. I should remember that."*

### Rounds 8-12: Strategic Thinking
*"Wait, I don't have enough candy for everyone. Who should I prioritize?"*

### Rounds 13-15: Mastery Test
*"This is intense! I need to calculate the best allocation strategy!"*

---

## Success Metrics

### Excellent Performance
- Score 70%+ of maximum possible points
- Successfully prioritize special children in scarcity situations
- Minimize wasted candy

### Good Performance
- Score 50-70% of maximum possible points
- Balance between special and regular children
- Some suboptimal choices but consistent strategy

### Learning Opportunity
- Score <50% of maximum possible points
- Random allocation or poor prioritization
- Room to improve strategic thinking

---

## Game Balance Goals

1. **Engaging Progression**: Smooth difficulty curve from easy to challenging
2. **Strategic Depth**: Meaningful choices with no "always correct" answer
3. **Skill Expression**: Better players can significantly outscore average players
4. **Replayability**: Different strategies can work; encourages experimentation
5. **Fair Challenge**: Scarcity is predictable; players can plan if observant

---

## Implementation Notes

- Each round configuration follows this design philosophy
- Candy quantities carefully calculated to create intended scarcity levels
- Special children placed strategically to create interesting trade-offs
- Time limits adjusted to add appropriate pressure without frustration