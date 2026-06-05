import { CalendarDays, Clock3, Goal, Landmark, Sigma, Trophy } from "lucide-react";
import type { Court, ScheduledMatch, TimeSlot } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  schedule: ScheduledMatch[];
  courts: Court[];
  slots: TimeSlot[];
};

export function ScheduleTable({ schedule, slots }: Props) {
  const slotOrder = new Map(slots.map((slot, index) => [slot.id, index]));
  const sortedSchedule = [...schedule].sort((a, b) => {
    const bySlot = (slotOrder.get(a.slotId) ?? 0) - (slotOrder.get(b.slotId) ?? 0);
    if (bySlot !== 0) return bySlot;
    return a.courtId.localeCompare(b.courtId);
  });
  const totalProfit = sortedSchedule.reduce((sum, match) => sum + match.profit, 0);
  const avgSkillGap = sortedSchedule.length ? sortedSchedule.reduce((sum, match) => sum + match.skillGap, 0) / sortedSchedule.length : 0;
  const bestProfit = sortedSchedule.reduce((max, match) => Math.max(max, match.profit), 0);

  const summaryCards = [
    { label: "Scheduled Matches", value: String(sortedSchedule.length), icon: Goal },
    { label: "Total Profit", value: formatVnd(totalProfit), icon: Trophy },
    { label: "Avg Skill Gap", value: avgSkillGap.toFixed(2), icon: Sigma },
  ];

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-black uppercase text-blue-900">
              <CalendarDays size={15} /> Optimized Schedule
            </div>
            <h2 className="mt-3 text-2xl font-black text-blue-950">Final Court Assignment</h2>
            <p className="mt-1 text-sm text-slate-500">
              {schedule.length ? `${schedule.length} matches assigned without court-slot conflicts.` : "Run optimization to create a schedule."}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              Profit = Rental Fee + Matching Fee
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
              Score = Profit - Alpha x Skill Gap x 100,000
            </div>
          </div>
        </div>

        {schedule.length > 0 && (
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-blue-900 shadow-sm">
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase text-slate-500">{card.label}</p>
                      <p className="truncate text-lg font-black text-blue-950" title={card.value}>
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {schedule.length ? (
        <div className="bg-slate-50 p-4">
          <div className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
            <div className="max-h-[560px] overflow-auto">
              <table className="w-full min-w-[1180px] table-fixed text-left text-sm">
                <colgroup>
                  <col className="w-[72px]" />
                  <col className="w-[180px]" />
                  <col className="w-[135px]" />
                  <col className="w-[150px]" />
                  <col className="w-[135px]" />
                  <col className="w-[135px]" />
                  <col className="w-[150px]" />
                  <col className="w-[105px]" />
                  <col className="w-[130px]" />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-blue-950 text-xs font-black uppercase tracking-wide text-white">
                  <tr>
                    <th className="px-4 py-4">#</th>
                    <th className="px-4 py-4">Match</th>
                    <th className="px-4 py-4">Court</th>
                    <th className="px-4 py-4">Time Slot</th>
                    <th className="px-4 py-4 text-right">Rental Fee</th>
                    <th className="px-4 py-4 text-right">Matching Fee</th>
                    <th className="px-4 py-4 text-right">Profit</th>
                    <th className="px-4 py-4 text-right">Skill Gap</th>
                    <th className="px-4 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {sortedSchedule.map((match, index) => {
                    const isBestProfit = match.profit === bestProfit;
                    return (
                      <tr key={`${match.teamA}-${match.teamB}-${match.courtId}-${match.slotId}`} className="bg-white transition-colors hover:bg-blue-50/50">
                        <td className="px-4 py-4 align-middle">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-black text-slate-700">{index + 1}</span>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-900">{match.teamA}</span>
                            <span className="text-xs font-bold text-slate-400">vs</span>
                            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-900">{match.teamB}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="inline-flex max-w-full items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 font-bold text-emerald-800">
                            <Landmark size={15} className="shrink-0" />
                            <span className="truncate" title={match.courtName}>{match.courtName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="inline-flex max-w-full items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5 font-bold text-amber-800">
                            <Clock3 size={15} className="shrink-0" />
                            <span className="truncate" title={match.slotLabel}>{match.slotLabel}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right align-middle font-semibold text-slate-700">{formatVnd(match.rentalFee)}</td>
                        <td className="px-4 py-4 text-right align-middle font-semibold text-slate-700">{formatVnd(match.matchingFee)}</td>
                        <td className="px-4 py-4 text-right align-middle">
                          <span className={`inline-flex justify-end rounded-lg px-2.5 py-1 font-black ${isBestProfit ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-900"}`}>
                            {formatVnd(match.profit)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right align-middle">
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-black text-blue-900">{match.skillGap.toFixed(1)}</span>
                        </td>
                        <td className="px-4 py-4 text-right align-middle font-black text-blue-950">{formatVnd(match.score)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid min-h-72 place-items-center bg-slate-50 p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-blue-100 text-blue-900">
              <CalendarDays size={28} />
            </div>
            <h3 className="mt-4 text-lg font-black text-blue-950">No schedule generated yet</h3>
            <p className="mt-2 text-sm text-slate-500">Choose a dataset and run optimization to assign each selected match to one feasible court and time slot.</p>
          </div>
        </div>
      )}
    </section>
  );
}
