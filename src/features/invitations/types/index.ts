/** Invitation status from the backend. */
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED';

/** Request body for POST /invitations/accept. */
export interface AcceptInvitationParams {
  token: string;
}

/** Nested committee info returned with an accepted invitation. */
export interface InvitationCommittee {
  id: string;
  name: string;
}

/** Nested inviter info returned with an accepted invitation. */
export interface InvitationInviter {
  id: string;
  name: string;
  email: string;
}

/** Full invitation response from POST /invitations/accept. */
export interface AcceptedInvitation {
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
