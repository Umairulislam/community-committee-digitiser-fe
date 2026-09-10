import type { Cycle, Member, Payout, PayoutStatus } from '@/types';

/** Nested records are projections, as documented in the Payouts responses. */
export type AdminPayout = Omit<Payout, 'cycle' | 'member'> & {
  cycle: Pick<Cycle, 'id' | 'cycleNumber' | 'status'>;
  member: Pick<Member, 'id' | 'role' | 'status' | 'user'>;
};

export interface PayoutCycleParams {
  committeeId: string;
  cycleId: string;
}

export type PayoutActionStatus = Exclude<PayoutStatus, 'PENDING'>;

export interface UpdatePayoutInput extends PayoutCycleParams {
  id: string;
  status: PayoutActionStatus;
  reference?: string;
}
