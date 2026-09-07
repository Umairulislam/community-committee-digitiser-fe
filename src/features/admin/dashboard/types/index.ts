import type { AuditAction, Committee, CommitteeStatus, PayoutStatus } from '@/types';

/**
 * Admin dashboard types.
 *
 * The backend has no admin-dashboard aggregate endpoint, so these shapes are
 * composed on the client from documented committee-scoped endpoints (see
 * `adminDashboardApi`). All fields map to documented response fields — nothing
 * is inferred or invented.
 */

/** Headline metrics shown in the stat cards. */
export interface AdminDashboardStats {
  /** Total committees the admin has created (from GET /committees). */
  totalCommittees: number;
  /** Committees currently in ACTIVE status. */
  activeCommittees: number;
  /** Sum of `activeMemberCount` across enriched committees. */
  totalMembers: number;
  /** Sum of PENDING payments (awaiting verification) across committees. */
  pendingPayments: number;
  /** Count of payouts in PENDING or PROCESSING status across committees. */
  upcomingPayouts: number;
}

/** A single committee-status bucket in the status summary. */
export interface CommitteeStatusCount {
  status: CommitteeStatus;
  count: number;
}

/** A payment awaiting admin verification (Action Required). */
export interface ActionRequiredItem {
  paymentId: string;
  committeeId: string;
  committeeName: string;
  memberName: string;
  amount: string;
  transactionReference: string;
  createdAt: string;
}

/** A payout that has not yet completed (Upcoming Payouts). */
export interface UpcomingPayoutItem {
  payoutId: string;
  committeeId: string;
  committeeName: string;
  memberName: string;
  cycleNumber: number | null;
  amount: string;
  status: PayoutStatus;
  createdAt: string;
}

/** A recent audit-trail entry (Recent Admin Activity). */
export interface RecentActivityItem {
  auditLogId: string;
  committeeId: string;
  committeeName: string;
  action: AuditAction;
  entityType: string;
  createdAt: string;
}

/** Per-committee overview row composed from the report summary + counts. */
export interface CommitteeOverviewItem {
  committee: Committee;
  memberCount: number;
  activeMemberCount: number;
  cycleCount: number;
  completedCycleCount: number;
  pendingPayments: number;
  upcomingPayouts: number;
}

/** The fully composed admin dashboard payload. */
export interface AdminDashboardData {
  stats: AdminDashboardStats;
  statusSummary: CommitteeStatusCount[];
  committees: CommitteeOverviewItem[];
  actionRequired: ActionRequiredItem[];
  upcomingPayouts: UpcomingPayoutItem[];
  recentActivity: RecentActivityItem[];
  /** How many committees were enriched with per-committee detail. */
  enrichedCommitteeCount: number;
  /** True when enrichment was capped or some per-committee calls failed. */
  isPartial: boolean;
}
