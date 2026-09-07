'use client';

import { Box, Chip, Paper, Typography } from '@mui/material';
import type { CommitteeStatus } from '@/types';
import type { CommitteeStatusCount } from '../types';

interface CommitteeStatusSummaryProps {
  items: CommitteeStatusCount[];
}

/** Maps committee status to a chip colour (label text carries the meaning too). */
function statusColor(
  status: CommitteeStatus,
): 'default' | 'success' | 'warning' | 'info' | 'error' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PAUSED':
      return 'warning';
    case 'COMPLETED':
      return 'info';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Committee status summary — count of the admin's committees per lifecycle
 * status, derived from GET /committees.
 */
export function CommitteeStatusSummary({ items }: CommitteeStatusSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Committee Status
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {total} {total === 1 ? 'committee' : 'committees'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items.map((item) => (
          <Chip
            key={item.status}
            label={`${item.status} · ${item.count}`}
            color={statusColor(item.status)}
            variant="outlined"
          />
        ))}
      </Box>
    </Paper>
  );
}
