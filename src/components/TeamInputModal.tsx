import { X, Upload, Plus } from "lucide-react";
import { useState } from "react";
import type { Team } from "../types";
import { slotTimes, courtNames } from "../data/sampleData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddTeams: (teams: Team[]) => void;
};

export function TeamInputModal({ isOpen, onClose, onAddTeams }: Props) {
  const [inputMode, setInputMode] = useState<"form" | "csv">("form");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    skill: "5.0",
    availableSlots: [] as string[],
    preferredCourts: [] as string[],
    pay: "450000",
  });
  const [csvContent, setCsvContent] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAddTeam = () => {
    setError("");

    if (!formData.id.trim()) {
      setError("Team ID is required");
      return;
    }
    if (!formData.name.trim()) {
      setError("Team name is required");
      return;
    }
    if (formData.availableSlots.length === 0) {
      setError("Please select at least one available slot");
      return;
    }
    if (formData.preferredCourts.length === 0) {
      setError("Please select at least one preferred court");
      return;
    }

    const skill = parseFloat(formData.skill);
    const pay = parseFloat(formData.pay);

    if (isNaN(skill) || skill < 0 || skill > 10) {
      setError("Skill must be a number between 0 and 10");
      return;
    }
    if (isNaN(pay) || pay < 0) {
      setError("Pay must be a positive number");
      return;
    }

    const newTeam: Team = {
      id: formData.id.trim(),
      name: formData.name.trim(),
      skill,
      availableSlots: formData.availableSlots,
      preferredCourts: formData.preferredCourts,
      pay,
    };

    onAddTeams([newTeam]);

    // Reset form
    setFormData({
      id: "",
      name: "",
      skill: "5.0",
      availableSlots: [],
      preferredCourts: [],
      pay: "450000",
    });
  };

  const handleCSVUpload = () => {
    setError("");

    if (!csvContent.trim()) {
      setError("CSV content cannot be empty");
      return;
    }

    try {
      const lines = csvContent.trim().split("\n");
      const teams: Team[] = [];

      // Skip header if present
      const startIdx = lines[0].toLowerCase().includes("id") ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(",").map((p) => p.trim());

        if (parts.length < 6) {
          setError(`Row ${i + 1}: Insufficient columns. Expected: id, name, skill, availableSlots, preferredCourts, pay`);
          return;
        }

        const id = parts[0];
        const name = parts[1];
        const skill = parseFloat(parts[2]);
        const availableSlots = parts[3].split(";").map((s) => s.trim());
        const preferredCourts = parts[4].split(";").map((c) => c.trim());
        const pay = parseFloat(parts[5]);

        if (!id) {
          setError(`Row ${i + 1}: Team ID is required`);
          return;
        }
        if (!name) {
          setError(`Row ${i + 1}: Team name is required`);
          return;
        }
        if (isNaN(skill) || skill < 0 || skill > 10) {
          setError(`Row ${i + 1}: Skill must be a number between 0 and 10`);
          return;
        }
        if (availableSlots.length === 0) {
          setError(`Row ${i + 1}: At least one available slot is required`);
          return;
        }
        if (preferredCourts.length === 0) {
          setError(`Row ${i + 1}: At least one preferred court is required`);
          return;
        }
        if (isNaN(pay) || pay < 0) {
          setError(`Row ${i + 1}: Pay must be a positive number`);
          return;
        }

        teams.push({
          id: id.trim(),
          name: name.trim(),
          skill,
          availableSlots,
          preferredCourts,
          pay,
        });
      }

      if (teams.length === 0) {
        setError("No valid teams found in CSV");
        return;
      }

      onAddTeams(teams);
      setCsvContent("");
      setInputMode("form");
    } catch (err) {
      setError(`Error parsing CSV: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
  };

  const handleSlotToggle = (slot: string) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.includes(slot) ? prev.availableSlots.filter((s) => s !== slot) : [...prev.availableSlots, slot],
    }));
  };

  const handleCourtToggle = (court: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCourts: prev.preferredCourts.includes(court) ? prev.preferredCourts.filter((c) => c !== court) : [...prev.preferredCourts, court],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-blue-100 bg-white p-4">
          <h2 className="text-lg font-bold text-blue-950">Add Teams</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-blue-50">
            <X size={24} />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="border-b border-blue-100 px-4 pt-4">
          <div className="flex gap-2">
            <button
              onClick={() => setInputMode("form")}
              className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                inputMode === "form" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-blue-600"
              }`}
            >
              Manual Input
            </button>
            <button
              onClick={() => setInputMode("csv")}
              className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                inputMode === "csv" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-blue-600"
              }`}
            >
              CSV Upload
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

          {inputMode === "form" ? (
            <div className="space-y-4">
              {/* Team ID */}
              <div>
                <label className="block text-sm font-semibold text-blue-950">Team ID</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
                  placeholder="e.g., T21"
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Team Name */}
              <div>
                <label className="block text-sm font-semibold text-blue-950">Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., FC Omega"
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-semibold text-blue-950">Skill Level (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.skill}
                  onChange={(e) => setFormData((prev) => ({ ...prev, skill: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Available Slots */}
              <div>
                <label className="block text-sm font-semibold text-blue-950 mb-2">Available Slots</label>
                <div className="grid grid-cols-2 gap-2">
                  {slotTimes.map((slot) => (
                    <label key={slot} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availableSlots.includes(slot)}
                        onChange={() => handleSlotToggle(slot)}
                        className="h-4 w-4 rounded border-blue-300 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferred Courts */}
              <div>
                <label className="block text-sm font-semibold text-blue-950 mb-2">Preferred Courts</label>
                <div className="grid grid-cols-2 gap-2">
                  {courtNames.map((court) => (
                    <label key={court} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferredCourts.includes(court)}
                        onChange={() => handleCourtToggle(court)}
                        className="h-4 w-4 rounded border-blue-300 text-blue-600"
                      />
                      <span className="text-sm text-slate-700">{court}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pay */}
              <div>
                <label className="block text-sm font-semibold text-blue-950">Payment (VND)</label>
                <input
                  type="number"
                  value={formData.pay}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pay: e.target.value }))}
                  placeholder="e.g., 450000"
                  className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddTeam}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} /> Add Team
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-blue-300 p-6 text-center">
                <label className="flex flex-col items-center gap-3 cursor-pointer">
                  <Upload size={32} className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-950">Click to upload CSV file</p>
                    <p className="text-sm text-slate-500">or drag and drop</p>
                  </div>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-950 mb-2">Or paste CSV content:</label>
                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="id,name,skill,availableSlots,preferredCourts,pay&#10;T21,FC Omega,7.5,Mon-18:00;Tue-18:00,Court 1;Court 2,480000"
                  className="w-full h-32 rounded-lg border border-blue-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold mb-2">CSV Format (comma-separated, semicolon for multiple values):</p>
                <p className="font-mono text-xs">id,name,skill,availableSlots,preferredCourts,pay</p>
                <p className="font-mono text-xs mt-2">T21,FC Omega,7.5,Mon-18:00;Tue-18:00,Court 1;Court 2,480000</p>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleCSVUpload}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <Upload size={16} /> Import Teams
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-blue-100 flex gap-2 justify-end p-4 bg-slate-50">
          <button onClick={onClose} className="rounded-lg border border-blue-200 px-4 py-2 font-semibold text-blue-900 hover:bg-blue-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
