'use client';

import { Alert, Box, Button, Grid, Paper, Typography } from '@mui/material';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetAdminDashboardQuery } from '../api/adminDashboardApi';
import { AdminStatCards } from './AdminStatCards';
import { CommitteeStatusSummary } from './CommitteeStatusSummary';
import { AdminQuickLinks } from './AdminQuickLinks';
import { ActionRequiredList } from './ActionRequiredList';
import { UpcomingPayoutsList } from './UpcomingPayoutsList';
import { RecentActivityList } from './RecentActivityList';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';

const BREADCRUMBS = [{ label: 'Dashboard' }];

/**
 * Admin Dashboard orchestrator.
 *
 * There is no backend admin-dashboard aggregate endpoint, so the data is
 * composed client-side from documented committee-scoped endpoints (see
 * `adminDashboardApi`). This component owns the loading / error / empty /
 * success states and lays the sections out responsively.
 */
export function AdminDashboard() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAdminDashboardQuery();

  const refreshAction = (
    <Button
      variant="outlined"
      startIcon={<RefreshOutlinedIcon />}
      onClick={() => refetch()}
      disabled={isFetching}
    >
      {isFetching ? 'Refreshing…' : 'Refresh'}
    </Button>
  );

  if (isLoading) {
    return (
      <AdminPageContainer title="Admin Dashboard" breadcrumbs={BREADCRUMBS}>
        <AdminDashboardSkeleton />
      </AdminPageContainer>
    );
  }

  if (isError) {
    const message =
      (error as { data?: { message?: string } })?.data?.message ??
      'Failed to load the admin dashboard. Please try again.';
    return (
      <AdminPageContainer
        title="Admin Dashboard"
        breadcrumbs={BREADCRUMBS}
        actions={refreshAction}
      >
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 2 }}>
          {message}
        </Alert>
        <Button variant="outlined" onClick={() => refetch()}>
          Retry
        </Button>
      </AdminPageContainer>
    );
  }

  if (!data) {
    return (
      <AdminPageContainer title="Admin Dashboard" breadcrumbs={BREADCRUMBS}>
        <AdminDashboardSkeleton />
      </AdminPageContainer>
    );
  }

  const isEmpty = data.stats.totalCommittees === 0;

  return (
    <AdminPageContainer
      title="Admin Dashboard"
      breadcrumbs={BREADCRUMBS}
      actions={refreshAction}
    >
      {data.isPartial && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Showing a partial overview — some committee details could not be
          loaded, so totals may be incomplete. Refresh to retry.
        </Alert>
      )}

      {isEmpty ? (
        <>
          <Paper sx={{ py: 8, px: 3, textAlign: 'center', mb: 3 }}>
            <GroupsOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No committees yet
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 480, mx: 'auto' }}>
              Once you create a committee, its members, payments, payouts, and
              activity will be summarised here.
            </Typography>
          </Paper>
          <AdminQuickLinks />
        </>
      ) : (
        <>
          <AdminStatCards stats={data.stats} />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <CommitteeStatusSummary items={data.statusSummary} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <AdminQuickLinks />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActionRequiredList
                items={data.actionRequired}
                totalCount={data.stats.pendingPayments}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <UpcomingPayoutsList items={data.upcomingPayouts} />
            </Grid>
          </Grid>

          <Box>
            <RecentActivityList items={data.recentActivity} />
          </Box>
        </>
      )}
    </AdminPageContainer>
  );
}
