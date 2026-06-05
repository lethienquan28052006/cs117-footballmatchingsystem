import type { Court, Fee, TimeSlot } from "../types";
import { formatVnd } from "../utils/format";

type Props = {
  courts: Court[];
  slots: TimeSlot[];
  fees: Fee[];
};

export function CourtSlotTable({ courts, slots, fees }: Props) {
  const courtName = new Map(courts.map((court) => [court.id, court.name]));
  const slotLabel = new Map(slots.map((slot) => [slot.id, slot.label]));

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-100 p-4">
        <h2 className="text-lg font-bold text-blue-950">Fee Table</h2>
        <p className="text-sm text-slate-500">{fees.length} court-slot pairs available</p>
      </div>
      <div className="max-h-80 overflow-auto">
        <table className="w-full min-w-[560px] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[120px]" />
            <col className="w-[130px]" />
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
            {fees.slice(0, 40).map((fee) => (
              <tr key={`${fee.courtId}-${fee.slotId}`} className="border-t border-blue-50">
                <td className="truncate px-4 py-3 font-semibold" title={courtName.get(fee.courtId) ?? fee.courtId}>{courtName.get(fee.courtId) ?? fee.courtId}</td>
                <td className="truncate px-4 py-3" title={slotLabel.get(fee.slotId) ?? fee.slotId}>{slotLabel.get(fee.slotId) ?? fee.slotId}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(fee.rentalFee)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
