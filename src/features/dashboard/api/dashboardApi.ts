import { baseApi } from '@/api/baseApi';
import type { MyCommitteeMembership, Payout } from '@/types';

/** Query params for paginated list endpoints. */
interface PaginationParams {
  page?: number;
  limit?: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List the authenticated user's committee memberships.
     * GET /committees/my-committees
     */
    getMyCommittees: builder.query<MyCommitteeMembership[], void>({
      query: () => '/committees/my-committees',
      providesTags: ['Committee'],
    }),

    /**
     * List the authenticated user's payouts across all committees.
     * GET /my-payouts
     */
    getMyPayouts: builder.query<{ data: Payout[]; total: number }, PaginationParams>({
      query: (params) => ({
        url: '/my-payouts',
        params,
      }),
      providesTags: ['Payout'],
    }),
  }),
});

export const {
  useGetMyCommitteesQuery,
  useGetMyPayoutsQuery,
} = dashboardApi;
