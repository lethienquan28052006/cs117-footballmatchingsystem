export type Team = {
  id: string;
  name: string;
  skill: number;
  availableSlots: string[];
  preferredCourts: string[];
  pay: number;
};

export type CourtSlot = {
  court: string;
  time: string;
  courtFee: number;
  available: boolean;
};

export type Edge = {
  teamA: string;
  teamB: string;
  commonSlots: string[];
  skillGap: number;
  estimatedProfit: number;
  score: number;
};

export type ScheduledMatch = {
  teamA: string;
  teamB: string;
  court: string;
  time: string;
  skillGap: number;
  score: number;
  estimatedProfit: number;
  finalProfit: number;
};

export type Parameters = {
  lambda: number;
  maxSkillGap: number;
  matchingFee: number;
  algorithmMode: "greedy" | "local";
};

export type Metrics = {
  totalProfit: number;
  avgSkillGap: number;
  matchedTeams: number;
  matchRate: number;
  fillRate: number;
  runtimeMs: number;
  totalMatches: number;
};

export type ComparisonRow = {
  name: string;
  totalProfit: number;
  avgSkillGap: number;
  totalMatches: number;
};

export type ParetoPoint = {
  lambda: number;
  avgSkillGap: number;
  totalProfit: number;
};
