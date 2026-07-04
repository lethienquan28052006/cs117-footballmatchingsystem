import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { TimeSlot } from "../types";

type Props = {
  isOpen: boolean;
  existingSlotIds: string[];
  onClose: () => void;
  onAddSlot: (slot: TimeSlot) => void;
};

export function SlotInputModal({ isOpen, existingSlotIds, onClose, onAddSlot }: Props) {
  const [id, setId] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const close = () => {
    setId("");
    setLabel("");
    setError("");
    onClose();
  };

  const submit = () => {
    const trimmedId = id.trim();
    const trimmedLabel = label.trim();
    const dayTimePattern = /^[A-Za-z]{3}-\d{2}:\d{2}$/;

    if (!trimmedId) {
      setError("Slot ID is required.");
      return;
    }
    if (!trimmedLabel) {
      setError("Slot label is required.");
      return;
    }
    if (!dayTimePattern.test(trimmedLabel)) {
      setError("Slot label must follow the format Day:Time, for example Thu-18:00.");
      return;
    }
    if (existingSlotIds.includes(trimmedId)) {
      setError("Slot ID already exists.");
      return;
    }

    onAddSlot({ id: trimmedId, label: trimmedLabel });
    close();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4">
      <div className="panel w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-blue-100 p-4">
          <div>
            <h2 className="text-lg font-bold text-blue-950">Add Time Slot</h2>
            <p className="text-sm text-slate-500">New slots become available for teams and scheduling.</p>
          </div>
          <button className="rounded-lg p-1 hover:bg-blue-50" onClick={close} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="grid gap-4 p-5">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Slot ID</span>
            <input className="rounded-lg border border-blue-200 px-3 py-2" value={id} onChange={(event) => setId(event.target.value)} placeholder="S7" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Slot Label</span>
            <input className="rounded-lg border border-blue-200 px-3 py-2" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Thu-18:00" />
            <span className="text-xs text-slate-500">Use the format Day-Time, for example Thu-18:00.</span>
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900" onClick={submit}>
            <Plus size={18} /> Add Slot
          </button>
        </div>
      </div>
    </div>
  );
}
