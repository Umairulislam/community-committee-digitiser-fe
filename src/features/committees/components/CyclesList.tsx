'use client';

import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import type { Cycle, CycleStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface CyclesListProps {
  cycles: Cycle[];
  loading?: boolean;
}

/** Maps cycle status to chip color. */
function cycleStatusColor(status: CycleStatus): 'default' | 'success' | 'warning' | 'info' | 'error' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'COMPLETED':
      return 'info';
    case 'UPCOMING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Displays a list of committee cycles with progress indicators.
 */
export function CyclesList({ cycles, loading }: CyclesListProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Cycles
        </Typography>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ py: 2 }}>
            <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 1, width: '50%' }} />
            <Box sx={{ height: 8, bgcolor: 'action.hover', borderRadius: 1, width: '100%' }} />
          </Box>
        ))}
      </Paper>
    );
  }

  if (cycles.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Cycles
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <LoopOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No cycles have been generated yet
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Cycles ({cycles.length})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cycles.map((cycle) => {
          const expected = parseFloat(cycle.totalExpected) || 0;
          const collected = parseFloat(cycle.totalCollected) || 0;
          const progress = expected > 0 ? (collected / expected) * 100 : 0;

          return (
            <Box
              key={cycle.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: 1,
                borderColor: cycle.status === 'ACTIVE' ? 'primary.main' : 'divider',
                bgcolor: cycle.status === 'ACTIVE' ? 'action.hover' : 'transparent',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Cycle {cycle.cycleNumber}
                  </Typography>
                  <Chip
                    label={cycle.status}
                    size="small"
                    color={cycleStatusColor(cycle.status)}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(collected)} / {formatCurrency(expected)}
                </Typography>
              </Box>

              {/* Progress bar */}
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />

              {/* Dates */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  Started: {formatDate(cycle.startDate)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cycle.endDate ? `Ended: ${formatDate(cycle.endDate)}` : 'In progress'}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
