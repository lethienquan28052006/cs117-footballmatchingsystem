export type Court = {
  id: string;
  name: string;
};

export type TimeSlot = {
  id: string;
  label: string;
};

export type Team = {
  id: string;
  name: string;
  skill: number;
  availableSlots: string[];
  acceptableCourts: string[];
};

export type CourtSlot = {
  courtId: string;
  courtName: string;
  slotId: string;
  slotLabel: string;
  rentalFee: number;
  operatingCost: number;  // Operating cost; netProfit = rentalFee - operatingCost
  available: boolean;
};

export type Dataset = {
  courts: Court[];
  slots: TimeSlot[];
  teams: Team[];
  courtSlots: CourtSlot[];
};

export type Edge = {
  teamA: string;
  teamB: string;
  commonSlots: string[];
  commonCourts: string[];
  skillGap: number;
  estimatedProfit: number;
  score: number;
};

export type ScheduledMatch = {
  teamA: string;
  teamB: string;
  courtId: string;
  courtName: string;
  slotId: string;
  slotLabel: string;
  rentalFee: number;
  matchingFee: number;
  skillGap: number;
  score: number;
  profit: number;
};

export type Parameters = {
  lambda: number;
  maxSkillGap: number;
  matchingFee: number;
};

export type InputConfig = {
  teamCount: 20 | 40 | 60 | 80 | 100;
  courtCount: 2 | 3 | 4 | 5;
  period: "day" | "week";
  scenario: ScenarioName;
};

export type ScenarioName = "normal" | "highDemand" | "limitedAvailability" | "strictSkill" | "profitOriented" | "fairnessOriented";

export type Metrics = {
  totalProfit: number;
  totalSkillGap: number;
  avgSkillGap: number;
  matchedTeams: number;
  matchRate: number;
  courtUtilization: number;
  runtimeMs: number;
  totalMatches: number;
};

export type GraphStats = {
  vertices: number;
  edges: number;
  averageDegree: number;
  feasibleMatchCount: number;
};

export type ComparisonRow = {
  name: string;
  totalProfit: number;
  totalSkillGap: number;
  matchCount: number;
};

export type ParetoPoint = {
  lambda: number;
  avgSkillGap: number;
  totalProfit: number;
};
