import type { CandyType, AllocationInput } from '../types/game.types';

/**
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
 * Calculates the correct allocation for a given candy type
 */
export function calculateCorrectAllocation(
  quantity: number,
  childrenCount: number
): number {
  return quantity % childrenCount === 0 ? quantity / childrenCount : 0;
}

/**
 * Checks if a number can be divided equally
 */
export function canDivideEqually(
  quantity: number,
  childrenCount: number
): boolean {
  return quantity % childrenCount === 0;
}

/**
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