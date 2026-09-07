import type { CommitteeStatus, MemberStatus } from '@/types';
import type { InvitationStatus } from '@/features/invitations/types';

/** MUI chip colors used across the admin member feature. */
export type ChipColor = 'default' | 'success' | 'warning' | 'info' | 'error';

/** Member status → chip color (matches the user-facing MembersList mapping). */
export function memberStatusColor(status: MemberStatus): ChipColor {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INVITED':
      return 'info';
    case 'INACTIVE':
      return 'warning';
    case 'REMOVED':
      return 'error';
    default:
      return 'default';
  }
}

/** Invitation status → chip color. */
export function invitationStatusColor(status: InvitationStatus): ChipColor {
  switch (status) {
    case 'PENDING':
      return 'info';
    case 'ACCEPTED':
      return 'success';
    case 'EXPIRED':
      return 'default';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

/** A member can be soft-removed unless already REMOVED (backend rejects with 400). */
export function canRemoveMember(status: MemberStatus): boolean {
  return status !== 'REMOVED';
}

/**
 * Invitations can only be *accepted* while the committee is ACTIVE (documented:
 * invitations to DRAFT/PAUSED/COMPLETED/CANCELLED committees are rejected on
 * acceptance). Sending is still permitted, so this drives an informational hint
 * rather than blocking the invite form.
 */
export function canAcceptInvitations(committeeStatus: CommitteeStatus): boolean {
  return committeeStatus === 'ACTIVE';
}
