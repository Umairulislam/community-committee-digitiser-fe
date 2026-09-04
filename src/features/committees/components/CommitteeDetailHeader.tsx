'use client';

import {
  Box,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import type { CommitteeReportSummary } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface CommitteeDetailHeaderProps {
  summary: CommitteeReportSummary;
}

/** Maps committee status to chip color. */
function statusColor(status: string): 'default' | 'success' | 'warning' | 'info' | 'error' {
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
 * Committee detail header showing key info and stats.
 */
export function CommitteeDetailHeader({ summary }: CommitteeDetailHeaderProps) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <GroupsOutlinedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {summary.name}
            </Typography>
            {summary.description && (
              <Typography variant="body2" color="text.secondary">
                {summary.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.disabled">
              Created by {summary.createdBy} on {formatDate(summary.createdAt)}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={summary.status}
          color={statusColor(summary.status)}
          variant="outlined"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(6, 1fr)',
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Contribution
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {formatCurrency(summary.contributionAmount)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Members
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {summary.activeMemberCount} / {summary.memberLimit}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total Cycles
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {summary.totalCycles}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Cycles Created
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {summary.cycleCount}
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Due Day
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {summary.dueDay}th
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EmojiEventsOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Payout Method
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Lottery
          </Typography>
        </Box>
      </Box>

      {/* Start Date */}
      {summary.startDate && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <RepeatOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Started on {formatDate(summary.startDate)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
