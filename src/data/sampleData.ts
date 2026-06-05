import type { Court, CourtSlot, Dataset, Team, TimeSlot } from "../types";

export const daySlots: TimeSlot[] = ["Mon-16:00", "Mon-18:00", "Mon-20:00", "Tue-16:00", "Tue-18:00", "Tue-20:00"].map((label, index) => ({
  id: `S${index + 1}`,
  label,
}));

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["08:00", "10:00", "14:00", "16:00", "18:00", "20:00"];

export const weekSlots: TimeSlot[] = days.flatMap((day) => hours.map((hour) => `${day}-${hour}`)).map((label, index) => ({
  id: `S${index + 1}`,
  label,
}));

export const allCourts: Court[] = Array.from({ length: 5 }, (_, index) => ({
  id: `C${index + 1}`,
  name: `Court ${index + 1}`,
}));

export function buildCourtSlots(courts: Court[], slots: TimeSlot[]): CourtSlot[] {
  return courts.flatMap((court, courtIndex) =>
    slots.map((slot, slotIndex) => {
      const isPeak = slot.label.includes("18:00") || slot.label.includes("20:00");
      const weekend = slot.label.startsWith("Sat") || slot.label.startsWith("Sun");
      const rentalFee = 220000 + courtIndex * 35000 + (isPeak ? 80000 : 25000) + (weekend ? 50000 : 0);

      return { courtId: court.id, courtName: court.name, slotId: slot.id, slotLabel: slot.label, rentalFee, available: true };
    }),
  );
}

const sampleCourts = allCourts.slice(0, 3);
const sampleSlots = daySlots;

export const sampleTeams: Team[] = [
  { id: "T001", name: "FC Alpha", skill: 8.2, availableSlots: ["S1", "S2", "S5"], acceptableCourts: ["C1", "C2"] },
  { id: "T002", name: "FC Beta", skill: 7.6, availableSlots: ["S2", "S3", "S5"], acceptableCourts: ["C1", "C3"] },
  { id: "T003", name: "FC Gamma", skill: 6.4, availableSlots: ["S1", "S3", "S4"], acceptableCourts: ["C2"] },
  { id: "T004", name: "FC Delta", skill: 5.9, availableSlots: ["S2", "S4", "S6"], acceptableCourts: ["C2", "C3"] },
  { id: "T005", name: "FC Epsilon", skill: 4.8, availableSlots: ["S1", "S5", "S6"], acceptableCourts: ["C3"] },
  { id: "T006", name: "FC Zeta", skill: 7.1, availableSlots: ["S2", "S3", "S6"], acceptableCourts: ["C1", "C3"] },
  { id: "T007", name: "FC Eta", skill: 3.9, availableSlots: ["S1", "S4", "S5"], acceptableCourts: ["C2", "C3"] },
  { id: "T008", name: "FC Theta", skill: 8.8, availableSlots: ["S3", "S4", "S6"], acceptableCourts: ["C1"] },
  { id: "T009", name: "FC Iota", skill: 5.2, availableSlots: ["S1", "S2", "S5"], acceptableCourts: ["C2", "C3"] },
  { id: "T010", name: "FC Kappa", skill: 6.9, availableSlots: ["S2", "S3", "S4"], acceptableCourts: ["C1", "C2"] },
  { id: "T011", name: "FC Lambda", skill: 2.7, availableSlots: ["S1", "S5", "S6"], acceptableCourts: ["C1", "C2"] },
  { id: "T012", name: "FC Mu", skill: 4.3, availableSlots: ["S3", "S4", "S5"], acceptableCourts: ["C3"] },
  { id: "T013", name: "FC Nu", skill: 9.4, availableSlots: ["S2", "S4", "S6"], acceptableCourts: ["C1", "C2"] },
  { id: "T014", name: "FC Xi", skill: 5.6, availableSlots: ["S1", "S2", "S6"], acceptableCourts: ["C2"] },
  { id: "T015", name: "FC Omicron", skill: 3.4, availableSlots: ["S4", "S5", "S6"], acceptableCourts: ["C3"] },
  { id: "T016", name: "FC Pi", skill: 6.1, availableSlots: ["S1", "S4", "S6"], acceptableCourts: ["C1"] },
  { id: "T017", name: "FC Rho", skill: 7.9, availableSlots: ["S2", "S3", "S5"], acceptableCourts: ["C2", "C3"] },
  { id: "T018", name: "FC Sigma", skill: 4.9, availableSlots: ["S1", "S2", "S4"], acceptableCourts: ["C1"] },
  { id: "T019", name: "FC Tau", skill: 2.1, availableSlots: ["S3", "S5", "S6"], acceptableCourts: ["C2"] },
  { id: "T020", name: "FC Upsilon", skill: 8.5, availableSlots: ["S1", "S4", "S6"], acceptableCourts: ["C1", "C3"] },
];

export const sampleDataset: Dataset = {
  courts: sampleCourts,
  slots: sampleSlots,
  teams: [],
  courtSlots: buildCourtSlots(sampleCourts, sampleSlots),
};
