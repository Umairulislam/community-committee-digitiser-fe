/**
 * Admin member-management types.
 *
 * Member and invitation endpoints are committee-scoped and documented in
 * `docs/api-documentation.md` (Members + Invitations). Member read endpoints
 * (list/detail) already exist in `@/features/committees` and are reused; this
 * feature adds the admin-only invitation management and member removal.
 */
import type {
  InvitationCommittee,
  InvitationInviter,
  InvitationStatus,
} from '@/features/invitations/types';

/** Full invitation record as returned by the committee invitation endpoints. */
export interface AdminInvitation {
  id: string;
  committeeId: string;
  invitedBy: string;
  email: string;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  committee: InvitationCommittee;
  inviter: InvitationInviter;
}

/** Body for POST /committees/:committeeId/invitations. */
export interface CreateInvitationInput {
  committeeId: string;
  email: string;
  /** Optional; defaults to 7 days on the backend. Must be >= 1 when provided. */
  expiresAfterDays?: number;
}

/** Query params for GET /committees/:committeeId/invitations. */
export interface ListInvitationsParams {
  committeeId: string;
  status?: InvitationStatus;
  page?: number;
  limit?: number;
}

/** Params for POST /committees/:committeeId/invitations/:id/cancel. */
export interface CancelInvitationParams {
  committeeId: string;
  id: string;
}

/** Params for DELETE /committees/:committeeId/members/:id. */
export interface RemoveMemberParams {
  committeeId: string;
  id: string;
}

/** Response from DELETE /committees/:committeeId/members/:id. */
export interface RemoveMemberResponse {
  message: string;
}
