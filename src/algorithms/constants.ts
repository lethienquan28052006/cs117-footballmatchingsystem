/**
 * Central constants for the optimization pipeline.
 * SCALE_FACTOR: Unit-scaling factor (hệ số quy đổi thang) that converts
 * skill gap (0–10 scale) to VND units for score calculation.
 */

export const SCALE_FACTOR = 100000;

// Default parameters
export const DEFAULT_LAMBDA = 0.36;
export const DEFAULT_MAX_SKILL_GAP = 3;
export const DEFAULT_MATCHING_FEE = 50000;

// Thresholds for quality badges
export const PROFIT_TARGET_PER_MATCH = 130000; // VND per match
export const AVG_SKILL_GAP_TARGET = 2.0;
