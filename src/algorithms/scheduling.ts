import type { CourtSlot, Edge, Parameters, ScheduledMatch } from "../types";
import { SCALE_FACTOR } from "./constants";
import { netProfit } from "../utils/fee";

/**
 * SP4 — Court & Slot Assignment
 * 
 * For each match in the matching M:
 *   1. Find feasible court-slots: cs where cs.courtId ∈ commonCourts,
 *      cs.slotId ∈ commonSlots, cs.available, not yet used
 *   2. Greedy selection: pick cs with max netProfit (to maximize revenue)
 *   3. Mark cs as used (each court-slot used at most once)
 *   4. Compute final profit: f(c,s) + fm
 *   5. Compute final score: profit − λ × gap × SCALE_FACTOR
 */

export function assignSchedule(matching: Edge[], courtSlots: CourtSlot[], parameters: Parameters): ScheduledMatch[] {
  const usedCourtSlots = new Set<string>();
  const schedule: ScheduledMatch[] = [];

  for (const match of matching) {
    const feasible = courtSlots
      .filter(
        (cs) =>
          cs.available &&
          match.commonCourts.includes(cs.courtId) &&
          match.commonSlots.includes(cs.slotId) &&
          !usedCourtSlots.has(`${cs.courtId}-${cs.slotId}`),
      )
      .sort((a, b) => netProfit(b) - netProfit(a)); // Greedy: highest net profit first

    const selected = feasible[0];
    if (!selected) continue; // No available slot for this match

    const selectedNetProfit = netProfit(selected);
    const profit = selectedNetProfit + parameters.matchingFee;

    usedCourtSlots.add(`${selected.courtId}-${selected.slotId}`);
    schedule.push({
      teamA: match.teamA,
      teamB: match.teamB,
      courtId: selected.courtId,
      courtName: selected.courtName,
      slotId: selected.slotId,
      slotLabel: selected.slotLabel,
      rentalFee: selected.rentalFee,
      matchingFee: parameters.matchingFee,
      skillGap: match.skillGap,
      score: Math.round(profit - parameters.lambda * match.skillGap * SCALE_FACTOR),
      profit,
    });
  }

  return schedule;
}
