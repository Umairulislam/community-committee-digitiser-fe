import { baseApi } from '@/api/baseApi';
import type { PaginatedResponse } from '@/types';
import type {
  AdminInvitation,
  CancelInvitationParams,
  CreateInvitationInput,
  ListInvitationsParams,
  RemoveMemberParams,
  RemoveMemberResponse,
} from '../types';

/**
 * Admin-only member-management endpoints (all committee-scoped).
 *
 * Member reads (list/detail) already exist in `@/features/committees` and are
 * reused verbatim rather than duplicated here. This slice adds the documented
 * admin operations: invite by email, list/cancel invitations, and soft-remove a
 * member. Every operation requires the platform ADMIN role plus committee
 * ownership — the backend enforces this and remains the source of truth.
 */
export const adminMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /committees/:committeeId/invitations (status filter, paginated). */
    getInvitations: builder.query<PaginatedResponse<AdminInvitation>, ListInvitationsParams>({
      query: ({ committeeId, ...params }) => ({
        url: `/committees/${committeeId}/invitations`,
        params,
      }),
      providesTags: ['Invitation'],
    }),

    /** POST /committees/:committeeId/invitations — invite a user by email. */
    inviteMember: builder.mutation<AdminInvitation, CreateInvitationInput>({
      query: ({ committeeId, ...body }) => ({
        url: `/committees/${committeeId}/invitations`,
        method: 'POST',
        body,
      }),
      // Inviting records MEMBER_INVITED, may create an INVITED membership for an
      // existing account, and notifies that user — refresh all three caches.
      invalidatesTags: ['Invitation', 'Member', 'Notification'],
    }),

    /** POST /committees/:committeeId/invitations/:id/cancel — cancel a PENDING invite. */
    cancelInvitation: builder.mutation<AdminInvitation, CancelInvitationParams>({
      query: ({ committeeId, id }) => ({
        url: `/committees/${committeeId}/invitations/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Invitation'],
    }),

    /** DELETE /committees/:committeeId/members/:id — soft-remove (status REMOVED). */
    removeMember: builder.mutation<RemoveMemberResponse, RemoveMemberParams>({
      query: ({ committeeId, id }) => ({
        url: `/committees/${committeeId}/members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Member'],
    }),
  }),
});

export const {
  useGetInvitationsQuery,
  useInviteMemberMutation,
  useCancelInvitationMutation,
  useRemoveMemberMutation,
} = adminMembersApi;
