export const SPEED_MIN  = 0.5;
export const SPEED_MAX  = 3;
export const SPEED_STEP = 0.5;

export function nudgeSpeed(current: number, delta: number): number {
  return Math.round(Math.min(SPEED_MAX, Math.max(SPEED_MIN, current + delta)) / SPEED_STEP) * SPEED_STEP;
}
