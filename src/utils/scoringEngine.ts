import type {
  Child,
  AllocatedCandy,
  ChildResult,
  RoundResult,
  ChildAllocation,
  CandyRequest,
  CandyType,
  DetailedScoreBreakdown
} from '../types/game.types';

/**
 * Points awarded for correct allocation to regular children (per candy)
 */
export const POINTS_REGULAR_CHILD = 1;

/**
 * Points awarded for correct allocation to special children (per candy)
 */
export const POINTS_SPECIAL_CHILD = 2;

/**
 * Points awarded for incorrect allocation (wrong type or amount) per candy
 */
export const POINTS_INCORRECT_PER_CANDY = 0.5;

/**
 * Penalty points per piece of hated candy
 */
export const POINTS_HATE_PENALTY = -1;

/**
 * Points awarded for no allocation
 */
export const POINTS_NONE = 0;

/**
 * Helper: Get candy emoji from available candies list
 */
function getCandyEmoji(candyName: string, availableCandies: CandyType[]): string {
  const candy = availableCandies.find(c => c.name === candyName);
  return candy?.emoji || '🍬';
}

/**
 * Helper: Calculate number of correctly allocated candies
 * Excludes hated candies (they only get penalty, not positive points)
 */
function calculateCorrectCandies(
  requests: CandyRequest[],
  allocation: AllocatedCandy[],
  hatedCandy?: string
): number {
  let correctCount = 0;
  
  for (const request of requests) {
    // Skip if this is a hated candy - it gets penalty only, not positive points
    if (hatedCandy && request.candyName === hatedCandy) {
      continue;
    }
    
    const allocated = allocation.find(a => a.candyName === request.candyName);
    if (allocated) {
      // Count the minimum of requested and allocated (matching portion)
      correctCount += Math.min(request.quantity, allocated.quantity);
    }
  }
  
  return correctCount;
}

/**
 * Helper: Calculate number of incorrectly allocated candies
 * Excludes hated candies (they get their own penalty)
 */
function calculateIncorrectCandies(
  allocation: AllocatedCandy[],
  requests: CandyRequest[],
  hatedCandy?: string
): number {
  let incorrectCount = 0;
  
  for (const alloc of allocation) {
    // Skip hate candies - they get their own penalty, not incorrect points
    if (hatedCandy && alloc.candyName === hatedCandy) {
      continue;
    }
    
    const request = requests.find(r => r.candyName === alloc.candyName);
    if (request) {
      // Excess beyond what was requested
      if (alloc.quantity > request.quantity) {
        incorrectCount += alloc.quantity - request.quantity;
      }
    } else {
      // Completely wrong candy type
      incorrectCount += alloc.quantity;
    }
  }
  
  return incorrectCount;
}

/**
 * Helper: Get count of hated candies given
 */
function getHatedCandyCount(
  allocation: AllocatedCandy[],
  hatedCandy?: string
): number {
  if (!hatedCandy) return 0;
  
  const hatedAllocation = allocation.find(a => a.candyName === hatedCandy);
  return hatedAllocation?.quantity || 0;
}

/**
 * Calculate points earned for allocating candies to a child
 *
 * Scoring rules:
 * - Exact match to requests: 1 point per candy (regular) or 2 points per candy (special)
 * - Partial/incorrect: 0.5 points per candy allocated
 * - Hated candy: -1 point per piece
 * - No allocation: 0 points
 *
 * @param child - The child receiving candy
 * @param allocation - What was allocated to this child
 * @param availableCandies - Available candy types for emoji lookup
 * @returns Score breakdown with points earned and detailed breakdown
 */
export function calculateChildScore(
  child: Child,
  allocation: AllocatedCandy[],
  availableCandies: CandyType[] = []
): ChildResult {
  const pointsPerCorrectCandy = child.isSpecial
    ? POINTS_SPECIAL_CHILD
    : POINTS_REGULAR_CHILD;
  
  // Calculate hate penalty first
  let hatePenalty = 0;
  if (child.hatedCandy) {
    const hatedAllocation = allocation.find(a => a.candyName === child.hatedCandy);
    if (hatedAllocation && hatedAllocation.quantity > 0) {
      hatePenalty = hatedAllocation.quantity * POINTS_HATE_PENALTY;
    }
  }
  
  // Calculate detailed breakdown
  const correctCandiesCount = calculateCorrectCandies(child.requests, allocation, child.hatedCandy);
  const incorrectCandiesCount = calculateIncorrectCandies(allocation, child.requests, child.hatedCandy);
  const hatedCandiesCount = getHatedCandyCount(allocation, child.hatedCandy);
  
  const correctPoints = correctCandiesCount * pointsPerCorrectCandy;
  const incorrectPoints = incorrectCandiesCount * POINTS_INCORRECT_PER_CANDY;
  const hatePenaltyPoints = hatedCandiesCount * POINTS_HATE_PENALTY;
  
  // Build detailed breakdown
  const breakdown: DetailedScoreBreakdown = {
    requested: child.requests.map(req => ({
      candyName: req.candyName,
      quantity: req.quantity,
      emoji: getCandyEmoji(req.candyName, availableCandies)
    })),
    allocated: allocation.map(alloc => ({
      candyName: alloc.candyName,
      quantity: alloc.quantity,
      emoji: getCandyEmoji(alloc.candyName, availableCandies)
    })),
    correctCandies: correctCandiesCount,
    incorrectCandies: incorrectCandiesCount,
    hatedCandiesGiven: hatedCandiesCount,
    correctPoints: correctPoints,
    incorrectPoints: incorrectPoints,
    hatePenaltyPoints: hatePenaltyPoints,
    totalPoints: correctPoints + incorrectPoints + hatePenaltyPoints,
    isSpecial: child.isSpecial,
    pointsPerCorrect: pointsPerCorrectCandy
  };
  
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
      hatePenalty: 0,
      breakdown
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
      pointsEarned: basePoints + hatePenalty,
      hatePenalty: hatePenalty,
      breakdown
    };
  }
  
  // Check if player gave something (even if wrong)
  const hasAllocation = allocation.length > 0 &&
    allocation.some(a => a.quantity > 0);
  
  if (hasAllocation) {
    // Use the detailed breakdown calculation:
    // - Full points for correct candies
    // - Partial points (0.5) for incorrect candies
    // - Penalty for hated candies
    const totalPoints = correctPoints + incorrectPoints + hatePenaltyPoints;
    return {
      childId: child.id,
      isCorrect: false,
      isPartial: true,
      pointsEarned: totalPoints,
      hatePenalty: hatePenalty,
      breakdown
    };
  }
  
  // No allocation: zero points
  return {
    childId: child.id,
    isCorrect: false,
    isPartial: false,
    pointsEarned: POINTS_NONE,
    hatePenalty: 0,
    breakdown
  };
}

/**
 * Check if allocation exactly matches child's requests
 * 
 * Rules:
 * - Must have same number of candy types
 * - Each candy type must match name and quantity exactly
 * 
 * @param requests - What the child wants
 * @param allocation - What was given to the child
 * @returns true if exact match, false otherwise
 */
function isAllocationExactMatch(
  requests: CandyRequest[],
  allocation: AllocatedCandy[]
): boolean {
  // Must have same number of candy types
  if (requests.length !== allocation.length) {
    return false;
  }
  
  // Every request must be matched exactly
  return requests.every(request => {
    const allocated = allocation.find(a => a.candyName === request.candyName);
    return allocated && allocated.quantity === request.quantity;
  });
}

/**
 * Calculate total score for a round based on all child allocations
 *
 * @param children - All children in the round
 * @param allocations - Allocations made by the player
 * @param availableCandies - Available candy types for detailed breakdown
 * @returns Round result with total points and per-child breakdown
 */
export function calculateRoundScore(
  children: Child[],
  allocations: ChildAllocation[],
  availableCandies: CandyType[] = []
): RoundResult {
  const childResults = children.map(child => {
    const allocation = allocations.find(a => a.childId === child.id);
    return calculateChildScore(
      child,
      allocation?.allocatedCandies || [],
      availableCandies
    );
  });
  
  const totalPoints = childResults.reduce(
    (sum, result) => sum + result.pointsEarned,
    0
  );
  
  return {
    roundNumber: 0, // Will be set by caller
    pointsEarned: totalPoints,
    childResults
  };
}

/**
 * Get maximum possible points for a round
 * 
 * @param children - All children in the round
 * @returns Maximum points achievable
 */
export function getMaxRoundPoints(children: Child[]): number {
  return children.reduce((sum, child) => {
    const candyCount = child.requests.reduce((total, req) => total + req.quantity, 0);
    const pointsPerCandy = child.isSpecial ? POINTS_SPECIAL_CHILD : POINTS_REGULAR_CHILD;
    return sum + (candyCount * pointsPerCandy);
  }, 0);
}

/**
 * Calculate percentage score for a round
 * 
 * @param roundResult - The round result
 * @param children - All children in the round
 * @returns Percentage (0-100)
 */
export function getRoundPercentage(
  roundResult: RoundResult,
  children: Child[]
): number {
  const maxPoints = getMaxRoundPoints(children);
  if (maxPoints === 0) return 0;
  return Math.round((roundResult.pointsEarned / maxPoints) * 100);
}

/**
 * Get a user-friendly feedback message based on round performance
 * 
 * @param percentage - Percentage score (0-100)
 * @returns Feedback message
 */
export function getRoundFeedback(percentage: number): string {
  if (percentage === 100) return '🎃 Perfect! All children got exactly what they wanted!';
  if (percentage >= 80) return '👻 Excellent! Almost perfect!';
  if (percentage >= 60) return '🦇 Good job! Most children are happy!';
  if (percentage >= 40) return '🕷️ Not bad! Keep trying!';
  if (percentage >= 20) return '💀 Some children got candy at least!';
  return '🎃 Better luck next time!';
}

/**
 * Count how many children received correct allocations
 * 
 * @param childResults - Results for all children
 * @returns Number of correct allocations
 */
export function countCorrectAllocations(childResults: ChildResult[]): number {
  return childResults.filter(r => r.isCorrect).length;
}

/**
 * Count how many children received partial/incorrect allocations
 * 
 * @param childResults - Results for all children
 * @returns Number of partial allocations
 */
export function countPartialAllocations(childResults: ChildResult[]): number {
  return childResults.filter(r => r.isPartial).length;
}

/**
 * Count how many children received nothing
 * 
 * @param childResults - Results for all children
 * @returns Number of children with no allocation
 */
export function countNoAllocations(childResults: ChildResult[]): number {
  return childResults.filter(r => !r.isCorrect && !r.isPartial).length;
}