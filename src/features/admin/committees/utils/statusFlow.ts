import type { CommitteeStatus } from '@/types';

/**
 * Documented committee status lifecycle for PATCH /committees/:id/status:
 *   DRAFT   → ACTIVE | PAUSED | CANCELLED
 *   ACTIVE  → PAUSED | COMPLETED | CANCELLED
 *   PAUSED  → ACTIVE | CANCELLED | COMPLETED
 *   COMPLETED and CANCELLED are terminal.
 *
 * The backend enforces these rules; this map only drives which transitions the
 * UI offers so admins are never shown an invalid action.
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<CommitteeStatus, CommitteeStatus[]> = {
  DRAFT: ['ACTIVE', 'PAUSED', 'CANCELLED'],
  ACTIVE: ['PAUSED', 'COMPLETED', 'CANCELLED'],
  PAUSED: ['ACTIVE', 'CANCELLED', 'COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

/** Valid next statuses for a given current status (empty when terminal). */
export function getNextStatuses(status: CommitteeStatus): CommitteeStatus[] {
  return ALLOWED_STATUS_TRANSITIONS[status] ?? [];
}

/** True when no further transitions are allowed (COMPLETED / CANCELLED). */
export function isTerminalStatus(status: CommitteeStatus): boolean {
  return getNextStatuses(status).length === 0;
}

/** PATCH /committees/:id is only allowed while the committee is a DRAFT. */
export function canEditCommittee(status: CommitteeStatus): boolean {
  return status === 'DRAFT';
}

/**
 * Maps a committee status to an MUI chip colour. The raw backend status value
 * is always shown as the label, so colour is never the only signal.
 */
export function committeeStatusColor(
  status: CommitteeStatus,
): 'default' | 'success' | 'warning' | 'info' | 'error' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PAUSED':
      return 'warning';
    case 'COMPLETED':
      return 'info';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}
