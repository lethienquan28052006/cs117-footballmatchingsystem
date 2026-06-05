import type { Edge, Fee, Parameters, Team } from "../types";

export function buildGraph(teams: Team[], fees: Fee[], parameters: Parameters): Edge[] {
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

      const feasibleCosts = fees
        .filter((fee) => commonCourts.includes(fee.courtId) && commonSlots.includes(fee.slotId))
        .map((fee) => fee.operatingCost);

      if (!feasibleCosts.length) continue;

      const estimatedOperatingCost = Math.min(...feasibleCosts);
      const profit = teamA.willingnessToPay + teamB.willingnessToPay + 2 * parameters.matchingFee - estimatedOperatingCost;
      const score = Math.round(profit - parameters.lambda * skillGap * 100000);

      edges.push({ teamA: teamA.id, teamB: teamB.id, commonSlots, commonCourts, skillGap, profit, score });
    }
  }

  return edges.sort((a, b) => b.score - a.score);
}
