import type { GameConfig } from '../types/game.types';

/**
 * Load and validate game configuration from JSON file
 * @returns Validated game configuration
 * @throws Error if config cannot be loaded or is invalid
 */
export async function loadGameConfig(): Promise<GameConfig> {
  try {
    const response = await fetch('/game-config.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load game config: ${response.statusText}`);
    }
    
    const config: GameConfig = await response.json();
    validateGameConfig(config);
    
    return config;
  } catch (error) {
    console.error('Error loading game config:', error);
    throw new Error(
      'Failed to load game configuration. Please check that game-config.json exists and is valid.'
    );
  }
}

/**
 * Validate game configuration structure and data
 * @param config - Configuration to validate
 * @throws Error if validation fails
 */
function validateGameConfig(config: GameConfig): void {
  // Validate top-level structure
  if (!config.gameSettings || !config.rounds) {
    throw new Error('Invalid config structure: missing gameSettings or rounds');
  }
  
  // Validate game settings
  const { totalRounds, timeLimitPerRound, version } = config.gameSettings;
  
  if (!totalRounds || totalRounds <= 0) {
    throw new Error('Invalid totalRounds: must be > 0');
  }
  
  if (!timeLimitPerRound || timeLimitPerRound <= 0) {
    throw new Error('Invalid timeLimitPerRound: must be > 0');
  }
  
  if (!version) {
    throw new Error('Missing version in gameSettings');
  }
  
  // Validate rounds array
  if (!Array.isArray(config.rounds) || config.rounds.length === 0) {
    throw new Error('Config must have at least one round');
  }
  
  if (config.rounds.length !== totalRounds) {
    throw new Error(
      `Round count mismatch: gameSettings.totalRounds is ${totalRounds} but found ${config.rounds.length} rounds`
    );
  }
  
  // Validate each round
  config.rounds.forEach((round, index) => {
    const expectedRoundNumber = index + 1;
    
    // Validate round number
    if (round.roundNumber !== expectedRoundNumber) {
      throw new Error(
        `Round ${index + 1} has incorrect roundNumber: expected ${expectedRoundNumber}, got ${round.roundNumber}`
      );
    }
    
    // Validate time limit
    if (!round.timeLimit || round.timeLimit <= 0) {
      throw new Error(`Round ${round.roundNumber}: timeLimit must be > 0`);
    }
    
    // Validate initial candies
    if (!Array.isArray(round.initialCandies) || round.initialCandies.length === 0) {
      throw new Error(`Round ${round.roundNumber}: must have at least one candy type`);
    }
    
    // Validate each candy
    round.initialCandies.forEach(candy => {
      if (!candy.name || typeof candy.name !== 'string') {
        throw new Error(`Round ${round.roundNumber}: candy must have a valid name`);
      }
      if (!candy.quantity || candy.quantity <= 0) {
        throw new Error(`Round ${round.roundNumber}: ${candy.name} quantity must be > 0`);
      }
      if (!candy.color || !candy.color.match(/^#[0-9A-Fa-f]{6}$/)) {
        throw new Error(`Round ${round.roundNumber}: ${candy.name} must have valid hex color`);
      }
      if (!candy.emoji) {
        throw new Error(`Round ${round.roundNumber}: ${candy.name} must have an emoji`);
      }
    });
    
    // Validate children
    if (!Array.isArray(round.children) || round.children.length === 0) {
      throw new Error(`Round ${round.roundNumber}: must have at least one child`);
    }
    
    // Create set of available candy names for validation
    const candyNames = new Set(round.initialCandies.map(c => c.name));
    const childIds = new Set<string>();
    
    // Validate each child
    round.children.forEach(child => {
      // Validate child ID uniqueness
      if (!child.id || typeof child.id !== 'string') {
        throw new Error(`Round ${round.roundNumber}: child must have a valid id`);
      }
      
      if (childIds.has(child.id)) {
        throw new Error(`Round ${round.roundNumber}: duplicate child id "${child.id}"`);
      }
      childIds.add(child.id);
      
      // Validate isSpecial field
      if (typeof child.isSpecial !== 'boolean') {
        throw new Error(`Round ${round.roundNumber}: child ${child.id} must have boolean isSpecial field`);
      }
      
      // Validate emoji
      if (!child.emoji) {
        throw new Error(`Round ${round.roundNumber}: child ${child.id} must have an emoji`);
      }
      
      // Validate requests
      if (!Array.isArray(child.requests) || child.requests.length === 0) {
        throw new Error(`Round ${round.roundNumber}: child ${child.id} must have at least one request`);
      }
      
      // Validate each request
      child.requests.forEach(request => {
        if (!request.candyName || typeof request.candyName !== 'string') {
          throw new Error(
            `Round ${round.roundNumber}: child ${child.id} has invalid request candyName`
          );
        }
        
        if (!candyNames.has(request.candyName)) {
          throw new Error(
            `Round ${round.roundNumber}: child ${child.id} requests unknown candy "${request.candyName}"`
          );
        }
        
        if (!request.quantity || request.quantity <= 0) {
          throw new Error(
            `Round ${round.roundNumber}: child ${child.id} request for ${request.candyName} must have quantity > 0`
          );
        }
      });
    });
    
    // Optional: Warn if total requests exceed inventory (not error, just warning)
    const requestTotals = new Map<string, number>();
    round.children.forEach(child => {
      child.requests.forEach(request => {
        const current = requestTotals.get(request.candyName) || 0;
        requestTotals.set(request.candyName, current + request.quantity);
      });
    });
  });
}

/**
 * Get configuration version
 * @param config - Game configuration
 * @returns Version string
 */
export function getConfigVersion(config: GameConfig): string {
  return config.gameSettings.version;
}

/**
 * Check if configuration is compatible with current game version
 * @param config - Game configuration
 * @returns true if compatible
 */
export function isConfigCompatible(config: GameConfig): boolean {
  const version = getConfigVersion(config);
  const majorVersion = parseInt(version.split('.')[0]);
  
  // We support v2.x configs
  return majorVersion === 2;
}