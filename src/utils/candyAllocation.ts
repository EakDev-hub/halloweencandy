import type { CandyType, AllocationInput, ChildAllocation } from '../types/game.types';

// ============================================================================
// V2.0 Functions - Request-based allocation
// ============================================================================

/**
 * Validate that allocations don't exceed available candy inventory
 *
 * @param initialCandies - Starting candy inventory
 * @param allocations - Player's allocations to all children
 * @returns Validation result with errors if any
 */
export function validateInventory(
  initialCandies: CandyType[],
  allocations: ChildAllocation[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Calculate total allocated per candy type across all children
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

/**
 * Calculate remaining candy after allocations
 *
 * @param initialCandies - Starting candy inventory
 * @param allocations - Player's allocations to all children
 * @returns Array of candies with updated quantities
 */
export function calculateRemainingCandies(
  initialCandies: CandyType[],
  allocations: ChildAllocation[]
): CandyType[] {
  // Calculate total allocated per candy type
  const allocatedTotals = new Map<string, number>();
  
  allocations.forEach(childAlloc => {
    childAlloc.allocatedCandies.forEach(candy => {
      const current = allocatedTotals.get(candy.candyName) || 0;
      allocatedTotals.set(candy.candyName, current + candy.quantity);
    });
  });
  
  // Return candies with remaining quantities
  return initialCandies.map(candy => ({
    ...candy,
    quantity: Math.max(0, candy.quantity - (allocatedTotals.get(candy.name) || 0))
  }));
}

/**
 * Get total candies allocated to a specific child
 *
 * @param allocation - Allocation for a child
 * @returns Total number of candies
 */
export function getTotalCandiesAllocated(allocation: ChildAllocation): number {
  return allocation.allocatedCandies.reduce(
    (sum, candy) => sum + candy.quantity,
    0
  );
}

/**
 * Check if player has allocated any candy
 *
 * @param allocations - All allocations
 * @returns true if any allocation has been made
 */
export function hasAnyAllocation(allocations: ChildAllocation[]): boolean {
  return allocations.some(alloc =>
    alloc.allocatedCandies.some(candy => candy.quantity > 0)
  );
}

// ============================================================================
// V1.0 Functions - Equal division (DEPRECATED)
// ============================================================================

/**
 * @deprecated Use scoringEngine.calculateChildScore instead (v2.0)
 *
 * Validates if the candy allocation is correct
 * Rule: Each candy type must be divided equally among children
 * If candies cannot be divided equally, allocation should be 0
 */
export function validateAllocation(
  candies: CandyType[],
  childrenCount: number,
  allocation: AllocationInput[]
): boolean {
  // Check if all candy types are accounted for
  if (allocation.length !== candies.length) {
    return false;
  }

  // Validate each candy type allocation
  return candies.every(candy => {
    const userAllocation = allocation.find(a => a.candyName === candy.name);
    
    if (!userAllocation) {
      return false;
    }

    // Calculate expected allocation per child
    const expectedPerChild = candy.quantity % childrenCount === 0
      ? candy.quantity / childrenCount
      : 0;

    return userAllocation.perChild === expectedPerChild;
  });
}

/**
 * @deprecated No longer used in v2.0
 *
 * Calculates the correct allocation for a given candy type
 */
export function calculateCorrectAllocation(
  quantity: number,
  childrenCount: number
): number {
  return quantity % childrenCount === 0 ? quantity / childrenCount : 0;
}

/**
 * @deprecated No longer used in v2.0
 *
 * Checks if a number can be divided equally
 */
export function canDivideEqually(
  quantity: number,
  childrenCount: number
): boolean {
  return quantity % childrenCount === 0;
}

/**
 * @deprecated No longer used in v2.0
 *
 * Gets the solution for a round
 */
export function getSolution(
  candies: CandyType[],
  childrenCount: number
): AllocationInput[] {
  return candies.map(candy => ({
    candyName: candy.name,
    perChild: calculateCorrectAllocation(candy.quantity, childrenCount)
  }));
}