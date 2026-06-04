import type { Edge } from "../types";

const edgeKey = (edge: Edge) => `${edge.teamA}-${edge.teamB}`;
const hasDuplicateTeams = (edges: Edge[]) => {
  const teams = new Set<string>();
  for (const edge of edges) {
    if (teams.has(edge.teamA) || teams.has(edge.teamB)) return true;
    teams.add(edge.teamA);
    teams.add(edge.teamB);
  }
  return false;
};

export function localSearch(initialMatching: Edge[], allEdges: Edge[], maxIterations = 50): Edge[] {
  let current = [...initialMatching];

  // 2-for-2 swap search: replace two selected matches if two alternatives improve total score.
  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    let improved = false;
    const currentKeys = new Set(current.map(edgeKey));

    for (let i = 0; i < current.length && !improved; i += 1) {
      for (let j = i + 1; j < current.length && !improved; j += 1) {
        const removed = [current[i], current[j]];
        const removedScore = removed[0].score + removed[1].score;
        const removedTeams = new Set(removed.flatMap((edge) => [edge.teamA, edge.teamB]));
        const candidates = allEdges.filter((edge) => !currentKeys.has(edgeKey(edge)) && removedTeams.has(edge.teamA) && removedTeams.has(edge.teamB));

        for (let a = 0; a < candidates.length && !improved; a += 1) {
          for (let b = a + 1; b < candidates.length && !improved; b += 1) {
            const replacement = [candidates[a], candidates[b]];
            const replacementScore = replacement[0].score + replacement[1].score;

            if (replacementScore > removedScore && !hasDuplicateTeams(replacement)) {
              const next = current.filter((_, index) => index !== i && index !== j).concat(replacement);
              if (!hasDuplicateTeams(next)) {
                current = next.sort((x, y) => y.score - x.score);
                improved = true;
              }
            }
          }
        }
      }
    }

    if (!improved) {
      break;
    }
  }

  return current;
}
