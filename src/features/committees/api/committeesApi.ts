import { baseApi } from '@/api/baseApi';
import type {
  PaginatedResponse,
  Member,
  Cycle,
  Contribution,
  ContributionSummary,
  Payout,
  LotteryResult,
  CommitteeReportSummary,
} from '@/types';

/** Pagination query params. */
interface PaginationParams {
  page?: number;
  limit?: number;
}

/** Params for member list query. */
interface MembersParams extends PaginationParams {
  committeeId: string;
  status?: string;
}

/** Params for cycle list query. */
interface CyclesParams extends PaginationParams {
  committeeId: string;
  status?: string;
}

/** Params for contribution list query. */
interface ContributionsParams extends PaginationParams {
  committeeId: string;
  cycleId: string;
  status?: string;
}

/** Params for contributions summary query. */
interface ContributionSummaryParams {
  committeeId: string;
  cycleId: string;
}

/** Params for payouts list query. */
interface PayoutsParams extends PaginationParams {
  committeeId: string;
  status?: string;
}

export const committeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List members of a committee.
     * GET /committees/:committeeId/members
     */
    getMembers: builder.query<PaginatedResponse<Member>, MembersParams>({
      query: ({ committeeId, ...params }) => ({
        url: `/committees/${committeeId}/members`,
        params,
      }),
      providesTags: ['Member'],
    }),

    /**
     * Get a single member.
     * GET /committees/:committeeId/members/:id
     */
    getMember: builder.query<Member, { committeeId: string; id: string }>({
      query: ({ committeeId, id }) => `/committees/${committeeId}/members/${id}`,
      providesTags: ['Member'],
    }),

    /**
     * List cycles for a committee.
     * GET /committees/:committeeId/cycles
     */
    getCycles: builder.query<PaginatedResponse<Cycle>, CyclesParams>({
      query: ({ committeeId, ...params }) => ({
        url: `/committees/${committeeId}/cycles`,
        params,
      }),
      providesTags: ['Cycle'],
    }),

    /**
     * Get a single cycle.
     * GET /committees/:committeeId/cycles/:id
     */
    getCycle: builder.query<Cycle, { committeeId: string; id: string }>({
      query: ({ committeeId, id }) => `/committees/${committeeId}/cycles/${id}`,
      providesTags: ['Cycle'],
    }),

    /**
     * Get contribution summary for a cycle.
     * GET /committees/:committeeId/cycles/:cycleId/contributions/summary
     */
    getContributionSummary: builder.query<ContributionSummary, ContributionSummaryParams>({
      query: ({ committeeId, cycleId }) =>
        `/committees/${committeeId}/cycles/${cycleId}/contributions/summary`,
      providesTags: ['Contribution'],
    }),

    /**
     * List contributions for a cycle.
     * GET /committees/:committeeId/cycles/:cycleId/contributions
     */
    getContributions: builder.query<PaginatedResponse<Contribution>, ContributionsParams>({
      query: ({ committeeId, cycleId, ...params }) => ({
        url: `/committees/${committeeId}/cycles/${cycleId}/contributions`,
        params,
      }),
      providesTags: ['Contribution'],
    }),

    /**
     * List lottery history for a committee.
     * GET /committees/:committeeId/lotteries
     */
    getLotteries: builder.query<{ data: LotteryResult[]; total: number }, { committeeId: string }>({
      query: ({ committeeId }) => `/committees/${committeeId}/lotteries`,
      providesTags: ['Lottery'],
    }),

    /**
     * List payouts for a committee.
     * GET /committees/:committeeId/payouts
     */
    getPayouts: builder.query<PaginatedResponse<Payout>, PayoutsParams>({
      query: ({ committeeId, ...params }) => ({
        url: `/committees/${committeeId}/payouts`,
        params,
      }),
      providesTags: ['Payout'],
    }),

    /**
     * Get committee report summary.
     * GET /committees/:committeeId/reports/summary
     */
    getReportSummary: builder.query<CommitteeReportSummary, { committeeId: string }>({
      query: ({ committeeId }) => `/committees/${committeeId}/reports/summary`,
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberQuery,
  useGetCyclesQuery,
  useGetCycleQuery,
  useGetContributionSummaryQuery,
  useGetContributionsQuery,
  useGetLotteriesQuery,
  useGetPayoutsQuery,
  useGetReportSummaryQuery,
} = committeesApi;
