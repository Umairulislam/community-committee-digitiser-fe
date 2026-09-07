import { baseApi } from '@/api/baseApi';
import type { PaginatedResponse } from '@/types';
import type {
  AdminCommittee,
  CreateCommitteeInput,
  ListCommitteesParams,
  UpdateCommitteeInput,
  UpdateCommitteeStatusInput,
} from '../types';

/**
 * Admin committee-management endpoints.
 *
 * Every route comes from the documented Committees controller, which is guarded
 * by the platform `AdminGuard` and additionally checks that the requester is the
 * committee creator for single-committee operations. See
 * docs/api-documentation.md → Committees. No endpoints or fields are invented.
 */
export const adminCommitteesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List committees created by the requesting admin.
     * GET /committees (query: status?, page?, limit?)
     */
    getCommittees: builder.query<PaginatedResponse<AdminCommittee>, ListCommitteesParams>({
      query: (params) => ({ url: '/committees', params }),
      providesTags: ['Committee'],
    }),

    /**
     * Get one committee owned by the admin.
     * GET /committees/:id
     */
    getCommittee: builder.query<AdminCommittee, { id: string }>({
      query: ({ id }) => `/committees/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: 'Committee', id }],
    }),

    /**
     * Create a committee; the creator becomes its admin.
     * POST /committees
     */
    createCommittee: builder.mutation<AdminCommittee, CreateCommitteeInput>({
      query: (body) => ({ url: '/committees', method: 'POST', body }),
      invalidatesTags: ['Committee'],
    }),

    /**
     * Update editable fields — only allowed while the committee is a DRAFT.
     * PATCH /committees/:id
     */
    updateCommittee: builder.mutation<AdminCommittee, UpdateCommitteeInput>({
      query: ({ id, ...body }) => ({ url: `/committees/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Committee', id }, 'Committee'],
    }),

    /**
     * Transition committee status through the documented lifecycle.
     * PATCH /committees/:id/status
     */
    updateCommitteeStatus: builder.mutation<AdminCommittee, UpdateCommitteeStatusInput>({
      query: ({ id, status }) => ({
        url: `/committees/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Committee', id }, 'Committee'],
    }),
  }),
});

export const {
  useGetCommitteesQuery,
  useGetCommitteeQuery,
  useCreateCommitteeMutation,
  useUpdateCommitteeMutation,
  useUpdateCommitteeStatusMutation,
} = adminCommitteesApi;
