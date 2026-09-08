'use client';

import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import type { AdminLotteryResult } from '../types';
import { formatCurrency, formatDateTime, getInitials } from '@/utils';

interface LotteryResultCardProps {
  result: AdminLotteryResult;
  payoutAmount?: string | null;
}

/**
 * Displays a completed lottery result: winner, cycle, eligible count,
 * execution date, and optional payout amount. The result is entirely from
 * the backend — nothing is computed on the frontend.
 */
export function LotteryResultCard({ result, payoutAmount }: LotteryResultCardProps) {
  const winner = result.winner;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
          }}
        >
          <EmojiEventsOutlinedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Lottery Result — Cycle {result.cycle?.cycleNumber ?? '?'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cycle status: {result.cycle?.status ?? 'Unknown'}
          </Typography>
        </Box>
      </Box>

      {/* Winner */}
      {winner && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: 'action.hover',
            mb: 2,
          }}
        >
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
            {getInitials(winner.user?.name ?? '?')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {winner.user?.name ?? 'Unknown Member'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {winner.user?.email ?? ''}
              {winner.user?.phone ? ` · ${winner.user.phone}` : ''}
            </Typography>
          </Box>
          <Chip label="Winner" color="success" />
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupsOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {result.eligibleMemberCount} eligible{' '}
            {result.eligibleMemberCount === 1 ? 'member' : 'members'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Executed {formatDateTime(result.executedAt)}
          </Typography>
        </Box>
        {payoutAmount && (
          <Typography variant="body2" color="text.secondary">
            Payout: {formatCurrency(payoutAmount)}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
