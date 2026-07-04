import type { Court, Edge, TimeSlot } from "../types";
import { formatVnd } from "../utils/format";
import { HelpCircle } from "lucide-react";

type Props = {
  edges: Edge[];
  courts: Court[];
  slots: TimeSlot[];
};

const columnTooltips: Record<string, string> = {
  skill_gap: "Absolute difference in skill levels (hard constraint: ≤ Δmax)",
  est_profit: "Max net court-slot profit + matching fee = f(c*,s*) + fm",
  score: "Profit − λ × SkillGap × SCALE_FACTOR (100,000)",
};

export function EdgeTable({ edges, courts, slots }: Props) {
  const courtName = new Map(courts.map((court) => [court.id, court.name]));
  const slotLabel = new Map(slots.map((slot) => [slot.id, slot.label]));

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Edge Table (SP2 – Compatibility Graph)</h2>
        <p className="text-sm text-slate-500">
          {edges.length ? `Showing top ${Math.min(20, edges.length)} of ${edges.length} feasible edges sorted by score` : "Run optimization to build the compatibility graph"}
        </p>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[1000px] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[90px]" />
            <col className="w-[90px]" />
            <col />
            <col className="w-[200px]" />
            <col className="w-[110px]" />
            <col className="w-[140px]" />
            <col className="w-[140px]" />
          </colgroup>
          <thead className="table-head sticky top-0">
            <tr className="bg-blue-50">
              <th className="px-4 py-3">Team A</th>
              <th className="px-4 py-3">Team B</th>
              <th className="px-4 py-3">Common Slots</th>
              <th className="px-4 py-3">Common Courts</th>
              <th className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 cursor-help" title={columnTooltips.skill_gap}>
                  Skill Gap
                  <HelpCircle size={14} className="text-slate-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 cursor-help" title={columnTooltips.est_profit}>
                  Est. Profit
                  <HelpCircle size={14} className="text-slate-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 cursor-help" title={columnTooltips.score}>
                  Score
                  <HelpCircle size={14} className="text-slate-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {edges.slice(0, 20).map((edge, idx) => (
              <tr key={`${edge.teamA}-${edge.teamB}`} className={`border-t border-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/50"}`}>
                <td className="px-4 py-3 font-bold text-blue-900">{edge.teamA}</td>
                <td className="px-4 py-3 font-bold text-blue-900">{edge.teamB}</td>
                <td className="truncate px-4 py-3 text-slate-600" title={edge.commonSlots.map((slot) => slotLabel.get(slot) ?? slot).join(", ")}>
                  {edge.commonSlots.map((slot) => slotLabel.get(slot) ?? slot).join(", ")}
                </td>
                <td className="truncate px-4 py-3 text-slate-600" title={edge.commonCourts.map((court) => courtName.get(court) ?? court).join(", ")}>
                  {edge.commonCourts.map((court) => courtName.get(court) ?? court).join(", ")}
                </td>
                <td className="px-4 py-3 text-right text-slate-700">{edge.skillGap.toFixed(1)}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatVnd(edge.estimatedProfit)}</td>
                <td className="px-4 py-3 text-right font-black text-blue-900">{formatVnd(edge.score)}</td>
              </tr>
            ))}
            {!edges.length && (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={7}>
                  No feasible edges. This may mean: Δmax too small, no common slots/courts, or missing rental fees. Try adjusting parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
