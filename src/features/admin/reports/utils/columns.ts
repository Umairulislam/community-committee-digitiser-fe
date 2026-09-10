import type { ContributionReport, OutstandingReport, CycleReport, LotteryPayoutReport, MemberReport } from '../types';

export const ContributionReportColumns = [
  "cycleId",
  "cycleNumber",
  "cycleStatus",
  "totalExpected",
  "totalCollected",
  "totalPaid",
  "contributionCount",
  "paidCount",
  "pendingCount",
  "overdueCount"
] as const satisfies readonly (keyof ContributionReport)[];

export const OutstandingReportColumns = [
  "contributionId",
  "memberId",
  "memberName",
  "memberEmail",
  "memberStatus",
  "cycleNumber",
  "cycleStatus",
  "amount",
  "status",
  "dueDate",
  "daysOverdue"
] as const satisfies readonly (keyof OutstandingReport)[];

export const CycleReportColumns = [
  "cycleId",
  "cycleNumber",
  "status",
  "startDate",
  "endDate",
  "totalExpected",
  "totalCollected",
  "totalContributions",
  "paidContributions",
  "collectionRatePercent"
] as const satisfies readonly (keyof CycleReport)[];

export const LotteryPayoutReportColumns = [
  "cycleId",
  "cycleNumber",
  "cycleStatus",
  "totalCollected",
  "lotteryExecuted",
  "lotteryExecutedAt",
  "eligibleMemberCount",
  "winnerName",
  "winnerEmail",
  "payoutCreated",
  "payoutAmount",
  "payoutStatus",
  "payoutPaidAt",
  "payoutReference"
] as const satisfies readonly (keyof LotteryPayoutReport)[];

export const MemberReportColumns = [
  "memberId",
  "memberName",
  "memberEmail",
  "memberStatus",
  "memberRole",
  "joinedAt",
  "totalCycles",
  "paidCycles",
  "pendingCycles",
  "overdueCycles",
  "totalAmountContributed",
  "totalAmountPaid",
  "lotteryWins",
  "totalPayoutReceived"
] as const satisfies readonly (keyof MemberReport)[];
