'use client';

import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import type { ContributionSummary } from '@/types';
import { formatCurrency } from '@/utils';

interface CycleSummaryCardsProps {
  summary: ContributionSummary | undefined;
  isLoading: boolean;
}

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  color?: 'success.main' | 'warning.main' | 'error.main' | 'primary.main' | 'text.secondary';
}

function StatCard({ label, value, hint, color }: StatCardProps) {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, color: color ?? 'text.primary' }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.disabled">
          {hint}
        </Typography>
      )}
    </Paper>
  );
}

/**
 * Cycle contribution summary from
 * `GET /committees/:committeeId/cycles/:cycleId/contributions/summary`.
 *
 * Every figure is a backend aggregate — the frontend never derives totals from
 * the row list. Rendering is skipped until a summary exists.
 */
export function CycleSummaryCards({ summary, isLoading }: CycleSummaryCardsProps) {
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[0, 1, 2, 3, 4].map((key) => (
          <Grid key={key} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Skeleton variant="rounded" height={14} width="60%" sx={{ mb: 1 }} />
              <Skeleton variant="rounded" height={26} width="80%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!summary) return null;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
        <StatCard label="Expected" value={formatCurrency(summary.totalExpected)} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
        <StatCard
          label="Collected"
          value={formatCurrency(summary.totalCollected)}
          color="success.main"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
        <StatCard
          label="Pending"
          value={formatCurrency(summary.totalPending)}
          color="warning.main"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
        <StatCard
          label="Overdue"
          value={formatCurrency(summary.totalOverdue)}
          color="error.main"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
        <StatCard
          label="Contributions"
          value={String(summary.memberCount)}
          hint="members in this cycle"
        />
      </Grid>
    </Grid>
  );
}
