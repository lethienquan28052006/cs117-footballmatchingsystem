import type { CourtSlot, Edge, Parameters, Team } from "../types";
import { SCALE_FACTOR } from "./constants";
import { netProfit } from "../utils/fee";

/**
 * SP2 — Build Compatibility Graph
 * 
 * Steps:
 *   1. Generate Feasible Edges: for each pair (i,j), find common slots & courts
 *   2. Compute Edge Weights: estimate profit (best net court-slot) − λ × gap × SCALE_FACTOR
 *   3. Filter Invalid Edges: reject pairs where |lᵢ−lⱼ| > Δmax (hard constraint)
 * 
 * For each pair (tᵢ, tⱼ) with skill lᵢ, lⱼ:
 *   - Common slots: Aᵢ ∩ Aⱼ (both can play)
 *   - Common courts: Bᵢ ∩ Bⱼ (both prefer)
 *   - Skill gap: Δ = |lᵢ − lⱼ|
 *   - Feasible court-slots: cs where cs.courtId ∈ Common courts, cs.slotId ∈ Common slots, cs.available
 *   - Max net profit: f* = max(netProfit(cs) for cs in feasible) or 0 if none
 *   - Estimated profit: profit(i,j) = f* + fm
 *   - Score: profit(i,j) − λ × Δ × SCALE_FACTOR
 * 
 * Output: Sorted edges by score (descending)
 */

export function buildGraph(teams: Team[], courtSlots: CourtSlot[], parameters: Parameters): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      const teamA = teams[i];
      const teamB = teams[j];
      
      // Step 1: Find common slots & courts
      const commonSlots = teamA.availableSlots.filter((slot) => teamB.availableSlots.includes(slot));
      const commonCourts = teamA.acceptableCourts.filter((court) => teamB.acceptableCourts.includes(court));
      const skillGap = Number(Math.abs(teamA.skill - teamB.skill).toFixed(1));

      // Step 3: Apply hard constraint Δmax
      if (!commonSlots.length || !commonCourts.length || skillGap > parameters.maxSkillGap) {
        continue;
      }

      // Step 2: Find feasible court-slots and max net profit
      const feasibleNets = courtSlots
        .filter((cs) => cs.available && commonCourts.includes(cs.courtId) && commonSlots.includes(cs.slotId))
        .map((cs) => netProfit(cs));

      if (!feasibleNets.length) continue;

      const maxNet = Math.max(...feasibleNets);
      const estimatedProfit = maxNet + parameters.matchingFee;
      const score = Math.round(estimatedProfit - parameters.lambda * skillGap * SCALE_FACTOR);

      edges.push({
        teamA: teamA.id,
        teamB: teamB.id,
        commonSlots,
        commonCourts,
        skillGap,
        estimatedProfit,
        score,
      });
    }
  }

  return edges.sort((a, b) => b.score - a.score);
}
