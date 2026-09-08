import type { CycleStatus } from '@/types';

/** MUI chip colors used across the admin cycles feature. */
export type ChipColor = 'default' | 'success' | 'warning' | 'info' | 'error';

/**
 * Documented cycle status lifecycle for PATCH /committees/:cid/cycles/:id/status:
 *   UPCOMING  → ACTIVE | CANCELLED
 *   ACTIVE    → COMPLETED | CANCELLED
 *   COMPLETED and CANCELLED are terminal.
 *
 * Only one cycle may be ACTIVE at a time — the backend enforces this; the UI
 * only offers valid transitions so admins are never shown an invalid action.
 */
export const ALLOWED_CYCLE_TRANSITIONS: Record<CycleStatus, CycleStatus[]> = {
  UPCOMING: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

/** Valid next statuses for a given current status (empty when terminal). */
export function getNextCycleStatuses(status: CycleStatus): CycleStatus[] {
  return ALLOWED_CYCLE_TRANSITIONS[status] ?? [];
}

/** True when no further transitions are allowed (COMPLETED / CANCELLED). */
export function isTerminalCycle(status: CycleStatus): boolean {
  return getNextCycleStatuses(status).length === 0;
}

/**
 * Cycle status → chip color. Mirrors the user-facing mapping so the same
 * status reads the same way on both sides of the app.
 */
export function cycleStatusColor(status: CycleStatus): ChipColor {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'UPCOMING':
      return 'info';
    case 'COMPLETED':
      return 'default';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * A cycle can have a lottery run only when the backend reports it eligible.
 * This helper just checks whether the cycle is in a state where lottery
 * execution makes sense — the backend is the final authority.
 */
export function canRunLottery(status: CycleStatus): boolean {
  return status === 'ACTIVE';
}

/**
 * True when a cycle can be activated (not terminal and not already active).
 * The backend also checks that no other cycle is currently ACTIVE.
 */
export function canActivateCycle(status: CycleStatus): boolean {
  return status === 'UPCOMING';
}

/**
 * Progress percentage from expected to collected amounts. Both values are
 * Prisma Decimal strings from the backend — parsed safely.
 */
export function cycleProgressPercent(totalExpected: string, totalCollected: string): number {
  const expected = parseFloat(totalExpected);
  const collected = parseFloat(totalCollected);
  if (Number.isNaN(expected) || expected === 0) return 0;
  if (Number.isNaN(collected)) return 0;
  return Math.min(Math.round((collected / expected) * 100), 100);
}
