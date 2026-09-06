import { baseApi } from '@/api/baseApi';
import type { AcceptInvitationParams, AcceptedInvitation } from '../types';

export const invitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Accept an invitation using its single-use token.
     * POST /invitations/accept
     *
     * In a single transaction the invitation is marked ACCEPTED,
     * membership is created (or reactivated if previously REMOVED),
     * and a MEMBER_JOINED audit entry is recorded.
     *
     * Key errors:
     *  - 400: invitation already accepted/cancelled, or expired
     *  - 404: invalid token
     *  - 409: user is already a member
     */
    acceptInvitation: builder.mutation<AcceptedInvitation, AcceptInvitationParams>({
      query: (body) => ({
        url: '/invitations/accept',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invitation', 'Member', 'Committee', 'Notification'],
    }),
  }),
});

export const { useAcceptInvitationMutation } = invitationsApi;
