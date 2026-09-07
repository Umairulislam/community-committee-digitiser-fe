'use client';

import { Box, Grid, Paper, Skeleton } from '@mui/material';

/**
 * Loading placeholder that mirrors the composed admin dashboard layout
 * (stat cards → status summary + quick links → action required + upcoming
 * payouts → recent activity) so the transition to real data is stable.
 */
export function AdminDashboardSkeleton() {
  return (
    <Box>
      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[0, 1, 2, 3].map((key) => (
          <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="rounded" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" height={28} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Status summary + quick links */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Skeleton width="50%" sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[0, 1, 2, 3, 4].map((key) => (
                <Skeleton key={key} variant="rounded" width={110} height={32} />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Skeleton width="30%" sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              {[0, 1, 2, 3, 4, 5].map((key) => (
                <Grid key={key} size={{ xs: 12, sm: 6 }}>
                  <Skeleton variant="rounded" height={52} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Action required + upcoming payouts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[0, 1].map((column) => (
          <Grid key={column} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2.5, height: '100%' }}>
              <Skeleton width="40%" sx={{ mb: 2 }} />
              {[0, 1, 2].map((row) => (
                <Skeleton key={row} variant="rounded" height={56} sx={{ mb: 1 }} />
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent activity */}
      <Paper sx={{ p: 2.5 }}>
        <Skeleton width="30%" sx={{ mb: 2 }} />
        {[0, 1, 2, 3].map((row) => (
          <Skeleton key={row} variant="rounded" height={40} sx={{ mb: 1 }} />
        ))}
      </Paper>
    </Box>
  );
}
