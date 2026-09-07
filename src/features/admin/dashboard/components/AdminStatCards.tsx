'use client';

import { Grid } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { StatCard } from '@/features/dashboard';
import type { AdminDashboardStats } from '../types';

interface AdminStatCardsProps {
  stats: AdminDashboardStats;
}

/**
 * Headline stat cards for the admin dashboard.
 * Reuses the shared `StatCard` primitive from the dashboard feature.
 */
export function AdminStatCards({ stats }: AdminStatCardsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Active Committees"
          value={stats.activeCommittees}
          subtitle={`${stats.totalCommittees} total`}
          icon={GroupsOutlinedIcon}
          color="primary"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          subtitle="Across your committees"
          icon={HowToRegOutlinedIcon}
          color="info"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          subtitle="Awaiting verification"
          icon={PendingActionsOutlinedIcon}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Upcoming Payouts"
          value={stats.upcomingPayouts}
          subtitle="Pending or processing"
          icon={PaymentsOutlinedIcon}
          color="secondary"
        />
      </Grid>
    </Grid>
  );
}
