import type { Edge, Parameters, Team } from "../types";

export function buildGraph(teams: Team[], parameters: Pick<Parameters, "lambda" | "maxSkillGap" | "matchingFee">): Edge[] {
  const edges: Edge[] = [];

  // Compatibility graph: each valid team pair becomes a weighted edge.
  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      const teamA = teams[i];
      const teamB = teams[j];
      const commonSlots = teamA.availableSlots.filter((slot) => teamB.availableSlots.includes(slot));
      const skillGap = Number(Math.abs(teamA.skill - teamB.skill).toFixed(1));

      if (commonSlots.length === 0 || skillGap > parameters.maxSkillGap) {
        continue;
      }

      const estimatedProfit = teamA.pay + teamB.pay + 2 * parameters.matchingFee;
      const score = Math.round(estimatedProfit - parameters.lambda * skillGap * 100000);

      if (score > 0) {
        edges.push({ teamA: teamA.id, teamB: teamB.id, commonSlots, skillGap, estimatedProfit, score });
      }
    }
  }

  return edges.sort((a, b) => b.score - a.score);
}
