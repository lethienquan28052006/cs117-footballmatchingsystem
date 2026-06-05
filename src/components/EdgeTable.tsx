import type { Court, Edge, TimeSlot } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  edges: Edge[];
  courts: Court[];
  slots: TimeSlot[];
};

export function EdgeTable({ edges, courts, slots }: Props) {
  const courtName = new Map(courts.map((court) => [court.id, court.name]));
  const slotLabel = new Map(slots.map((slot) => [slot.id, slot.label]));

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Matching Results</h2>
        <p className="text-sm text-slate-500">{edges.length ? `Showing top ${Math.min(20, edges.length)} of ${edges.length} feasible edges` : "Run optimization to build compatibility graph"}</p>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[920px] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[90px]" />
            <col className="w-[90px]" />
            <col />
            <col className="w-[190px]" />
            <col className="w-[110px]" />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
          </colgroup>
          <thead className="table-head sticky top-0">
            <tr>
              <th className="px-4 py-3">Team A</th>
              <th className="px-4 py-3">Team B</th>
              <th className="px-4 py-3">Common Slots</th>
              <th className="px-4 py-3">Common Courts</th>
              <th className="px-4 py-3 text-right">Skill Gap</th>
              <th className="px-4 py-3 text-right">Profit</th>
              <th className="px-4 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {edges.slice(0, 20).map((edge) => (
              <tr key={`${edge.teamA}-${edge.teamB}`} className="border-t border-blue-50">
                <td className="px-4 py-3 font-bold text-blue-900">{edge.teamA}</td>
                <td className="px-4 py-3 font-bold text-blue-900">{edge.teamB}</td>
                <td className="truncate px-4 py-3 text-slate-600" title={edge.commonSlots.map((slot) => slotLabel.get(slot) ?? slot).join(", ")}>
                  {edge.commonSlots.map((slot) => slotLabel.get(slot) ?? slot).join(", ")}
                </td>
                <td className="truncate px-4 py-3 text-slate-600" title={edge.commonCourts.map((court) => courtName.get(court) ?? court).join(", ")}>
                  {edge.commonCourts.map((court) => courtName.get(court) ?? court).join(", ")}
                </td>
                <td className="px-4 py-3 text-right">{edge.skillGap.toFixed(1)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(edge.profit)}</td>
                <td className="px-4 py-3 text-right font-black text-blue-900">{formatVnd(edge.score)}</td>
              </tr>
            ))}
            {!edges.length && (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={7}>
                  No graph edges yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
