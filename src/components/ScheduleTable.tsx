import { CalendarDays, Clock3, Goal, Landmark, Sigma, Trophy, HelpCircle } from "lucide-react";
import type { Court, ScheduledMatch, TimeSlot } from "../types";
import { formatVnd } from "../utils/format";
import { AVG_SKILL_GAP_TARGET } from "../algorithms/constants";

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
    { label: "Scheduled Matches", value: String(sortedSchedule.length), icon: Goal, tooltip: "Total matches assigned (SP4)" },
    { label: "Total Profit", value: formatVnd(totalProfit), icon: Trophy, tooltip: "Σ (netProfit + matchingFee)" },
    { label: "Avg Skill Gap", value: avgSkillGap.toFixed(2), icon: Sigma, tooltip: `Target ≤ ${AVG_SKILL_GAP_TARGET}` },
  ];

  const getSkillGapColor = (skillGap: number) => {
    if (skillGap <= 1.0) return "bg-emerald-50 text-emerald-900"; // Fair
    if (skillGap <= 2.0) return "bg-blue-50 text-blue-900"; // Acceptable
    return "bg-orange-50 text-orange-900"; // Large gap
  };

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-black uppercase text-blue-900">
              <CalendarDays size={15} /> SP4 — Court & Slot Assignment
            </div>
            <h2 className="mt-3 text-2xl font-black text-blue-950">Final Schedule</h2>
            <p className="mt-1 text-sm text-slate-500">
              {schedule.length ? `${schedule.length} matches assigned without court-slot conflicts.` : "Run optimization to create a schedule."}
            </p>
          </div>
          <div className="grid gap-2 text-xs">
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 font-bold text-blue-900 flex items-center gap-2">
              <HelpCircle size={14} />
              Profit = f(c,s) + fm
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-700 flex items-center gap-2">
              <HelpCircle size={14} />
              f(c,s) = rentalFee − operatingCost (net)
            </div>
          </div>
        </div>

        {schedule.length > 0 && (
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4 relative">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-blue-900 shadow-sm">
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-bold uppercase text-slate-500">{card.label}</p>
                        {card.tooltip && (
                          <div className="cursor-help" title={card.tooltip}>
                            <HelpCircle size={12} className="text-slate-400" />
                          </div>
                        )}
                      </div>
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
              <table className="w-full min-w-[1200px] table-fixed text-left text-sm">
                <colgroup>
                  <col className="w-[60px]" />
                  <col className="w-[150px]" />
                  <col className="w-[120px]" />
                  <col className="w-[140px]" />
                  <col className="w-[120px]" />
                  <col className="w-[120px]" />
                  <col className="w-[120px]" />
                  <col className="w-[110px]" />
                  <col className="w-[130px]" />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-blue-950 text-xs font-black uppercase tracking-wide text-white">
                  <tr>
                    <th className="px-4 py-4">#</th>
                    <th className="px-4 py-4">Match</th>
                    <th className="px-4 py-4">Court</th>
                    <th className="px-4 py-4">Time Slot</th>
                    <th className="px-4 py-4 text-right">Rental</th>
                    <th className="px-4 py-4 text-right">Fee</th>
                    <th className="px-4 py-4 text-right">Profit</th>
                    <th className="px-4 py-4 text-right">Gap</th>
                    <th className="px-4 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {sortedSchedule.map((match, index) => {
                    const isBestProfit = match.profit === bestProfit;
                    const skillGapBgColor = getSkillGapColor(match.skillGap);
                    return (
                      <tr key={`${match.teamA}-${match.teamB}-${match.courtId}-${match.slotId}`} className="bg-white transition-colors hover:bg-blue-50/50">
                        <td className="px-4 py-4 align-middle">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-black text-slate-700">{index + 1}</span>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-900 whitespace-nowrap">{match.teamA}</span>
                            <span className="text-xs font-bold text-slate-300">vs</span>
                            <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-900 whitespace-nowrap">{match.teamB}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 font-bold text-emerald-800 text-xs">
                            <Landmark size={13} /> {match.courtId}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 font-bold text-amber-800 text-xs">
                            <Clock3 size={13} /> {match.slotLabel}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right align-middle font-semibold text-slate-700 text-xs">{formatVnd(match.rentalFee)}</td>
                        <td className="px-4 py-4 text-right align-middle font-semibold text-slate-700 text-xs">{formatVnd(match.matchingFee)}</td>
                        <td className="px-4 py-4 text-right align-middle">
                          <span className={`inline-block rounded-lg px-2 py-1 font-black text-xs ${isBestProfit ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-900"}`}>
                            {formatVnd(match.profit)}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-right align-middle rounded px-2 py-1 font-bold text-xs ${skillGapBgColor}`}>
                          {match.skillGap.toFixed(1)}
                        </td>
                        <td className="px-4 py-4 text-right align-middle font-black text-blue-950 text-xs">{formatVnd(match.score)}</td>
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
            <h3 className="mt-4 text-lg font-black text-blue-950">No schedule yet</h3>
            <p className="mt-2 text-sm text-slate-500">Generate data and run optimization to assign matches to court-time slots.</p>
          </div>
        </div>
      )}
    </section>
  );
}
