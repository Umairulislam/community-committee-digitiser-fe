import { baseApi } from '@/api/baseApi';
import type {
  AuditLog,
  Committee,
  CommitteeReportSummary,
  CommitteeStatus,
  PaginatedResponse,
  Payment,
  Payout,
  PayoutStatus,
} from '@/types';
import type {
  ActionRequiredItem,
  AdminDashboardData,
  CommitteeOverviewItem,
  CommitteeStatusCount,
  RecentActivityItem,
  UpcomingPayoutItem,
} from '../types';

/** Committee lifecycle statuses in display order (see Enum Reference). */
const COMMITTEE_STATUSES: CommitteeStatus[] = [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
];

/** Payout statuses that count as an upcoming (not-yet-completed) payout. */
const UPCOMING_PAYOUT_STATUSES: PayoutStatus[] = ['PENDING', 'PROCESSING'];

// Fan-out bounds. The backend has no admin aggregate endpoint, so the dashboard
// composes per-committee data. These caps keep the request count predictable.
const COMMITTEES_LIMIT = 100;
const MAX_ENRICHED_COMMITTEES = 25;
const PENDING_PAYMENTS_PREVIEW = 5;
const PAYOUTS_FETCH_LIMIT = 50;
const AUDIT_FETCH_LIMIT = 5;
const ACTION_REQUIRED_LIMIT = 10;
const UPCOMING_PAYOUTS_LIMIT = 10;
const RECENT_ACTIVITY_LIMIT = 10;

/** Query args for the admin committees list. */
interface AdminCommitteesArgs {
  status?: CommitteeStatus;
  page?: number;
  limit?: number;
}

/** Newest-first by ISO `createdAt`. */
function byCreatedAtDesc(a: { createdAt: string }, b: { createdAt: string }): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List committees created by the requesting admin.
     * GET /committees — Platform Admin (AdminGuard); returns only committees
     * the admin created, newest first, in a pagination envelope.
     */
    getAdminCommittees: builder.query<PaginatedResponse<Committee>, AdminCommitteesArgs>({
      query: (params) => ({ url: '/committees', params }),
      providesTags: ['Committee'],
    }),

    /**
     * Composed admin dashboard.
     *
     * There is no dedicated admin-dashboard endpoint, so this composes one from
     * documented committee-scoped endpoints (see docs/api-documentation.md):
     *   - GET /committees                              → status summary, active count
     *   - GET /committees/:id/reports/summary          → member + cycle counts
     *   - GET /committees/:id/payments?status=PENDING   → pending verifications
     *   - GET /committees/:id/payouts                   → upcoming payouts
     *   - GET /committees/:id/audit-logs                → recent admin activity
     *
     * The per-committee calls run in parallel and are individually fault
     * tolerant: one committee failing degrades to partial data (`isPartial`)
     * instead of failing the whole dashboard. Only the top-level committee list
     * is treated as fatal.
     */
    getAdminDashboard: builder.query<AdminDashboardData, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const committeesResult = await baseQuery({
          url: '/committees',
          params: { page: 1, limit: COMMITTEES_LIMIT },
        });
        if (committeesResult.error) {
          return { error: committeesResult.error };
        }

        const committeesBody = committeesResult.data as PaginatedResponse<Committee>;
        const committees = committeesBody?.data ?? [];
        const totalCommittees = committeesBody?.total ?? committees.length;

        const statusSummary: CommitteeStatusCount[] = COMMITTEE_STATUSES.map((status) => ({
          status,
          count: committees.filter((c) => c.status === status).length,
        }));
        const activeCommittees = committees.filter((c) => c.status === 'ACTIVE').length;

        const toEnrich = committees.slice(0, MAX_ENRICHED_COMMITTEES);
        let isPartial = totalCommittees > committees.length || committees.length > toEnrich.length;

        const perCommittee = await Promise.all(
          toEnrich.map(async (committee) => {
            const [summaryRes, paymentsRes, payoutsRes, auditRes] = await Promise.all([
              baseQuery(`/committees/${committee.id}/reports/summary`),
              baseQuery({
                url: `/committees/${committee.id}/payments`,
                params: { status: 'PENDING', page: 1, limit: PENDING_PAYMENTS_PREVIEW },
              }),
              baseQuery({
                url: `/committees/${committee.id}/payouts`,
                params: { page: 1, limit: PAYOUTS_FETCH_LIMIT },
              }),
              baseQuery({
                url: `/committees/${committee.id}/audit-logs`,
                params: { page: 1, limit: AUDIT_FETCH_LIMIT },
              }),
            ]);

            if (summaryRes.error || paymentsRes.error || payoutsRes.error || auditRes.error) {
              isPartial = true;
            }

            const summary = summaryRes.data as CommitteeReportSummary | undefined;
            const paymentsBody = paymentsRes.data as PaginatedResponse<Payment> | undefined;
            const payoutsBody = payoutsRes.data as PaginatedResponse<Payout> | undefined;
            const auditBody = auditRes.data as PaginatedResponse<AuditLog> | undefined;

            const upcomingPayouts = (payoutsBody?.data ?? []).filter((p) =>
              UPCOMING_PAYOUT_STATUSES.includes(p.status),
            );

            return {
              committee,
              summary,
              paymentsBody,
              auditBody,
              pendingPayments: paymentsBody?.total ?? 0,
              upcomingPayouts,
            };
          }),
        );

        const totalMembers = perCommittee.reduce(
          (sum, r) => sum + (r.summary?.activeMemberCount ?? 0),
          0,
        );
        const pendingPayments = perCommittee.reduce((sum, r) => sum + r.pendingPayments, 0);
        const upcomingPayoutsTotal = perCommittee.reduce(
          (sum, r) => sum + r.upcomingPayouts.length,
          0,
        );

        const committeeOverviews: CommitteeOverviewItem[] = perCommittee.map((r) => ({
          committee: r.committee,
          memberCount: r.summary?.memberCount ?? 0,
          activeMemberCount: r.summary?.activeMemberCount ?? 0,
          cycleCount: r.summary?.cycleCount ?? 0,
          completedCycleCount: r.summary?.completedCycleCount ?? 0,
          pendingPayments: r.pendingPayments,
          upcomingPayouts: r.upcomingPayouts.length,
        }));

        const actionRequired: ActionRequiredItem[] = perCommittee
          .flatMap((r) =>
            (r.paymentsBody?.data ?? []).map((payment) => ({
              paymentId: payment.id,
              committeeId: r.committee.id,
              committeeName: r.committee.name,
              memberName: payment.contribution?.member?.user?.name ?? 'Unknown member',
              amount: payment.amount,
              transactionReference: payment.transactionReference,
              createdAt: payment.createdAt,
            })),
          )
          .sort(byCreatedAtDesc)
          .slice(0, ACTION_REQUIRED_LIMIT);

        const upcomingPayouts: UpcomingPayoutItem[] = perCommittee
          .flatMap((r) =>
            r.upcomingPayouts.map((payout) => ({
              payoutId: payout.id,
              committeeId: r.committee.id,
              committeeName: r.committee.name,
              memberName: payout.member?.user?.name ?? 'Unknown member',
              cycleNumber: payout.cycle?.cycleNumber ?? null,
              amount: payout.amount,
              status: payout.status,
              createdAt: payout.createdAt,
            })),
          )
          .sort(byCreatedAtDesc)
          .slice(0, UPCOMING_PAYOUTS_LIMIT);

        const recentActivity: RecentActivityItem[] = perCommittee
          .flatMap((r) =>
            (r.auditBody?.data ?? []).map((log) => ({
              auditLogId: log.id,
              committeeId: r.committee.id,
              committeeName: r.committee.name,
              action: log.action,
              entityType: log.entityType,
              createdAt: log.createdAt,
            })),
          )
          .sort(byCreatedAtDesc)
          .slice(0, RECENT_ACTIVITY_LIMIT);

        const data: AdminDashboardData = {
          stats: {
            totalCommittees,
            activeCommittees,
            totalMembers,
            pendingPayments,
            upcomingPayouts: upcomingPayoutsTotal,
          },
          statusSummary,
          committees: committeeOverviews,
          actionRequired,
          upcomingPayouts,
          recentActivity,
          enrichedCommitteeCount: toEnrich.length,
          isPartial,
        };

        return { data };
      },
      providesTags: ['Committee', 'Member', 'Payment', 'Payout', 'Audit', 'Report'],
    }),
  }),
});

export const { useGetAdminCommitteesQuery, useGetAdminDashboardQuery } = adminDashboardApi;
