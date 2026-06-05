import type { Court, Team, TimeSlot } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  teams: Team[];
  courts: Court[];
  slots: TimeSlot[];
};

export function TeamTable({ teams, courts, slots }: Props) {
  const courtName = new Map(courts.map((court) => [court.id, court.name]));
  const slotLabel = new Map(slots.map((slot) => [slot.id, slot.label]));

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Team Table</h2>
        <p className="text-sm text-slate-500">{teams.length} registered teams loaded</p>
      </div>
      <div className="max-h-[460px] overflow-auto">
        <table className="w-full min-w-[1080px] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[90px]" />
            <col className="w-[190px]" />
            <col className="w-[90px]" />
            <col />
            <col className="w-[240px]" />
            <col className="w-[180px]" />
          </colgroup>
          <thead className="table-head sticky top-0">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Available Slots</th>
              <th className="px-4 py-3">Acceptable Courts</th>
              <th className="px-4 py-3 text-right">Willingness to Pay</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-t border-blue-50">
                <td className="px-4 py-3 font-bold text-blue-900">{team.id}</td>
                <td className="truncate px-4 py-3 font-semibold" title={team.name}>{team.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 font-bold text-emerald-900">{team.skill.toFixed(1)}</span>
                </td>
                <td className="truncate px-4 py-3 text-slate-600" title={team.availableSlots.map((slot) => slotLabel.get(slot) ?? slot).join(", ")}>
                  {team.availableSlots.map((slot) => slotLabel.get(slot) ?? slot).join(", ")}
                </td>
                <td className="truncate px-4 py-3 text-slate-600" title={team.acceptableCourts.map((court) => courtName.get(court) ?? court).join(", ")}>
                  {team.acceptableCourts.map((court) => courtName.get(court) ?? court).join(", ")}
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(team.willingnessToPay)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
