import { CalendarDays, CircleDollarSign, Dumbbell, MapPin } from "lucide-react";
import type { Court, ScheduledMatch, TimeSlot } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  schedule: ScheduledMatch[];
  courts: Court[];
  slots: TimeSlot[];
};

export function ScheduleTable({ schedule, courts, slots }: Props) {
  const courtName = new Map(courts.map((court) => [court.id, court.name]));
  const slotLabel = new Map(slots.map((slot) => [slot.id, slot.label]));
  const slotOrder = new Map(slots.map((slot, index) => [slot.id, index]));
  const sortedSchedule = [...schedule].sort((a, b) => {
    const bySlot = (slotOrder.get(a.slotId) ?? 0) - (slotOrder.get(b.slotId) ?? 0);
    if (bySlot !== 0) return bySlot;
    return a.courtId.localeCompare(b.courtId);
  });

  const grouped = sortedSchedule.reduce<Record<string, ScheduledMatch[]>>((groups, match) => {
    groups[match.slotId] = [...(groups[match.slotId] ?? []), match];
    return groups;
  }, {});

  return (
    <section className="panel overflow-hidden xl:col-span-2">
      <div className="flex flex-col gap-3 border-b border-blue-100 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-950">Optimized Schedule</h2>
          <p className="text-sm text-slate-500">{schedule.length ? `${schedule.length} matches assigned without court-slot conflicts` : "Run optimization to create a schedule."}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
          <CalendarDays size={17} /> {courts.length} courts, {slots.length} slots
        </div>
      </div>

      {schedule.length ? (
        <div className="grid gap-4 p-4">
          {Object.entries(grouped).map(([slotId, matches]) => (
            <div key={slotId} className="rounded-lg border border-blue-100 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-blue-50 bg-blue-50/70 px-4 py-3">
                <h3 className="font-black text-blue-950">{slotLabel.get(slotId) ?? slotId}</h3>
                <span className="text-xs font-bold uppercase text-slate-500">{matches.length} match{matches.length === 1 ? "" : "es"}</span>
              </div>
              <div className="grid gap-3 p-3 md:grid-cols-2 xl:grid-cols-3">
                {matches.map((match) => (
                  <article key={`${match.teamA}-${match.teamB}-${match.courtId}-${match.slotId}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">Match</p>
                        <h4 className="mt-1 text-base font-black text-blue-950">
                          {match.teamA} <span className="text-slate-400">vs</span> {match.teamB}
                        </h4>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-900">{courtName.get(match.courtId) ?? match.courtId}</span>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <MapPin size={15} /> Court
                        </span>
                        <span className="font-bold text-slate-900">{courtName.get(match.courtId) ?? match.courtId}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <Dumbbell size={15} /> Skill Gap
                        </span>
                        <span className="font-bold text-slate-900">{match.skillGap.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-slate-600">
                          <CircleDollarSign size={15} /> Profit
                        </span>
                        <span className="font-black text-emerald-700">{formatVnd(match.profit)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid min-h-72 place-items-center p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-blue-100 text-blue-900">
              <CalendarDays size={28} />
            </div>
            <h3 className="mt-4 text-lg font-black text-blue-950">No schedule generated yet</h3>
            <p className="mt-2 text-sm text-slate-500">Choose a dataset and run optimization to assign every selected match to one feasible court and time slot.</p>
          </div>
        </div>
      )}
    </section>
  );
}
