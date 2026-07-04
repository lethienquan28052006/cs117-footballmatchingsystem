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
import { SlotInputModal } from "./components/SlotInputModal";
import { TeamInputModal } from "./components/TeamInputModal";
import { TeamTable } from "./components/TeamTable";
import { OnboardingBanner } from "./components/OnboardingBanner";
import { PipelineView } from "./components/PipelineView";
import type { Court, CourtSlot, Dataset, Edge, InputConfig, Metrics, Parameters, ScheduledMatch, Team, TimeSlot } from "./types";

type PipelineStep = "SP1" | "SP2" | "SP3" | "SP4" | "SP5" | null;

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
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<PipelineStep>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<"SP1" | "SP2" | "SP3" | "SP4" | "SP5">>(new Set());

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

  const handleAddTeams = (teams: Team[]) => {
    setDataset((current) => ({ ...current, teams: [...current.teams, ...teams] }));
    clearResults();
  };

  const handleAddCourt = (court: Court) => {
    setDataset((current) => ({ ...current, courts: [...current.courts, court] }));
    clearResults();
  };

  const handleAddSlot = (slot: TimeSlot) => {
    setDataset((current) => ({
      ...current,
      slots: [...current.slots, slot].sort((a, b) => a.label.localeCompare(b.label)),
      courtSlots: [
        ...current.courtSlots,
        ...current.courts.flatMap((court) => [
          { 
            courtId: court.id, 
            courtName: court.name, 
            slotId: slot.id, 
            slotLabel: slot.label, 
            rentalFee: 250000,
            operatingCost: Math.round(250000 * 0.35),
            available: true 
          },
        ]),
      ],
    }));
    clearResults();
  };

  const handleAddFee = (courtSlot: CourtSlot) => {
    setDataset((current) => ({
      ...current,
      courtSlots: [...current.courtSlots.filter((item) => item.courtId !== courtSlot.courtId || item.slotId !== courtSlot.slotId), courtSlot].sort((a, b) => {
        const byCourt = a.courtId.localeCompare(b.courtId);
        return byCourt || a.slotId.localeCompare(b.slotId);
      }),
    }));
    clearResults();
  };

  const runOptimization = async () => {
    const steps: Array<"SP1" | "SP2" | "SP3" | "SP4" | "SP5"> = ["SP1", "SP2", "SP3", "SP4", "SP5"];
    setCompletedSteps(new Set());
    
    for (const step of steps) {
      setCurrentStep(step);
      await new Promise((resolve) => setTimeout(resolve, 150)); // Animate each step briefly
    }
    
    const result = runPipeline(dataset, parameters, true);
    setEdges(result.edges);
    setMatching(result.matching);
    setSchedule(result.schedule);
    setMetrics(result.metrics);
    
    setCompletedSteps(new Set(steps));
    setCurrentStep(null);
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      <OnboardingBanner />
      <div className="mx-auto grid max-w-[1540px] gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <Header />
        <PipelineView activeStep={currentStep} completedSteps={completedSteps} />
        <div className="grid gap-5 xl:grid-cols-[minmax(360px,1fr)_minmax(380px,0.85fr)]">
          <InputConfigPanel config={config} setConfig={setConfig} parameters={parameters} setParameters={setParameters} onGenerate={handleGenerate} />
          <ParameterPanel parameters={parameters} setParameters={setParameters} onRun={runOptimization} />
        </div>
        <ManualDataPanel onAddTeam={() => setIsTeamModalOpen(true)} onAddCourt={() => setIsCourtModalOpen(true)} onAddSlot={() => setIsSlotModalOpen(true)} onAddFee={() => setIsFeeModalOpen(true)} />
        <MetricsCards metrics={metrics} />
        <TeamTable teams={dataset.teams} courts={dataset.courts} slots={dataset.slots} />
        <div className="grid gap-5 2xl:grid-cols-[520px_minmax(0,1fr)]">
          <CourtSlotTable courtSlots={dataset.courtSlots} />
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
        onAddTeams={handleAddTeams}
      />
      <CourtInputModal isOpen={isCourtModalOpen} existingCourtIds={dataset.courts.map((court) => court.id)} onClose={() => setIsCourtModalOpen(false)} onAddCourt={handleAddCourt} />
      <SlotInputModal isOpen={isSlotModalOpen} existingSlotIds={dataset.slots.map((slot) => slot.id)} onClose={() => setIsSlotModalOpen(false)} onAddSlot={handleAddSlot} />
      <FeeInputModal isOpen={isFeeModalOpen} courts={dataset.courts} slots={dataset.slots} courtSlots={dataset.courtSlots} onClose={() => setIsFeeModalOpen(false)} onAddFee={handleAddFee} />
    </main>
  );
}
