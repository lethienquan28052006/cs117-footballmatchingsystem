import { buildGraph } from "./buildGraph";
import { greedyMatching } from "./greedyMatching";
import { localSearch } from "./localSearch";
import { assignSchedule } from "./scheduling";
import type { ComparisonRow, Dataset, GraphStats, Metrics, Parameters, ParetoPoint, ScheduledMatch } from "../types";

export function calculateMetrics(schedule: ScheduledMatch[], dataset: Dataset, runtimeMs: number): Metrics {
  const totalProfit = schedule.reduce((sum, match) => sum + match.profit, 0);
  const totalSkillGap = schedule.reduce((sum, match) => sum + match.skillGap, 0);
  const matchedTeams = schedule.length * 2;
  const totalCourtSlots = dataset.courts.length * dataset.slots.length;

  return {
    totalProfit,
    totalSkillGap,
    avgSkillGap: schedule.length ? totalSkillGap / schedule.length : 0,
    matchedTeams,
    matchRate: dataset.teams.length ? matchedTeams / dataset.teams.length : 0,
    courtUtilization: totalCourtSlots ? schedule.length / totalCourtSlots : 0,
    runtimeMs,
    totalMatches: schedule.length,
  };
}

export function calculateGraphStats(dataset: Dataset, edgesLength: number, matchingLength: number): GraphStats {
  return {
    vertices: dataset.teams.length,
    edges: edgesLength,
    averageDegree: dataset.teams.length ? (2 * edgesLength) / dataset.teams.length : 0,
    feasibleMatchCount: matchingLength,
  };
}

export function runPipeline(dataset: Dataset, parameters: Parameters, useLocalSearch = true) {
  const startedAt = performance.now();
  const edges = buildGraph(dataset.teams, dataset.fees, parameters);
  const greedy = greedyMatching(edges);
  const matching = useLocalSearch ? localSearch(greedy, edges) : greedy;
  const schedule = assignSchedule(matching, dataset.fees);
  const runtimeMs = performance.now() - startedAt;
  const metrics = calculateMetrics(schedule, dataset, runtimeMs);
  const graphStats = calculateGraphStats(dataset, edges.length, matching.length);

  return { edges, greedy, matching, schedule, metrics, graphStats };
}

export function buildComparison(dataset: Dataset, parameters: Parameters): ComparisonRow[] {
  const greedy = runPipeline(dataset, parameters, false);
  const local = runPipeline(dataset, parameters, true);

  return [
    { name: "Greedy", totalProfit: greedy.metrics.totalProfit, totalSkillGap: Number(greedy.metrics.totalSkillGap.toFixed(1)), matchCount: greedy.metrics.totalMatches },
    { name: "Local Search", totalProfit: local.metrics.totalProfit, totalSkillGap: Number(local.metrics.totalSkillGap.toFixed(1)), matchCount: local.metrics.totalMatches },
  ];
}

export function generateParetoPoints(dataset: Dataset, parameters: Parameters): ParetoPoint[] {
  return [0, 0.1, 0.2, 0.36, 0.5, 1.0, 2.0].map((lambda) => {
    const result = runPipeline(dataset, { ...parameters, lambda }, true);
    return {
      lambda,
      avgSkillGap: Number(result.metrics.avgSkillGap.toFixed(2)),
      totalProfit: result.metrics.totalProfit,
    };
  });
}
