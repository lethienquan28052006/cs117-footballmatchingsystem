import { RefreshCcw, Users } from "lucide-react";
import type { Team } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  teams: Team[];
  onGenerate: (count: number) => void;
  onReset: () => void;
};

export function TeamTable({ teams, onGenerate, onReset }: Props) {
  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-blue-100 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-950">Teams</h2>
          <p className="text-sm text-slate-500">{teams.length} football teams loaded</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-3 py-2 text-sm font-bold text-white hover:bg-blue-900" onClick={() => onGenerate(20)}>
            <Users size={16} /> Generate 20 Teams
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-yellow-300 px-3 py-2 text-sm font-bold text-blue-950 hover:bg-yellow-400" onClick={() => onGenerate(50)}>
            <Users size={16} /> Generate 50 Teams
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-bold text-blue-900 hover:bg-blue-50" onClick={onReset}>
            <RefreshCcw size={16} /> Reset Sample Data
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="table-head sticky top-0">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Available Slots</th>
              <th className="px-4 py-3">Preferred Courts</th>
              <th className="px-4 py-3 text-right">Pay</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-t border-blue-50">
                <td className="px-4 py-3 font-bold text-blue-900">{team.id}</td>
                <td className="px-4 py-3 font-semibold">{team.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-100 px-2 py-1 font-bold text-blue-900">{team.skill.toFixed(1)}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{team.availableSlots.join(", ")}</td>
                <td className="px-4 py-3 text-slate-600">{team.preferredCourts.join(", ")}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(team.pay)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
