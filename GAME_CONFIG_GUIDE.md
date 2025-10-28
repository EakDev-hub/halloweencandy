# 🎃 Game Configuration File Guide

## Overview

The Halloween Candy Allocation Game uses a JSON configuration file to define all game rounds. This ensures that all players globally experience the same challenges and makes the game fair and consistent.

## File Location

The game configuration file should be placed at:
```
public/game-config.json
```

This location allows the file to be fetched by the frontend application.

## JSON Schema

The configuration file follows this structure:

```json
{
  "gameSettings": {
    "totalRounds": <number>,
    "timeLimitPerRound": <number>,
    "version": "<string>"
  },
  "rounds": [
    {
      "roundNumber": <number>,
      "timeLimit": <number>,
      "initialCandies": [
        {
          "name": "<string>",
          "quantity": <number>,
          "color": "<hex color>",
          "emoji": "<emoji>"
        }
      ],
      "children": [
        {
          "id": "<string>",
          "isSpecial": <boolean>,
          "emoji": "<emoji>",
          "requests": [
            {
              "candyName": "<string>",
              "quantity": <number>
            }
          ]
        }
      ]
    }
  ]
}
```

## Field Descriptions

### Game Settings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalRounds` | number | ✅ | Total number of rounds in the game |
| `timeLimitPerRound` | number | ✅ | Default time limit in seconds per round |
| `version` | string | ✅ | Config version for tracking (e.g., "2.0.0") |

### Round Configuration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roundNumber` | number | ✅ | Sequential round number (1-based) |
| `timeLimit` | number | ❌ | Override default time limit for this round |
| `initialCandies` | array | ✅ | Starting candy inventory for the round |
| `children` | array | ✅ | Children and their candy requests |

### Candy Definition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Candy type name (e.g., "Lollipop") |
| `quantity` | number | ✅ | How many of this candy you start with |
| `color` | string | ✅ | Hex color code (e.g., "#FF1493") |
| `emoji` | string | ✅ | Emoji representation (e.g., "🍭") |

### Child Definition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier (e.g., "child-1") |
| `isSpecial` | boolean | ✅ | Whether this is a special child (2x points) |
| `emoji` | string | ✅ | Visual representation ("👧" or "👦") |
| `requests` | array | ✅ | What candies this child wants |

### Candy Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `candyName` | string | ✅ | Must match a candy name from `initialCandies` |
| `quantity` | number | ✅ | How many of this candy the child wants |

## Complete Example Configuration

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
    },
    {
      "roundNumber": 2,
      "timeLimit": 35,
      "initialCandies": [
        { "name": "Candy Corn", "quantity": 15, "color": "#FFA500", "emoji": "🌽" },
        { "name": "Mint", "quantity": 10, "color": "#98FF98", "emoji": "🍬" },
        { "name": "Lemon Drop", "quantity": 8, "color": "#FFFF00", "emoji": "🍋" }
      ],
      "children": [
        {
          "id": "child-1",
          "isSpecial": false,
          "emoji": "👦",
          "requests": [
            { "candyName": "Candy Corn", "quantity": 5 }
          ]
        },
        {
          "id": "child-2",
          "isSpecial": false,
          "emoji": "👧",
          "requests": [
            { "candyName": "Mint", "quantity": 3 },
            { "candyName": "Lemon Drop", "quantity": 2 }
          ]
        },
        {
          "id": "child-3",
          "isSpecial": true,
          "emoji": "👦",
          "requests": [
            { "candyName": "Candy Corn", "quantity": 4 },
            { "candyName": "Mint", "quantity": 2 }
          ]
        },
        {
          "id": "child-4",
          "isSpecial": false,
          "emoji": "👧",
          "requests": [
            { "candyName": "Lemon Drop", "quantity": 3 }
          ]
        }
      ]
    },
    {
      "roundNumber": 3,
      "timeLimit": 45,
      "initialCandies": [
        { "name": "Lollipop", "quantity": 20, "color": "#FF1493", "emoji": "🍭" },
        { "name": "Chocolate", "quantity": 15, "color": "#8B4513", "emoji": "🍫" }
      ],
      "children": [
        {
          "id": "child-1",
          "isSpecial": true,
          "emoji": "👧",
          "requests": [
            { "candyName": "Lollipop", "quantity": 5 },
            { "candyName": "Chocolate", "quantity": 3 }
          ]
        },
        {
          "id": "child-2",
          "isSpecial": true,
          "emoji": "👦",
          "requests": [
            { "candyName": "Chocolate", "quantity": 4 },
            { "candyName": "Lollipop", "quantity": 2 }
          ]
        },
        {
          "id": "child-3",
          "isSpecial": false,
          "emoji": "👧",
          "requests": [
            { "candyName": "Lollipop", "quantity": 3 }
          ]
        }
      ]
    },
    {
      "roundNumber": 4,
      "timeLimit": 30,
      "initialCandies": [
        { "name": "Gummy Bears", "quantity": 18, "color": "#FF6347", "emoji": "🐻" },
        { "name": "Candy Corn", "quantity": 12, "color": "#FFA500", "emoji": "🌽" },
        { "name": "Mint", "quantity": 9, "color": "#98FF98", "emoji": "🍬" }
      ],
      "children": [
        {
          "id": "child-1",
          "isSpecial": false,
          "emoji": "👦",
          "requests": [
            { "candyName": "Gummy Bears", "quantity": 6 }
          ]
        },
        {
          "id": "child-2",
          "isSpecial": false,
          "emoji": "👧",
          "requests": [
            { "candyName": "Candy Corn", "quantity": 4 },
            { "candyName": "Mint", "quantity": 3 }
          ]
        },
        {
          "id": "child-3",
          "isSpecial": true,
          "emoji": "👦",
          "requests": [
            { "candyName": "Gummy Bears", "quantity": 4 },
            { "candyName": "Candy Corn", "quantity": 2 }
          ]
        }
      ]
    },
    {
      "roundNumber": 5,
      "timeLimit": 50,
      "initialCandies": [
        { "name": "Lollipop", "quantity": 25, "color": "#FF1493", "emoji": "🍭" },
        { "name": "Chocolate", "quantity": 20, "color": "#8B4513", "emoji": "🍫" },
        { "name": "Gummy Bears", "quantity": 15, "color": "#FF6347", "emoji": "🐻" },
        { "name": "Candy Corn", "quantity": 18, "color": "#FFA500", "emoji": "🌽" }
      ],
      "children": [
        {
          "id": "child-1",
          "isSpecial": true,
          "emoji": "👧",
          "requests": [
            { "candyName": "Lollipop", "quantity": 6 },
            { "candyName": "Chocolate", "quantity": 4 }
          ]
        },
        {
          "id": "child-2",
          "isSpecial": false,
          "emoji": "👦",
          "requests": [
            { "candyName": "Gummy Bears", "quantity": 5 },
            { "candyName": "Candy Corn", "quantity": 3 }
          ]
        },
        {
          "id": "child-3",
          "isSpecial": true,
          "emoji": "👧",
          "requests": [
            { "candyName": "Chocolate", "quantity": 5 },
            { "candyName": "Lollipop", "quantity": 3 },
            { "candyName": "Gummy Bears", "quantity": 2 }
          ]
        },
        {
          "id": "child-4",
          "isSpecial": false,
          "emoji": "👦",
          "requests": [
            { "candyName": "Candy Corn", "quantity": 6 },
            { "candyName": "Lollipop", "quantity": 2 }
          ]
        },
        {
          "id": "child-5",
          "isSpecial": false,
          "emoji": "👧",
          "requests": [
            { "candyName": "Chocolate", "quantity": 3 },
            { "candyName": "Gummy Bears", "quantity": 2 }
          ]
        }
      ]
    }
  ]
}
```

## Validation Rules

### Required Validations

1. **Unique Round Numbers**: Each round must have a unique `roundNumber` in sequence
2. **Valid Candy References**: All `candyName` in requests must exist in that round's `initialCandies`
3. **Positive Quantities**: All quantities must be > 0
4. **Unique Child IDs**: Each child ID must be unique within a round
5. **Valid Emojis**: Use appropriate emoji characters
6. **Hex Colors**: Colors must be valid hex format (e.g., "#FF0000")

### Recommended Validations

1. **Solvable Rounds**: Total requested candies should not exceed available inventory
2. **Balanced Difficulty**: Mix of special and regular children
3. **Variety**: Use different candy types across rounds
4. **Progressive Difficulty**: Later rounds can have more children or complex requests

## Scoring Reference

### Point Structure

| Scenario | Points Earned |
|----------|---------------|
| **Exact match (regular child)** | 1 point per candy |
| **Exact match (special child 👑)** | 2 points per candy |
| **Incorrect allocation** | 0.5 points |
| **No allocation** | 0 points |

### Example Scoring

**Round 1 from config above:**

- Child 1 (regular) wants: 2🍭 + 1🍫 = **3 points** if correct
- Child 2 (special 👑) wants: 3🐻 + 1🍭 = **8 points** if correct (4 candies × 2)
- Child 3 (regular) wants: 2🍫 + 2🐻 = **4 points** if correct

**Maximum possible:** 15 points  
**If all incorrect:** 1.5 points (0.5 × 3 children)  
**If all skipped:** 0 points

## Creating a Balanced Game

### Tips for Config Design

1. **Start Easy**: Round 1 should have 2-3 children with simple requests
2. **Progress Difficulty**: Add more children, complex requests, or reduce time
3. **Strategic Special Children**: Place 1-2 special children per round for bonus opportunities
4. **Inventory Management**: Ensure enough candies but require careful allocation
5. **Time Pressure**: Adjust `timeLimit` based on complexity

### Difficulty Levels

**Easy Round:**
- 2-3 children
- 1 special child max
- Simple requests (1-2 candy types each)
- 40-50 seconds
- Plenty of inventory

**Medium Round:**
- 3-4 children
- 1-2 special children
- Mixed requests (2-3 candy types)
- 35-40 seconds
- Tight inventory

**Hard Round:**
- 4-5 children
- 2 special children
- Complex requests (3+ candy types)
- 30-35 seconds
- Exact inventory matching

## Testing Your Config

### Manual Testing Checklist

- [ ] JSON is valid (use a JSON validator)
- [ ] All candy names match between `initialCandies` and `requests`
- [ ] Round numbers are sequential (1, 2, 3...)
- [ ] All children have unique IDs within their round
- [ ] Total requested candies ≤ initial inventory for each type
- [ ] Time limits are reasonable (20-60 seconds recommended)
- [ ] Mix of special and regular children
- [ ] Progressive difficulty across rounds

### Validation Tools

```bash
# Validate JSON syntax
npx jsonlint public/game-config.json

# Or use online validators:
# https://jsonlint.com/
# https://jsonformatter.curiousconcept.com/
```

## Common Mistakes to Avoid

❌ **Wrong candy names:**
```json
"requests": [
  { "candyName": "Lolipop", "quantity": 2 }  // Typo!
]
```

✅ **Correct:**
```json
"requests": [
  { "candyName": "Lollipop", "quantity": 2 }  // Matches initialCandies
]
```

❌ **Over-requesting:**
```json
"initialCandies": [
  { "name": "Chocolate", "quantity": 5, ... }
],
"children": [
  { "requests": [{ "candyName": "Chocolate", "quantity": 3 }] },
  { "requests": [{ "candyName": "Chocolate", "quantity": 4 }] }  // Total: 7 > 5
]
```

✅ **Correct:**
```json
"initialCandies": [
  { "name": "Chocolate", "quantity": 7, ... }  // Enough for both children
]
```

❌ **Missing required fields:**
```json
"children": [
  {
    "id": "child-1",
    "isSpecial": true
    // Missing: emoji, requests
  }
]
```

## Advanced Features

### Variable Time Limits

You can set different time limits per round:

```json
{
  "roundNumber": 1,
  "timeLimit": 50,  // Easy round: more time
  ...
},
{
  "roundNumber": 5,
  "timeLimit": 25,  // Hard round: less time
  ...
}
```

### Themed Rounds

Create themed rounds for variety:

```json
// "Chocolate Lovers" round
"initialCandies": [
  { "name": "Dark Chocolate", "quantity": 10, "color": "#3D2817", "emoji": "🍫" },
  { "name": "Milk Chocolate", "quantity": 12, "color": "#8B4513", "emoji": "🍫" },
  { "name": "White Chocolate", "quantity": 8, "color": "#F5DEB3", "emoji": "🍫" }
]
```

### Special Child Strategies

```json
// High-risk, high-reward: All special children
"children": [
  { "id": "child-1", "isSpecial": true, ... },
  { "id": "child-2", "isSpecial": true, ... },
  { "id": "child-3", "isSpecial": true, ... }
]

// Balanced: Mix of special and regular
"children": [
  { "id": "child-1", "isSpecial": false, ... },
  { "id": "child-2", "isSpecial": true, ... },
  { "id": "child-3", "isSpecial": false, ... },
  { "id": "child-4", "isSpecial": true, ... }
]
```

## File Size Considerations

- Recommended: 5-20 rounds
- Maximum: 50 rounds (file size ~50-100KB)
- Each round adds ~2-5KB depending on complexity
- Keep config file under 500KB for fast loading

## Versioning

Update the version field when making significant changes:

```json
"gameSettings": {
  "version": "2.1.0"  // Update when changing config
}
```

Version format: `MAJOR.MINOR.PATCH`
- **MAJOR**: Breaking changes to structure
- **MINOR**: New rounds or features
- **PATCH**: Bug fixes or adjustments

## Future Enhancements

Potential additions to the config format:

- Round themes/descriptions
- Bonus objectives
- Power-ups
- Environmental modifiers
- Seasonal variations
- Difficulty ratings per round

---

**Last Updated:** 2025-10-28  
**Config Version:** 2.0.0  
**Status:** Production Ready