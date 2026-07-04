import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { Court } from "../types";

type Props = {
  isOpen: boolean;
  existingCourtIds: string[];
  onClose: () => void;
  onAddCourt: (court: Court) => void;
};

export function CourtInputModal({ isOpen, existingCourtIds, onClose, onAddCourt }: Props) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const close = () => {
    setId("");
    setError("");
    onClose();
  };

  const submit = () => {
    const trimmedId = id.trim();
    if (!trimmedId) {
      setError("Court ID is required.");
      return;
    }
    if (existingCourtIds.includes(trimmedId)) {
      setError("Court ID already exists.");
      return;
    }
    onAddCourt({ id: trimmedId, name: trimmedId });
    close();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4">
      <div className="panel w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-blue-100 p-4">
          <h2 className="text-lg font-bold text-blue-950">Add Court</h2>
          <button className="rounded-lg p-1 hover:bg-blue-50" onClick={close} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="grid gap-4 p-5">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Court ID</span>
            <input className="rounded-lg border border-blue-200 px-3 py-2" value={id} onChange={(event) => setId(event.target.value)} placeholder="C6" />
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900" onClick={submit}>
            <Plus size={18} /> Add Court
          </button>
        </div>
      </div>
    </div>
  );
}
