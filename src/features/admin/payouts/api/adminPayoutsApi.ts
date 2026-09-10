import { baseApi } from '@/api/baseApi';
import type { AdminPayout, PayoutCycleParams, UpdatePayoutInput } from '../types';

const payoutPath = ({ committeeId, cycleId }: PayoutCycleParams) =>
  `/committees/${committeeId}/cycles/${cycleId}/payout`;

/** Documented cycle-scoped actions; list reads reuse committeesApi.getPayouts. */
export const adminPayoutsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCyclePayout: builder.query<AdminPayout, PayoutCycleParams>({
      query: payoutPath,
      providesTags: ['Payout'],
    }),
    createAdminPayout: builder.mutation<AdminPayout, PayoutCycleParams>({
      query: (params) => ({ url: payoutPath(params), method: 'POST' }),
      invalidatesTags: ['Payout', 'Lottery', 'Audit'],
    }),
    updateAdminPayoutStatus: builder.mutation<AdminPayout, UpdatePayoutInput>({
      query: ({ id, status, reference, ...params }) => ({
        url: `${payoutPath(params)}/${id}/status`,
        method: 'PATCH',
        body: { status, ...(reference !== undefined ? { reference } : {}) },
      }),
      invalidatesTags: ['Payout', 'Lottery', 'Audit', 'Notification'],
    }),
  }),
});

export const { useGetAdminCyclePayoutQuery, useCreateAdminPayoutMutation, useUpdateAdminPayoutStatusMutation } = adminPayoutsApi;
