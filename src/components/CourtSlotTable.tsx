import type { CourtSlot } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  courtSlots: CourtSlot[];
};

export function CourtSlotTable({ courtSlots }: Props) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Court Slots</h2>
        <p className="text-sm text-slate-500">{courtSlots.filter((slot) => slot.available).length} available court-time slots</p>
      </div>
      <div className="max-h-80 overflow-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="table-head sticky top-0">
            <tr>
              <th className="px-4 py-3">Court</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Fee</th>
              <th className="px-4 py-3">Available</th>
            </tr>
          </thead>
          <tbody>
            {courtSlots.map((slot) => (
              <tr key={`${slot.court}-${slot.time}`} className="border-t border-blue-50">
                <td className="px-4 py-3 font-semibold">{slot.court}</td>
                <td className="px-4 py-3">{slot.time}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(slot.courtFee)}</td>
                <td className="px-4 py-3">
                  <span className={slot.available ? "chip bg-green-50 text-green-700" : "chip bg-slate-100 text-slate-500"}>{slot.available ? "Yes" : "No"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
