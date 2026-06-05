import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { Court, Team, TimeSlot } from "../types";

type Props = {
  isOpen: boolean;
  courts: Court[];
  slots: TimeSlot[];
  existingTeamIds: string[];
  onClose: () => void;
  onAddTeam: (team: Team) => void;
};

export function TeamInputModal({ isOpen, courts, slots, existingTeamIds, onClose, onAddTeam }: Props) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    skill: "5.0",
    availableSlots: [] as string[],
    acceptableCourts: [] as string[],
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const reset = () => {
    setFormData({
      id: "",
      name: "",
      skill: "5.0",
      availableSlots: [],
      acceptableCourts: [],
    });
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleSlot = (slotId: string) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.includes(slotId) ? prev.availableSlots.filter((slot) => slot !== slotId) : [...prev.availableSlots, slotId],
    }));
  };

  const toggleCourt = (courtId: string) => {
    setFormData((prev) => ({
      ...prev,
      acceptableCourts: prev.acceptableCourts.includes(courtId) ? prev.acceptableCourts.filter((court) => court !== courtId) : [...prev.acceptableCourts, courtId],
    }));
  };

  const submit = () => {
    const id = formData.id.trim();
    const name = formData.name.trim();
    const skill = Number(formData.skill);

    if (!id || !name) {
      setError("Team ID and name are required.");
      return;
    }
    if (existingTeamIds.includes(id)) {
      setError("Team ID already exists.");
      return;
    }
    if (!Number.isFinite(skill) || skill < 0 || skill > 10) {
      setError("Skill must be between 0 and 10.");
      return;
    }
    if (!formData.availableSlots.length) {
      setError("Select at least one available slot.");
      return;
    }
    if (!formData.acceptableCourts.length) {
      setError("Select at least one acceptable court.");
      return;
    }
    onAddTeam({
      id,
      name,
      skill,
      availableSlots: formData.availableSlots,
      acceptableCourts: formData.acceptableCourts,
      willingnessToPay: 450000,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4">
      <div className="panel max-h-[90vh] w-full max-w-2xl overflow-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-blue-100 bg-white p-4">
          <h2 className="text-lg font-bold text-blue-950">Add Team</h2>
          <button className="rounded-lg p-1 hover:bg-blue-50" onClick={handleClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="grid gap-4 p-5">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Team ID</span>
              <input className="rounded-lg border border-blue-200 px-3 py-2" value={formData.id} onChange={(event) => setFormData((prev) => ({ ...prev, id: event.target.value }))} placeholder="T021" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Team Name</span>
              <input className="rounded-lg border border-blue-200 px-3 py-2" value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} placeholder="FC Omega" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Skill</span>
              <input className="rounded-lg border border-blue-200 px-3 py-2" type="number" min="0" max="10" step="0.1" value={formData.skill} onChange={(event) => setFormData((prev) => ({ ...prev, skill: event.target.value }))} />
            </label>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Available Slots</p>
            <div className="grid max-h-44 grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2 overflow-auto rounded-lg border border-blue-100 p-3">
              {slots.map((slot) => (
                <label key={slot.id} className="flex min-w-0 items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.availableSlots.includes(slot.id)} onChange={() => toggleSlot(slot.id)} />
                  <span className="truncate" title={slot.label}>{slot.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Acceptable Courts</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2 rounded-lg border border-blue-100 p-3">
              {courts.map((court) => (
                <label key={court.id} className="flex min-w-0 items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.acceptableCourts.includes(court.id)} onChange={() => toggleCourt(court.id)} />
                  <span className="truncate" title={court.name}>{court.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900" onClick={submit}>
            <Plus size={18} /> Add Team
          </button>
        </div>
      </div>
    </div>
  );
}
