import { courtNames, sampleTeams, slotTimes } from "../data/sampleData";
import type { Team } from "../types";

const names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Vega", "Aquila", "Orion", "Phoenix", "Atlas"];

export function generateTeams(count: number): Team[] {
  if (count === 20) {
    return sampleTeams.map((team) => ({ ...team, availableSlots: [...team.availableSlots], preferredCourts: [...team.preferredCourts] }));
  }

  return Array.from({ length: count }, (_, index) => {
    const id = `T${String(index + 1).padStart(2, "0")}`;
    const skill = Number((2 + ((index * 1.37 + 3) % 8)).toFixed(1));
    const slotOffset = index % slotTimes.length;
    const availableSlots = [slotTimes[slotOffset], slotTimes[(slotOffset + 2) % slotTimes.length], slotTimes[(slotOffset + 3) % slotTimes.length]];
    const preferredCourts = [courtNames[index % courtNames.length], courtNames[(index + 1) % courtNames.length]];
    const pay = 200000 + ((index * 37000) % 400000);

    return {
      id,
      name: `FC ${names[index % names.length]} ${index >= names.length ? index + 1 : ""}`.trim(),
      skill,
      availableSlots,
      preferredCourts,
      pay,
    };
  });
}
