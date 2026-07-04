import type { Team } from "../types";

/**
 * SP1 — Data Preprocessing
 * Validate and normalize teams before building the compatibility graph.
 * 
 * Steps:
 *   1. Check skill ∈ [0, 10]
 *   2. Drop teams with no available slots or no acceptable courts
 *   3. Remove exact duplicates by ID
 *   4. Normalize slot/court IDs to set intersection
 */

export interface ValidationError {
  teamId: string;
  reason: string;
}

export function validateTeams(teams: Team[]): { valid: Team[]; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  const seen = new Set<string>();
  const valid: Team[] = [];

  for (const team of teams) {
    // Check duplicate ID
    if (seen.has(team.id)) {
      errors.push({ teamId: team.id, reason: "Duplicate team ID" });
      continue;
    }
    seen.add(team.id);

    // Check skill range [0, 10]
    if (team.skill < 0 || team.skill > 10) {
      errors.push({ teamId: team.id, reason: `Skill ${team.skill} out of range [0, 10]` });
      continue;
    }

    // Check non-empty constraints
    if (!team.availableSlots || team.availableSlots.length === 0) {
      errors.push({ teamId: team.id, reason: "No available slots" });
      continue;
    }

    if (!team.acceptableCourts || team.acceptableCourts.length === 0) {
      errors.push({ teamId: team.id, reason: "No acceptable courts" });
      continue;
    }

    // Deduplicate slot/court IDs
    const uniqueSlots = [...new Set(team.availableSlots)];
    const uniqueCourts = [...new Set(team.acceptableCourts)];

    valid.push({
      ...team,
      availableSlots: uniqueSlots,
      acceptableCourts: uniqueCourts,
    });
  }

  return { valid, errors };
}
