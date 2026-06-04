import { buildGraph } from "./buildGraph";
import { greedyMatching } from "./greedyMatching";
import { localSearch } from "./localSearch";
import { assignSchedule } from "./scheduling";
import type { ComparisonRow, CourtSlot, Metrics, Parameters, ParetoPoint, ScheduledMatch, Team } from "../types";

export function calculateMetrics(schedule: ScheduledMatch[], teams: Team[], courtSlots: CourtSlot[], runtimeMs: number): Metrics {
  const totalProfit = schedule.reduce((sum, match) => sum + match.finalProfit, 0);
  const avgSkillGap = schedule.length ? schedule.reduce((sum, match) => sum + match.skillGap, 0) / schedule.length : 0;
  const matchedTeams = schedule.length * 2;
  const totalAvailableCourtSlots = courtSlots.filter((slot) => slot.available).length;

  return {
    totalProfit,
    avgSkillGap,
    matchedTeams,
    matchRate: teams.length ? matchedTeams / teams.length : 0,
    fillRate: totalAvailableCourtSlots ? schedule.length / totalAvailableCourtSlots : 0,
    runtimeMs,
    totalMatches: schedule.length,
  };
}

export function runPipeline(teams: Team[], courtSlots: CourtSlot[], parameters: Parameters) {
  const startedAt = performance.now();
  const edges = buildGraph(teams, parameters);
  const greedy = greedyMatching(edges);
  const matching = parameters.algorithmMode === "local" ? localSearch(greedy, edges) : greedy;
  const schedule = assignSchedule(matching, teams, courtSlots);
  const runtimeMs = performance.now() - startedAt;
  const metrics = calculateMetrics(schedule, teams, courtSlots, runtimeMs);

  return { edges, greedy, matching, schedule, metrics };
}

export function buildComparison(teams: Team[], courtSlots: CourtSlot[], parameters: Parameters): ComparisonRow[] {
  const greedy = runPipeline(teams, courtSlots, { ...parameters, algorithmMode: "greedy" });
  const local = runPipeline(teams, courtSlots, { ...parameters, algorithmMode: "local" });

  return [
    { name: "Greedy", totalProfit: greedy.metrics.totalProfit, avgSkillGap: Number(greedy.metrics.avgSkillGap.toFixed(2)), totalMatches: greedy.metrics.totalMatches },
    { name: "Local Search", totalProfit: local.metrics.totalProfit, avgSkillGap: Number(local.metrics.avgSkillGap.toFixed(2)), totalMatches: local.metrics.totalMatches },
  ];
}

export function generateParetoPoints(teams: Team[], courtSlots: CourtSlot[], parameters: Parameters): ParetoPoint[] {
  return [0, 0.1, 0.2, 0.36, 0.5, 0.75, 1.0].map((lambda) => {
    const result = runPipeline(teams, courtSlots, { ...parameters, lambda, algorithmMode: "local" });
    return {
      lambda,
      avgSkillGap: Number(result.metrics.avgSkillGap.toFixed(2)),
      totalProfit: result.metrics.totalProfit,
    };
  });
}
