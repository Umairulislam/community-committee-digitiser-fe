'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { useAuth } from '@/features/auth';
import {
  StatCard,
  CommitteeCard,
  NotificationList,
  PayoutList,
  useGetMyCommitteesQuery,
  useGetNotificationsQuery,
  useGetMyPayoutsQuery,
  useGetUnreadCountQuery,
} from '@/features/dashboard';
import { formatCurrency } from '@/utils';

/**
 * User Dashboard page.
 * Displays a summary of the user's committees, contributions, payouts, and notifications.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch dashboard data
  const {
    data: memberships,
    isLoading: committeesLoading,
    isError: committeesError,
    error: committeesErrorData,
  } = useGetMyCommitteesQuery();

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
  } = useGetNotificationsQuery({ limit: 5 });

  const {
    data: payoutsData,
    isLoading: payoutsLoading,
  } = useGetMyPayoutsQuery({ limit: 5 });

  const {
    data: unreadCountData,
  } = useGetUnreadCountQuery();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Compute dashboard stats
  const activeCommittees = memberships?.filter(
    (m) => m.committee.status === 'ACTIVE' && m.status === 'ACTIVE'
  ) ?? [];

  const totalPayoutReceived = payoutsData?.data
    ?.filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0) ?? 0;

  const pendingPayouts = payoutsData?.data
    ?.filter((p) => p.status === 'PENDING' || p.status === 'PROCESSING') ?? [];

  const nextPayout = pendingPayouts.length > 0 ? pendingPayouts[0] : null;

  // Loading state
  if (authLoading || committeesLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (committeesError) {
    const errorMessage = (committeesErrorData as { data?: { message?: string } })?.data?.message
      ?? 'Failed to load dashboard data. Please try again.';
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />}>
          {errorMessage}
        </Alert>
        <Button onClick={() => router.refresh()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome back, {user?.name ?? 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Here&apos;s an overview of your committee activities
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Committees"
            value={activeCommittees.length}
            subtitle={`${memberships?.length ?? 0} total memberships`}
            icon={GroupsOutlinedIcon}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Payouts Received"
            value={formatCurrency(totalPayoutReceived)}
            subtitle={`${payoutsData?.data?.filter((p) => p.status === 'COMPLETED').length ?? 0} completed`}
            icon={PaidOutlinedIcon}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Unread Notifications"
            value={unreadCountData?.count ?? 0}
            subtitle={unreadCountData?.count ? 'New updates available' : 'All caught up'}
            icon={NotificationsOutlinedIcon}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Next Payout"
            value={nextPayout ? formatCurrency(nextPayout.amount) : '—'}
            subtitle={nextPayout ? `Status: ${nextPayout.status}` : 'No pending payouts'}
            icon={AccountBalanceWalletOutlinedIcon}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Upcoming/Action Required Items */}
      {pendingPayouts.length > 0 && (
        <Paper sx={{ p: 2.5, mb: 4, borderLeft: 4, borderColor: 'warning.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ScheduleOutlinedIcon sx={{ color: 'warning.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Upcoming Items
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {pendingPayouts.map((payout) => (
              <Box
                key={payout.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                <Typography variant="body2">
                  Payout of {formatCurrency(payout.amount)} is {payout.status.toLowerCase()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Committees */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                My Committees
              </Typography>
              {memberships && memberships.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {memberships.length} {memberships.length === 1 ? 'committee' : 'committees'}
                </Typography>
              )}
            </Box>

            {!memberships || memberships.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <InboxOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No committees yet
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                  You haven&apos;t joined any committees. Accept an invitation to get started.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {memberships.map((membership) => (
                  <Grid key={membership.committee.id} size={{ xs: 12, sm: 6 }}>
                    <CommitteeCard
                      committee={membership.committee}
                      role={membership.role}
                      status={membership.status}
                      joinedAt={membership.joinedAt}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Notifications & Payouts */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <NotificationList
              notifications={notificationsData?.data ?? []}
              loading={notificationsLoading}
            />
            <PayoutList
              payouts={payoutsData?.data ?? []}
              loading={payoutsLoading}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
