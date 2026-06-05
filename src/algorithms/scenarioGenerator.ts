import { allCourts, buildFees, daySlots, sampleTeams, weekSlots } from "../data/sampleData";
import type { Dataset, InputConfig, Parameters, ScenarioName, Team } from "../types";

const names = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
  "Kappa",
  "Lambda",
  "Mu",
  "Nu",
  "Xi",
  "Omicron",
  "Pi",
  "Rho",
  "Sigma",
  "Tau",
  "Upsilon",
  "Vega",
  "Aquila",
  "Orion",
  "Phoenix",
  "Atlas",
];

export const scenarioLabels: Record<ScenarioName, string> = {
  normal: "Normal Demand",
  highDemand: "High Demand",
  limitedAvailability: "Limited Availability",
  strictSkill: "Strict Skill Matching",
  profitOriented: "Profit-Oriented",
  fairnessOriented: "Fairness-Oriented",
};

export function scenarioParameters(scenario: ScenarioName): Partial<Parameters> {
  if (scenario === "strictSkill") return { maxSkillGap: 1.5 };
  if (scenario === "profitOriented") return { lambda: 0.05 };
  if (scenario === "fairnessOriented") return { lambda: 1.5, maxSkillGap: 2.5 };
  return {};
}

function pickMany<T>(items: T[], start: number, count: number): T[] {
  return Array.from({ length: Math.min(count, items.length) }, (_, index) => items[(start + index * 2) % items.length]);
}

export function generateDataset(config: InputConfig): Dataset {
  const courts = allCourts.slice(0, config.courtCount);
  const slots = config.period === "day" ? daySlots : weekSlots;
  const fees = buildFees(courts, slots);

  if (config.teamCount === 20 && config.courtCount === 3 && config.period === "day" && config.scenario === "normal") {
    return {
      courts,
      slots,
      fees,
      teams: sampleTeams.map((team) => ({
        ...team,
        availableSlots: [...team.availableSlots],
        acceptableCourts: [...team.acceptableCourts],
      })),
    };
  }

  const teams: Team[] = Array.from({ length: config.teamCount }, (_, index) => {
    const id = `T${String(index + 1).padStart(3, "0")}`;
    const clustered = config.scenario === "strictSkill" || config.scenario === "fairnessOriented";
    const skillBase = clustered ? 3 + (index % 5) * 1.25 : 1.5 + ((index * 1.37 + 3) % 8.2);
    const skill = Number(Math.min(10, skillBase + ((index % 3) - 1) * 0.25).toFixed(1));
    const slotCount = config.scenario === "limitedAvailability" ? 2 : config.scenario === "highDemand" ? Math.min(3, slots.length) : Math.min(config.period === "day" ? 3 : 8, slots.length);
    const courtCount = config.scenario === "limitedAvailability" ? 1 : Math.min(courts.length, index % 4 === 0 ? 1 : 2);
    const slotStart = (index * (config.scenario === "highDemand" ? 1 : 3)) % slots.length;
    const courtStart = index % courts.length;
    const willingnessBase = config.scenario === "profitOriented" || config.scenario === "highDemand" ? 380000 : 240000;
    const willingnessRange = config.scenario === "profitOriented" ? 520000 : 360000;

    return {
      id,
      name: `FC ${names[index % names.length]} ${index >= names.length ? index + 1 : ""}`.trim(),
      skill,
      availableSlots: pickMany(slots.map((slot) => slot.id), slotStart, slotCount),
      acceptableCourts: pickMany(courts.map((court) => court.id), courtStart, courtCount),
      willingnessToPay: willingnessBase + ((index * 37000) % willingnessRange),
    };
  });

  return { courts, slots, fees, teams };
}
