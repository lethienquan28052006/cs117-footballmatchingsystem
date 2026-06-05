import { useState } from "react";
import { runPipeline } from "./algorithms/metrics";
import { generateDataset } from "./algorithms/scenarioGenerator";
import { sampleDataset } from "./data/sampleData";
import { CourtInputModal } from "./components/CourtInputModal";
import { CourtSlotTable } from "./components/CourtSlotTable";
import { EdgeTable } from "./components/EdgeTable";
import { FeeInputModal } from "./components/FeeInputModal";
import { Header } from "./components/Header";
import { InputConfigPanel } from "./components/InputConfigPanel";
import { ManualDataPanel } from "./components/ManualDataPanel";
import { MetricsCards } from "./components/MetricsCards";
import { ParameterPanel } from "./components/ParameterPanel";
import { ScheduleTable } from "./components/ScheduleTable";
import { TeamInputModal } from "./components/TeamInputModal";
import { TeamTable } from "./components/TeamTable";
import type { Court, Dataset, Edge, Fee, InputConfig, Metrics, Parameters, ScheduledMatch, Team } from "./types";

const defaultParameters: Parameters = {
  lambda: 0.36,
  maxSkillGap: 3,
  matchingFee: 50000,
};

const defaultConfig: InputConfig = {
  teamCount: 20,
  courtCount: 3,
  period: "day",
  scenario: "normal",
};

export default function App() {
  const [config, setConfig] = useState<InputConfig>(defaultConfig);
  const [parameters, setParameters] = useState<Parameters>(defaultParameters);
  const [dataset, setDataset] = useState<Dataset>(sampleDataset);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [matching, setMatching] = useState<Edge[]>([]);
  const [schedule, setSchedule] = useState<ScheduledMatch[]>([]);
  const [metrics, setMetrics] = useState<Metrics>();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  const clearResults = () => {
    setEdges([]);
    setMatching([]);
    setSchedule([]);
    setMetrics(undefined);
  };

  const handleGenerate = () => {
    setDataset(generateDataset(config));
    clearResults();
  };

  const handleAddTeam = (team: Team) => {
    setDataset((current) => ({ ...current, teams: [...current.teams, team] }));
    clearResults();
  };

  const handleAddCourt = (court: Court) => {
    setDataset((current) => ({ ...current, courts: [...current.courts, court] }));
    clearResults();
  };

  const handleAddFee = (fee: Fee) => {
    setDataset((current) => ({
      ...current,
      fees: [...current.fees.filter((item) => item.courtId !== fee.courtId || item.slotId !== fee.slotId), fee].sort((a, b) => {
        const byCourt = a.courtId.localeCompare(b.courtId);
        return byCourt || a.slotId.localeCompare(b.slotId);
      }),
    }));
    clearResults();
  };

  const runOptimization = () => {
    const result = runPipeline(dataset, parameters, true);
    setEdges(result.edges);
    setMatching(result.matching);
    setSchedule(result.schedule);
    setMetrics(result.metrics);
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto grid max-w-[1540px] gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <Header />
        <div className="grid gap-5 xl:grid-cols-[minmax(360px,1fr)_minmax(380px,0.85fr)]">
          <InputConfigPanel config={config} setConfig={setConfig} parameters={parameters} setParameters={setParameters} onGenerate={handleGenerate} />
          <ParameterPanel parameters={parameters} setParameters={setParameters} onRun={runOptimization} />
        </div>
        <ManualDataPanel onAddTeam={() => setIsTeamModalOpen(true)} onAddCourt={() => setIsCourtModalOpen(true)} onAddFee={() => setIsFeeModalOpen(true)} />
        <MetricsCards metrics={metrics} />
        <TeamTable teams={dataset.teams} courts={dataset.courts} slots={dataset.slots} />
        <div className="grid gap-5 2xl:grid-cols-[520px_minmax(0,1fr)]">
          <CourtSlotTable courts={dataset.courts} slots={dataset.slots} fees={dataset.fees} />
          <EdgeTable edges={matching.length ? matching : edges} courts={dataset.courts} slots={dataset.slots} />
        </div>
        <ScheduleTable schedule={schedule} courts={dataset.courts} slots={dataset.slots} />
      </div>
      <TeamInputModal
        isOpen={isTeamModalOpen}
        courts={dataset.courts}
        slots={dataset.slots}
        existingTeamIds={dataset.teams.map((team) => team.id)}
        onClose={() => setIsTeamModalOpen(false)}
        onAddTeam={handleAddTeam}
      />
      <CourtInputModal isOpen={isCourtModalOpen} existingCourtIds={dataset.courts.map((court) => court.id)} onClose={() => setIsCourtModalOpen(false)} onAddCourt={handleAddCourt} />
      <FeeInputModal isOpen={isFeeModalOpen} courts={dataset.courts} slots={dataset.slots} fees={dataset.fees} onClose={() => setIsFeeModalOpen(false)} onAddFee={handleAddFee} />
    </main>
  );
}
