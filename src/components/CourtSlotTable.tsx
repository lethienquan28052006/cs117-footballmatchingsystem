import type { CourtSlot } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  courtSlots: CourtSlot[];
};

export function CourtSlotTable({ courtSlots }: Props) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Fee Table</h2>
        <p className="text-sm text-slate-500">{courtSlots.filter((courtSlot) => courtSlot.available).length} available court-time slots</p>
      </div>
      <div className="max-h-80 overflow-auto">
        <table className="w-full min-w-[560px] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[120px]" />
            <col className="w-[150px]" />
            <col />
          </colgroup>
          <thead className="table-head sticky top-0">
            <tr>
              <th className="px-4 py-3">Court</th>
              <th className="px-4 py-3">Time Slot</th>
              <th className="px-4 py-3 text-right">Rental Fee</th>
            </tr>
          </thead>
          <tbody>
            {courtSlots.slice(0, 40).map((courtSlot) => (
              <tr key={`${courtSlot.courtId}-${courtSlot.slotId}`} className="border-t border-blue-50">
                <td className="truncate px-4 py-3 font-semibold" title={courtSlot.courtName}>
                  {courtSlot.courtName}
                </td>
                <td className="truncate px-4 py-3" title={courtSlot.slotLabel}>
                  {courtSlot.slotLabel}
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(courtSlot.rentalFee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
