import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { Court, Fee, TimeSlot } from "../types";

type Props = {
  isOpen: boolean;
  courts: Court[];
  slots: TimeSlot[];
  fees: Fee[];
  onClose: () => void;
  onAddFee: (fee: Fee) => void;
};

export function FeeInputModal({ isOpen, courts, slots, fees, onClose, onAddFee }: Props) {
  const [courtId, setCourtId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [rentalFee, setRentalFee] = useState("300000");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const effectiveCourtId = courtId || courts[0]?.id || "";
  const effectiveSlotId = slotId || slots[0]?.id || "";
  const existing = fees.some((fee) => fee.courtId === effectiveCourtId && fee.slotId === effectiveSlotId);

  const close = () => {
    setCourtId("");
    setSlotId("");
    setRentalFee("300000");
    setError("");
    onClose();
  };

  const submit = () => {
    const parsedRentalFee = Number(rentalFee);
    if (!effectiveCourtId || !effectiveSlotId) {
      setError("A court and time slot are required.");
      return;
    }
    if (!Number.isFinite(parsedRentalFee) || parsedRentalFee < 0) {
      setError("Rental fee must be a non-negative number.");
      return;
    }
    onAddFee({
      courtId: effectiveCourtId,
      slotId: effectiveSlotId,
      rentalFee: parsedRentalFee,
      operatingCost: 90000,
    });
    close();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4">
      <div className="panel w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between border-b border-blue-100 p-4">
          <div>
            <h2 className="text-lg font-bold text-blue-950">Add Fee</h2>
            <p className="text-sm text-slate-500">Existing court-slot fees are replaced.</p>
          </div>
          <button className="rounded-lg p-1 hover:bg-blue-50" onClick={close} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="grid gap-4 p-5">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          {existing && <div className="rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-800">This court-slot already has a fee. Saving will update it.</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid min-w-0 gap-2">
              <span className="text-sm font-semibold text-slate-700">Court</span>
              <select className="w-full min-w-0 rounded-lg border border-blue-200 px-3 py-2" value={effectiveCourtId} onChange={(event) => setCourtId(event.target.value)}>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid min-w-0 gap-2">
              <span className="text-sm font-semibold text-slate-700">Time Slot</span>
              <select className="w-full min-w-0 rounded-lg border border-blue-200 px-3 py-2" value={effectiveSlotId} onChange={(event) => setSlotId(event.target.value)}>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Rental Fee</span>
              <input className="rounded-lg border border-blue-200 px-3 py-2" type="number" min="0" step="10000" value={rentalFee} onChange={(event) => setRentalFee(event.target.value)} />
            </label>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900" onClick={submit}>
            <Plus size={18} /> {existing ? "Update Fee" : "Add Fee"}
          </button>
        </div>
      </div>
    </div>
  );
}
