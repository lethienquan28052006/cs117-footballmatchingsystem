import type { Edge } from "../types";

export function greedyMatching(edges: Edge[]): Edge[] {
  const usedTeams = new Set<string>();
  const matching: Edge[] = [];

  // Greedy baseline: highest score edge wins if both teams are still free.
  for (const edge of [...edges].sort((a, b) => b.score - a.score)) {
    if (!usedTeams.has(edge.teamA) && !usedTeams.has(edge.teamB)) {
      matching.push(edge);
      usedTeams.add(edge.teamA);
      usedTeams.add(edge.teamB);
    }
  }

  return matching;
}
