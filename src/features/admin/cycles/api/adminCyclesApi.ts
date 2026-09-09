import { baseApi } from '@/api/baseApi';
import type { Cycle } from '@/types';
import type {
  GenerateCyclesInput,
  GenerateCyclesResponse,
  UpdateCycleStatusInput,
  LotteryCycleParams,
  AdminLotteryResult,
} from '../types';

/**
 * Admin cycle & lottery management endpoints.
 *
 * Cycle reads live in `@/features/committees`; lottery eligibility reads
 * live in `@/features/lottery`. Both are reused by the admin UI. This slice adds
 * only the admin mutations plus the lottery-specific reads and mutations
 * that the user-facing slice does not expose.
 *
 * Every route comes from docs/api-documentation.md (Cycles, Lottery sections).
 * No endpoints, fields, or behaviours are invented; the backend remains the
 * source of truth for cycle state, lottery eligibility, and winner selection.
 */
export const adminCyclesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Generate all remaining cycles for a committee in one call.
     * POST /committees/:committeeId/cycles/generate
     *
     * Cycle 1 is created ACTIVE; later cycles are UPCOMING with startDate null.
     * Each cycle's totalExpected = contributionAmount × active members.
     */
    generateCycles: builder.mutation<GenerateCyclesResponse, GenerateCyclesInput>({
      query: ({ committeeId, ...body }) => ({
        url: `/committees/${committeeId}/cycles/generate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cycle', 'Contribution'],
    }),

    /**
     * Transition a cycle's status.
     * PATCH /committees/:committeeId/cycles/:id/status
     *
     * Valid transitions: UPCOMING → ACTIVE | CANCELLED,
     * ACTIVE → COMPLETED | CANCELLED. Only one cycle may be ACTIVE at a time.
     * Activating stamps startDate; completing stamps endDate.
     */
    updateCycleStatus: builder.mutation<Cycle, UpdateCycleStatusInput>({
      query: ({ committeeId, id, status }) => ({
        url: `/committees/${committeeId}/cycles/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Cycle', 'Contribution', 'Lottery'],
    }),

    /**
     * Run the lottery draw for a cycle.
     * POST /committees/:committeeId/cycles/:cycleId/lottery/run
     *
     * In a serializable transaction: lottery result created, cycle becomes
     * COMPLETED (endDate = draw time), LOTTERY_EXECUTED audit entry written,
     * all active members notified. Unique constraint on cycleId makes double
     * execution impossible even under concurrent calls.
     */
    runLottery: builder.mutation<AdminLotteryResult, LotteryCycleParams>({
      query: ({ committeeId, cycleId }) => ({
        url: `/committees/${committeeId}/cycles/${cycleId}/lottery/run`,
        method: 'POST',
      }),
      invalidatesTags: ['Lottery', 'Cycle', 'Payout', 'Audit', 'Notification'],
    }),

    /**
     * Get the draw result for a cycle.
     * GET /committees/:committeeId/cycles/:cycleId/lottery/result
     */
    getLotteryResult: builder.query<AdminLotteryResult, LotteryCycleParams>({
      query: ({ committeeId, cycleId }) =>
        `/committees/${committeeId}/cycles/${cycleId}/lottery/result`,
      providesTags: ['Lottery'],
    }),
  }),
});

export const {
  useGenerateCyclesMutation,
  useUpdateCycleStatusMutation,
  useRunLotteryMutation,
  useGetLotteryResultQuery,
} = adminCyclesApi;

export {
  useGetLotteryEligibilityQuery,
  useGetLotteryEligibleMembersQuery,
} from '@/features/lottery/api/lotteryApi';
