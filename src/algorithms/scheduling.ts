import type { CourtSlot, Edge, Parameters, ScheduledMatch } from "../types";
import { SKILL_GAP_PENALTY_UNIT } from "./buildGraph";

export function assignSchedule(matching: Edge[], courtSlots: CourtSlot[], parameters: Parameters): ScheduledMatch[] {
  const usedCourtSlots = new Set<string>();
  const schedule: ScheduledMatch[] = [];

  for (const match of matching) {
    const feasible = courtSlots
      .filter((courtSlot) => courtSlot.available && match.commonCourts.includes(courtSlot.courtId) && match.commonSlots.includes(courtSlot.slotId) && !usedCourtSlots.has(`${courtSlot.courtId}-${courtSlot.slotId}`))
      .sort((a, b) => b.rentalFee - a.rentalFee);

    const selected = feasible[0];
    if (!selected) continue;

    const profit = selected.rentalFee + parameters.matchingFee;

    usedCourtSlots.add(`${selected.courtId}-${selected.slotId}`);
    schedule.push({
      teamA: match.teamA,
      teamB: match.teamB,
      courtId: selected.courtId,
      courtName: selected.courtName,
      slotId: selected.slotId,
      slotLabel: selected.slotLabel,
      rentalFee: selected.rentalFee,
      matchingFee: parameters.matchingFee,
      skillGap: match.skillGap,
      score: Math.round(profit - parameters.lambda * match.skillGap * SKILL_GAP_PENALTY_UNIT),
      profit,
    });
  }

  return schedule;
}
