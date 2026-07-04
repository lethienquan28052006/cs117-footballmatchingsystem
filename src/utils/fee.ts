import type { CourtSlot } from "../types";

/**
 * Calculate net profit of a court-slot:
 * netProfit(c,s) = r(c,s) - cost(c,s)
 * where r = rentalFee (revenue), cost = operatingCost
 */
export function netProfit(courtSlot: CourtSlot): number {
  return courtSlot.rentalFee - courtSlot.operatingCost;
}

/**
 * Check if a court-slot has positive net profit
 */
export function isProfitable(courtSlot: CourtSlot): boolean {
  return netProfit(courtSlot) > 0;
}
