import type { LotteryResult, PayoutStatus } from '@/types';
import type { AdminPayout, PayoutActionStatus } from '../types';

export const PAYOUT_STATUSES: PayoutStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];

/** Presentation guard only; the backend enforces transitions atomically. */
export function payoutTransitions(status: PayoutStatus): readonly PayoutActionStatus[] {
  switch (status) {
    case 'PENDING':
    case 'FAILED': return ['PROCESSING'];
    case 'PROCESSING': return ['COMPLETED', 'FAILED'];
    default: return [];
  }
}

export function matchesLottery(payout: AdminPayout, result: LotteryResult, cycleId: string): boolean {
  return Boolean(result.winnerMemberId) && result.cycleId === cycleId &&
    payout.cycleId === cycleId && payout.cycle?.id === cycleId &&
    payout.memberId === result.winnerMemberId && payout.member?.id === result.winnerMemberId;
}

export function isNotFound(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 404;
}

export function payoutError(error: unknown): string {
  const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : null;
  if (status === 400) return 'The payout action was rejected. Refresh and check the current payout and lottery state.';
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to manage this payout.';
  if (status === 404) return 'The committee, cycle or payout is no longer available. Refresh to check its current state.';
  if (status === 409) return 'A payout already exists for this cycle. Refresh to view it.';
  return 'Unable to confirm the payout action. Refresh to check its current state before trying again.';
}
