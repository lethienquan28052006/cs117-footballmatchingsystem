import { Plus, Upload, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import type { Court, Team, TimeSlot } from "../types";

type Props = {
  isOpen: boolean;
  courts: Court[];
  slots: TimeSlot[];
  existingTeamIds: string[];
  onClose: () => void;
  onAddTeam: (team: Team) => void;
  onAddTeams: (teams: Team[]) => void;
};

export function TeamInputModal({ isOpen, courts, slots, existingTeamIds, onClose, onAddTeam, onAddTeams }: Props) {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    skill: "5.0",
    availableSlots: [] as string[],
    acceptableCourts: [] as string[],
  });
  const [csvContent, setCsvContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const reset = () => {
    setFormData({
      id: "",
      name: "",
      skill: "5.0",
      availableSlots: [],
      acceptableCourts: [],
    });
    setCsvContent("");
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const splitCsvLine = (line: string) => {
    const values: string[] = [];
    let current = "";
    let quoted = false;

    for (const char of line) {
      if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values.map((value) => value.replace(/^"|"$/g, ""));
  };

  const parseCsvTeams = (content: string): Team[] => {
    const slotIds = new Set(slots.map((slot) => slot.id));
    const courtIds = new Set(courts.map((court) => court.id));
    const existingIds = new Set(existingTeamIds);
    const importedIds = new Set<string>();
    const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const startIndex = lines[0]?.toLowerCase().startsWith("id,") ? 1 : 0;
    const teamsToImport: Team[] = [];

    for (let index = startIndex; index < lines.length; index += 1) {
      const rowNumber = index + 1;
      const [id = "", name = "", skillRaw = "", slotsRaw = "", courtsRaw = ""] = splitCsvLine(lines[index]);
      const trimmedId = id.trim();
      const trimmedName = name.trim();
      const skill = Number(skillRaw);
      const availableSlots = slotsRaw.split(";").map((slot) => slot.trim()).filter(Boolean);
      const acceptableCourts = courtsRaw.split(";").map((court) => court.trim()).filter(Boolean);

      if (!trimmedId || !trimmedName) throw new Error(`Row ${rowNumber}: Team ID and name are required.`);
      if (existingIds.has(trimmedId) || importedIds.has(trimmedId)) throw new Error(`Row ${rowNumber}: Duplicate team ID "${trimmedId}".`);
      if (!Number.isFinite(skill) || skill < 0 || skill > 10) throw new Error(`Row ${rowNumber}: Skill must be between 0 and 10.`);
      if (!availableSlots.length) throw new Error(`Row ${rowNumber}: At least one available slot is required.`);
      if (!acceptableCourts.length) throw new Error(`Row ${rowNumber}: At least one acceptable court is required.`);
      if (availableSlots.some((slot) => !slotIds.has(slot))) throw new Error(`Row ${rowNumber}: Unknown slot ID. Use IDs like S1, S2.`);
      if (acceptableCourts.some((court) => !courtIds.has(court))) throw new Error(`Row ${rowNumber}: Unknown court ID. Use IDs like C1, C2.`);

      importedIds.add(trimmedId);
      teamsToImport.push({ id: trimmedId, name: trimmedName, skill, availableSlots, acceptableCourts });
    }

    return teamsToImport;
  };

  const importCsv = () => {
    setError("");
    setSuccess("");
    if (!csvContent.trim()) {
      setError("CSV content is empty.");
      return;
    }

    try {
      const importedTeams = parseCsvTeams(csvContent);
      if (!importedTeams.length) {
        setError("No teams found in CSV.");
        return;
      }
      onAddTeams(importedTeams);
      setCsvContent("");
      setSuccess(`Imported ${importedTeams.length} team${importedTeams.length === 1 ? "" : "s"}.`);
      onClose();
    } catch (csvError) {
      setError(csvError instanceof Error ? csvError.message : "Could not import CSV.");
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setCsvContent(String(reader.result ?? ""));
    reader.onerror = () => setError("Could not read the selected CSV file.");
    reader.readAsText(file);
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
          {success && <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{success}</div>}
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <button className={`rounded-md px-3 py-2 text-sm font-black ${mode === "manual" ? "bg-white text-blue-950 shadow-sm" : "text-slate-600"}`} onClick={() => setMode("manual")}>
              Manual
            </button>
            <button className={`rounded-md px-3 py-2 text-sm font-black ${mode === "csv" ? "bg-white text-blue-950 shadow-sm" : "text-slate-600"}`} onClick={() => setMode("csv")}>
              CSV Upload
            </button>
          </div>

          {mode === "manual" ? (
            <>
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
            </>
          ) : (
            <div className="grid gap-4">
              <label className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/60 px-4 py-8 text-center hover:bg-blue-50">
                <Upload size={28} className="text-blue-800" />
                <span className="mt-2 font-black text-blue-950">Upload teams CSV</span>
                <span className="mt-1 text-sm text-slate-500">Expected columns: id, name, skill, availableSlots, acceptableCourts</span>
                <input className="hidden" type="file" accept=".csv,text/csv" onChange={handleFileUpload} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">CSV Preview / Paste CSV</span>
                <textarea
                  className="min-h-44 rounded-lg border border-blue-200 px-3 py-2 font-mono text-sm"
                  value={csvContent}
                  onChange={(event) => setCsvContent(event.target.value)}
                  placeholder={"id,name,skill,availableSlots,acceptableCourts\nT021,FC Omega,7.5,S1;S2,C1;C2\nT022,FC Nova,6.3,S2;S5,C2"}
                />
              </label>
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                Use semicolons for multiple slot/court IDs. Slot IDs must match the active dataset, for example <b>S1;S2</b>. Court IDs must match active courts, for example <b>C1;C2</b>.
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-3 font-black text-white hover:bg-blue-900" onClick={importCsv}>
                <Upload size={18} /> Import Teams
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
