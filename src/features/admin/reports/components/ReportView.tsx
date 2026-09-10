'use client';

import { Alert, Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useGetReportSummaryQuery } from '@/features/committees';
import { useGetContributionReportQuery, useGetOutstandingReportQuery, useGetCycleReportQuery, useGetLotteryPayoutReportQuery, useGetMemberReportQuery } from '../api/adminReportsApi';
import { ContributionReportColumns, OutstandingReportColumns, CycleReportColumns, LotteryPayoutReportColumns, MemberReportColumns } from '../utils/columns';
import { REPORTS, type ReportArgs } from '../utils/reportRequest';
import { formatReportValue, reportFieldLabel } from '../utils/formatReport';
import { ReportTable } from './ReportTable';
import type { CommitteeReportSummary } from '@/types';

const summaryFields = ['name', 'description', 'status', 'contributionAmount', 'memberLimit', 'totalCycles', 'dueDay', 'startDate', 'createdBy', 'createdAt', 'memberCount', 'activeMemberCount', 'cycleCount', 'completedCycleCount'] as const satisfies readonly (keyof CommitteeReportSummary)[];

export function ReportView({ args }: { args: ReportArgs }) {
  const summary = useGetReportSummaryQuery({ committeeId: args.committeeId }, { skip: args.report !== 'summary', refetchOnMountOrArgChange: true });
  const contributionReport = useGetContributionReportQuery(args, { skip: args.report !== 'contributions', refetchOnMountOrArgChange: true });
  const outstandingReport = useGetOutstandingReportQuery(args, { skip: args.report !== 'outstanding', refetchOnMountOrArgChange: true });
  const cycleReport = useGetCycleReportQuery(args, { skip: args.report !== 'cycles', refetchOnMountOrArgChange: true });
  const lotteryPayoutReport = useGetLotteryPayoutReportQuery(args, { skip: args.report !== 'lottery-payouts', refetchOnMountOrArgChange: true });
  const memberReport = useGetMemberReportQuery(args, { skip: args.report !== 'members', refetchOnMountOrArgChange: true });
  const result = args.report === 'summary' ? summary : args.report === 'contributions' ? contributionReport : args.report === 'outstanding' ? outstandingReport : args.report === 'cycles' ? cycleReport : args.report === 'lottery-payouts' ? lotteryPayoutReport : memberReport;
  return (
    <Box>
      <Button disabled={result.isFetching} onClick={() => result.refetch()} sx={{ mb: 2 }}>Refresh report</Button>
      {result.isFetching ? <CircularProgress aria-label="Loading report" /> : result.isError ? (
        <Alert severity="error" action={<Button onClick={() => result.refetch()}>Retry</Button>}>Unable to load this report. The committee may be unavailable or you may not have access.</Alert>
      ) : (
        <>
          {args.report === 'summary' && (summary.currentData ? <Grid container spacing={2}>{summaryFields.map(key => <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}><Paper sx={{ p: 2, height: '100%', overflowWrap: 'anywhere' }}><Typography variant="body2" color="text.secondary">{reportFieldLabel(key)}</Typography><Typography>{formatReportValue(key, summary.currentData?.[key])}</Typography></Paper></Grid>)}</Grid> : <Alert severity="info">No committee summary available.</Alert>)}
          {args.report === 'contributions' && <ReportTable rows={contributionReport.currentData?.data ?? []} columns={ContributionReportColumns} rowKey="cycleId" label={REPORTS[args.report].label} />}
          {args.report === 'outstanding' && <ReportTable rows={outstandingReport.currentData?.data ?? []} columns={OutstandingReportColumns} rowKey="contributionId" label={REPORTS[args.report].label} />}
          {args.report === 'cycles' && <ReportTable rows={cycleReport.currentData?.data ?? []} columns={CycleReportColumns} rowKey="cycleId" label={REPORTS[args.report].label} />}
          {args.report === 'lottery-payouts' && <ReportTable rows={lotteryPayoutReport.currentData?.data ?? []} columns={LotteryPayoutReportColumns} rowKey="cycleId" label={REPORTS[args.report].label} />}
          {args.report === 'members' && <ReportTable rows={memberReport.currentData?.data ?? []} columns={MemberReportColumns} rowKey="memberId" label={REPORTS[args.report].label} />}
        </>
      )}
    </Box>
  );
}
