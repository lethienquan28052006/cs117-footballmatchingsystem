import type { Edge } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  edges: Edge[];
};

export function EdgeTable({ edges }: Props) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Top Compatible Edges</h2>
        <p className="text-sm text-slate-500">{edges.length ? `Showing top ${Math.min(20, edges.length)} of ${edges.length} edges` : "Run optimization to build compatibility graph"}</p>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="table-head sticky top-0">
            <tr>
              <th className="px-4 py-3">Team A</th>
              <th className="px-4 py-3">Team B</th>
              <th className="px-4 py-3">Common Slots</th>
              <th className="px-4 py-3 text-right">Skill Gap</th>
              <th className="px-4 py-3 text-right">Estimated Profit</th>
              <th className="px-4 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {edges.slice(0, 20).map((edge) => (
              <tr key={`${edge.teamA}-${edge.teamB}`} className="border-t border-blue-50">
                <td className="px-4 py-3 font-bold text-blue-900">{edge.teamA}</td>
                <td className="px-4 py-3 font-bold text-blue-900">{edge.teamB}</td>
                <td className="px-4 py-3 text-slate-600">{edge.commonSlots.join(", ")}</td>
                <td className="px-4 py-3 text-right">{edge.skillGap.toFixed(1)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(edge.estimatedProfit)}</td>
                <td className="px-4 py-3 text-right font-black text-blue-900">{formatVnd(edge.score)}</td>
              </tr>
            ))}
            {!edges.length && (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
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
