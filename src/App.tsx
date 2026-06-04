import { useMemo, useState } from "react";
import { buildComparison, generateParetoPoints, runPipeline } from "./algorithms/metrics";
import { generateTeams } from "./algorithms/scenarioGenerator";
import { sampleCourtSlots, sampleTeams } from "./data/sampleData";
import { ComparisonChart } from "./components/ComparisonChart";
import { CourtSlotTable } from "./components/CourtSlotTable";
import { EdgeTable } from "./components/EdgeTable";
import { Header } from "./components/Header";
import { MetricsCards } from "./components/MetricsCards";
import { ParameterPanel } from "./components/ParameterPanel";
import { ParetoChart } from "./components/ParetoChart";
import { PipelineView } from "./components/PipelineView";
import { ScheduleTable } from "./components/ScheduleTable";
import { TeamTable } from "./components/TeamTable";
import type { ComparisonRow, Edge, Metrics, Parameters, ParetoPoint, ScheduledMatch, Team } from "./types";

const defaultParameters: Parameters = {
  lambda: 0.36,
  maxSkillGap: 3,
  matchingFee: 50000,
  algorithmMode: "local",
};

const completedPipeline = ["Start", "Input", "Build Graph", "Calculate Score", "Filter Edges", "Greedy", "Local Search", "Schedule", "Evaluation"];

export default function App() {
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [parameters, setParameters] = useState<Parameters>(defaultParameters);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [schedule, setSchedule] = useState<ScheduledMatch[]>([]);
  const [metrics, setMetrics] = useState<Metrics>();
  const [comparison, setComparison] = useState<ComparisonRow[]>([]);
  const [pareto, setPareto] = useState<ParetoPoint[]>([]);
  const [pipelineSteps, setPipelineSteps] = useState<string[]>(["Start", "Input"]);

  const courtSlots = useMemo(() => sampleCourtSlots, []);

  const runOptimization = () => {
    const result = runPipeline(teams, courtSlots, parameters);
    setEdges(result.edges);
    setSchedule(result.schedule);
    setMetrics(result.metrics);
    setComparison(buildComparison(teams, courtSlots, parameters));
    setPipelineSteps(completedPipeline.filter((step) => parameters.algorithmMode === "local" || step !== "Local Search"));
  };

  const runPareto = () => {
    setPareto(generateParetoPoints(teams, courtSlots, parameters));
  };

  const handleGenerate = (count: number) => {
    setTeams(generateTeams(count));
    clearResults();
  };

  const handleReset = () => {
    setTeams(sampleTeams);
    setParameters(defaultParameters);
    clearResults();
  };

  const clearResults = () => {
    setEdges([]);
    setSchedule([]);
    setMetrics(undefined);
    setComparison([]);
    setPareto([]);
    setPipelineSteps(["Start", "Input"]);
  };

  return (
    <main className="min-h-screen bg-[#f5f8fc]">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <Header />
        <PipelineView completedSteps={pipelineSteps} />
        <MetricsCards metrics={metrics} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <TeamTable teams={teams} onGenerate={handleGenerate} onReset={handleReset} />
          <div className="grid content-start gap-5">
            <ParameterPanel parameters={parameters} setParameters={setParameters} onRun={runOptimization} onPareto={runPareto} />
            <CourtSlotTable courtSlots={courtSlots} />
          </div>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <EdgeTable edges={edges} />
          <ScheduleTable schedule={schedule} />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <ComparisonChart data={comparison} />
          <ParetoChart data={pareto} />
        </div>
      </div>
    </main>
  );
}
