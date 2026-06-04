import type { CourtSlot, Team } from "../types";

export const slotTimes = ["Mon-18:00", "Mon-20:00", "Tue-18:00", "Tue-20:00", "Wed-18:00", "Wed-20:00"];
export const courtNames = ["Court 1", "Court 2", "Court 3"];

export const sampleTeams: Team[] = [
  { id: "T01", name: "FC Alpha", skill: 8.2, availableSlots: ["Mon-18:00", "Mon-20:00", "Tue-18:00"], preferredCourts: ["Court 1", "Court 2"], pay: 560000 },
  { id: "T02", name: "FC Beta", skill: 7.6, availableSlots: ["Mon-18:00", "Tue-18:00", "Wed-20:00"], preferredCourts: ["Court 1"], pay: 520000 },
  { id: "T03", name: "FC Gamma", skill: 6.4, availableSlots: ["Mon-20:00", "Tue-20:00", "Wed-18:00"], preferredCourts: ["Court 2"], pay: 450000 },
  { id: "T04", name: "FC Delta", skill: 5.9, availableSlots: ["Tue-18:00", "Tue-20:00", "Wed-18:00"], preferredCourts: ["Court 2", "Court 3"], pay: 430000 },
  { id: "T05", name: "FC Epsilon", skill: 4.8, availableSlots: ["Mon-18:00", "Wed-18:00", "Wed-20:00"], preferredCourts: ["Court 3"], pay: 390000 },
  { id: "T06", name: "FC Zeta", skill: 7.1, availableSlots: ["Mon-20:00", "Tue-18:00", "Wed-20:00"], preferredCourts: ["Court 1", "Court 3"], pay: 500000 },
  { id: "T07", name: "FC Eta", skill: 3.9, availableSlots: ["Mon-18:00", "Tue-20:00", "Wed-18:00"], preferredCourts: ["Court 2"], pay: 330000 },
  { id: "T08", name: "FC Theta", skill: 8.8, availableSlots: ["Mon-20:00", "Tue-20:00", "Wed-20:00"], preferredCourts: ["Court 1"], pay: 590000 },
  { id: "T09", name: "FC Iota", skill: 5.2, availableSlots: ["Mon-18:00", "Tue-18:00", "Wed-18:00"], preferredCourts: ["Court 2", "Court 3"], pay: 410000 },
  { id: "T10", name: "FC Kappa", skill: 6.9, availableSlots: ["Mon-20:00", "Tue-18:00", "Tue-20:00"], preferredCourts: ["Court 3"], pay: 480000 },
  { id: "T11", name: "FC Lambda", skill: 2.7, availableSlots: ["Mon-18:00", "Wed-18:00", "Wed-20:00"], preferredCourts: ["Court 1", "Court 2"], pay: 270000 },
  { id: "T12", name: "FC Mu", skill: 4.3, availableSlots: ["Mon-20:00", "Tue-20:00", "Wed-18:00"], preferredCourts: ["Court 3"], pay: 360000 },
  { id: "T13", name: "FC Nu", skill: 9.4, availableSlots: ["Tue-18:00", "Tue-20:00", "Wed-20:00"], preferredCourts: ["Court 1", "Court 2"], pay: 600000 },
  { id: "T14", name: "FC Xi", skill: 5.6, availableSlots: ["Mon-18:00", "Mon-20:00", "Wed-20:00"], preferredCourts: ["Court 2"], pay: 420000 },
  { id: "T15", name: "FC Omicron", skill: 3.4, availableSlots: ["Tue-18:00", "Wed-18:00", "Wed-20:00"], preferredCourts: ["Court 3"], pay: 300000 },
  { id: "T16", name: "FC Pi", skill: 6.1, availableSlots: ["Mon-18:00", "Tue-20:00", "Wed-20:00"], preferredCourts: ["Court 1"], pay: 440000 },
  { id: "T17", name: "FC Rho", skill: 7.9, availableSlots: ["Mon-20:00", "Tue-18:00", "Wed-18:00"], preferredCourts: ["Court 2", "Court 3"], pay: 540000 },
  { id: "T18", name: "FC Sigma", skill: 4.9, availableSlots: ["Mon-18:00", "Tue-18:00", "Tue-20:00"], preferredCourts: ["Court 1"], pay: 380000 },
  { id: "T19", name: "FC Tau", skill: 2.1, availableSlots: ["Mon-20:00", "Wed-18:00", "Wed-20:00"], preferredCourts: ["Court 2"], pay: 240000 },
  { id: "T20", name: "FC Upsilon", skill: 8.5, availableSlots: ["Mon-18:00", "Tue-20:00", "Wed-20:00"], preferredCourts: ["Court 1", "Court 3"], pay: 570000 },
];

export const sampleCourtSlots: CourtSlot[] = courtNames.flatMap((court, courtIndex) =>
  slotTimes.map((time, slotIndex) => ({
    court,
    time,
    courtFee: 250000 + courtIndex * 45000 + (slotIndex % 3) * 25000,
    available: true,
  })),
);
