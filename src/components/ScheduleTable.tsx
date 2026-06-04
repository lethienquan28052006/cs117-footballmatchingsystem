import type { ScheduledMatch } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  schedule: ScheduledMatch[];
};

export function ScheduleTable({ schedule }: Props) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Final Schedule</h2>
        <p className="text-sm text-slate-500">{schedule.length ? `${schedule.length} matches assigned to courts` : "No scheduled matches yet"}</p>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="table-head sticky top-0">
            <tr>
              <th className="px-4 py-3">Match</th>
              <th className="px-4 py-3">Court</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Skill Gap</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right">Final Profit</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((match) => (
              <tr key={`${match.teamA}-${match.teamB}-${match.court}-${match.time}`} className="border-t border-blue-50">
                <td className="px-4 py-3 font-bold text-blue-900">
                  {match.teamA} vs {match.teamB}
                </td>
                <td className="px-4 py-3">{match.court}</td>
                <td className="px-4 py-3">{match.time}</td>
                <td className="px-4 py-3 text-right">{match.skillGap.toFixed(1)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(match.score)}</td>
                <td className="px-4 py-3 text-right font-black text-green-700">{formatVnd(match.finalProfit)}</td>
              </tr>
            ))}
            {!schedule.length && (
              <tr>
                <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                  Run optimization to create a schedule.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
