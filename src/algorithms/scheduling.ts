import type { CourtSlot, Edge, ScheduledMatch, Team } from "../types";

export function assignSchedule(matching: Edge[], teams: Team[], courtSlots: CourtSlot[]): ScheduledMatch[] {
  const teamById = new Map(teams.map((team) => [team.id, team]));
  const usedCourtTimes = new Set<string>();
  const schedule: ScheduledMatch[] = [];

  // Assign the cheapest feasible court-time, preferring courts liked by both teams.
  for (const match of matching) {
    const teamA = teamById.get(match.teamA);
    const teamB = teamById.get(match.teamB);
    if (!teamA || !teamB) continue;

    const feasible = courtSlots
      .filter((slot) => slot.available && match.commonSlots.includes(slot.time) && !usedCourtTimes.has(`${slot.court}-${slot.time}`))
      .sort((a, b) => {
        const aPreferred = teamA.preferredCourts.includes(a.court) && teamB.preferredCourts.includes(a.court);
        const bPreferred = teamA.preferredCourts.includes(b.court) && teamB.preferredCourts.includes(b.court);
        if (aPreferred !== bPreferred) return aPreferred ? -1 : 1;
        return a.courtFee - b.courtFee;
      });

    const selected = feasible[0];
    if (!selected) continue;

    usedCourtTimes.add(`${selected.court}-${selected.time}`);
    schedule.push({
      ...match,
      court: selected.court,
      time: selected.time,
      finalProfit: match.estimatedProfit - selected.courtFee,
    });
  }

  return schedule;
}
