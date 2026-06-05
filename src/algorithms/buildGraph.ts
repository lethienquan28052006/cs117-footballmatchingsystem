import type { CourtSlot, Edge, Parameters, Team } from "../types";

export const SKILL_GAP_PENALTY_UNIT = 100000;

export function buildGraph(teams: Team[], courtSlots: CourtSlot[], parameters: Parameters): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      const teamA = teams[i];
      const teamB = teams[j];
      const commonSlots = teamA.availableSlots.filter((slot) => teamB.availableSlots.includes(slot));
      const commonCourts = teamA.acceptableCourts.filter((court) => teamB.acceptableCourts.includes(court));
      const skillGap = Number(Math.abs(teamA.skill - teamB.skill).toFixed(1));

      if (!commonSlots.length || !commonCourts.length || skillGap > parameters.maxSkillGap) {
        continue;
      }

      const feasibleRentalFees = courtSlots
        .filter((courtSlot) => courtSlot.available && commonCourts.includes(courtSlot.courtId) && commonSlots.includes(courtSlot.slotId))
        .map((courtSlot) => courtSlot.rentalFee);

      if (!feasibleRentalFees.length) continue;

      const estimatedRentalFee = Math.max(...feasibleRentalFees);
      const estimatedProfit = estimatedRentalFee + parameters.matchingFee;
      const score = Math.round(estimatedProfit - parameters.lambda * skillGap * SKILL_GAP_PENALTY_UNIT);

      edges.push({ teamA: teamA.id, teamB: teamB.id, commonSlots, commonCourts, skillGap, estimatedProfit, score });
    }
  }

  return edges.sort((a, b) => b.score - a.score);
}
