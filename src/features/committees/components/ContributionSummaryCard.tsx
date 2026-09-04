'use client';

import { Box, Divider, Paper, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import type { ContributionSummary } from '@/types';
import { formatCurrency } from '@/utils';

interface ContributionSummaryCardProps {
  summary: ContributionSummary | undefined;
  loading?: boolean;
}

/**
 * Displays a contribution summary for a cycle.
 */
export function ContributionSummaryCard({ summary, loading }: ContributionSummaryCardProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Contribution Summary
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i}>
              <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '60%' }} />
              <Box sx={{ height: 20, bgcolor: 'action.hover', borderRadius: 1, width: '40%' }} />
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  if (!summary) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Contribution Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No contribution data available
        </Typography>
      </Paper>
    );
  }

  const collectionRate =
    summary.totalExpected > 0
      ? Math.round((summary.totalCollected / summary.totalExpected) * 100)
      : 0;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Contribution Summary
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <AttachMoneyOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Expected
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatCurrency(summary.totalExpected)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'success.main',
              color: 'success.contrastText',
            }}
          >
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Collected
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatCurrency(summary.totalCollected)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
            }}
          >
            <HourglassEmptyOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Pending
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatCurrency(summary.totalPending)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'error.main',
              color: 'error.contrastText',
            }}
          >
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Overdue
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatCurrency(summary.totalOverdue)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {summary.memberCount} members
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Collection Rate: {collectionRate}%
        </Typography>
      </Box>
    </Paper>
  );
}
