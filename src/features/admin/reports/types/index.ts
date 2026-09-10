import type { CycleStatus, MemberStatus, MemberRole, PayoutStatus } from '@/types';

export interface ContributionReport {
  cycleId: string;
  cycleNumber: number;
  cycleStatus: CycleStatus;
  totalExpected: number;
  totalCollected: number;
  totalPaid: number;
  contributionCount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export interface OutstandingReport {
  contributionId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberStatus: MemberStatus;
  cycleNumber: number;
  cycleStatus: CycleStatus;
  amount: number;
  status: 'PENDING' | 'OVERDUE';
  dueDate: string;
  daysOverdue: number;
}

export interface CycleReport {
  cycleId: string;
  cycleNumber: number;
  status: CycleStatus;
  startDate: string | null;
  endDate: string | null;
  totalExpected: number;
  totalCollected: number;
  totalContributions: number;
  paidContributions: number;
  collectionRatePercent: number;
}

export interface LotteryPayoutReport {
  cycleId: string;
  cycleNumber: number;
  cycleStatus: CycleStatus;
  totalCollected: number;
  lotteryExecuted: boolean;
  lotteryExecutedAt: string | null;
  eligibleMemberCount: number;
  winnerName: string | null;
  winnerEmail: string | null;
  payoutCreated: boolean;
  payoutAmount: number;
  payoutStatus: PayoutStatus | null;
  payoutPaidAt: string | null;
  payoutReference: string | null;
}

export interface MemberReport {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberStatus: MemberStatus;
  memberRole: MemberRole;
  joinedAt: string;
  totalCycles: number;
  paidCycles: number;
  pendingCycles: number;
  overdueCycles: number;
  totalAmountContributed: number;
  totalAmountPaid: number;
  lotteryWins: number;
  totalPayoutReceived: number;
}
