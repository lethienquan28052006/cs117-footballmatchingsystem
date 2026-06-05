import type { Edge, Fee, ScheduledMatch } from "../types";

export function assignSchedule(matching: Edge[], fees: Fee[]): ScheduledMatch[] {
  const usedCourtSlots = new Set<string>();
  const schedule: ScheduledMatch[] = [];

  for (const match of matching) {
    const feasible = fees
      .filter((fee) => match.commonCourts.includes(fee.courtId) && match.commonSlots.includes(fee.slotId) && !usedCourtSlots.has(`${fee.courtId}-${fee.slotId}`))
      .map((fee) => ({
        fee,
        profit: match.profit - fee.rentalFee,
      }))
      .sort((a, b) => b.profit - a.profit);

    const selected = feasible[0];
    if (!selected) continue;

    usedCourtSlots.add(`${selected.fee.courtId}-${selected.fee.slotId}`);
    schedule.push({
      teamA: match.teamA,
      teamB: match.teamB,
      courtId: selected.fee.courtId,
      slotId: selected.fee.slotId,
      skillGap: match.skillGap,
      score: match.score,
      profit: selected.profit,
    });
  }

  return schedule;
}
