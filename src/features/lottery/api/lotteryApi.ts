import { baseApi } from '@/api/baseApi';
import type { Member } from '@/types';

/** Lottery eligibility for a cycle, as determined exclusively by the backend. */
export interface LotteryEligibility {
  eligible: boolean;
  reason: string | null;
  eligibleMemberCount: number;
}

/** Params for cycle-scoped lottery queries. */
interface LotteryCycleParams {
  committeeId: string;
  cycleId: string;
}

export const lotteryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Check whether a cycle can run a lottery, with a reason when it cannot.
     * GET /committees/:committeeId/cycles/:cycleId/lottery/eligibility
     */
    getLotteryEligibility: builder.query<LotteryEligibility, LotteryCycleParams>({
      query: ({ committeeId, cycleId }) =>
        `/committees/${committeeId}/cycles/${cycleId}/lottery/eligibility`,
      providesTags: ['Lottery'],
    }),

    /**
     * List the members eligible for a cycle's draw.
     * GET /committees/:committeeId/cycles/:cycleId/lottery/eligible-members
     */
    getLotteryEligibleMembers: builder.query<
      { data: Member[]; total: number },
      LotteryCycleParams
    >({
      query: ({ committeeId, cycleId }) =>
        `/committees/${committeeId}/cycles/${cycleId}/lottery/eligible-members`,
      providesTags: ['Lottery'],
    }),
  }),
});

export const {
  useGetLotteryEligibilityQuery,
  useGetLotteryEligibleMembersQuery,
} = lotteryApi;
