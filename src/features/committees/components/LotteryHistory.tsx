'use client';

import {
  Avatar,
  Box,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import type { LotteryResult } from '@/types';
import { formatDate, getInitials } from '@/utils';

interface LotteryHistoryProps {
  lotteries: LotteryResult[];
  loading?: boolean;
}

/**
 * Displays lottery history for a committee.
 */
export function LotteryHistory({ lotteries, loading }: LotteryHistoryProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Lottery History
        </Typography>
        {[1, 2].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'action.hover' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '50%' }} />
              <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '30%' }} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  if (lotteries.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Lottery History
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <EmojiEventsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No lottery draws yet
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Lottery results appear after a cycle is completed
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Lottery History ({lotteries.length})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {lotteries.map((lottery) => (
          <Box
            key={lottery.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
              }}
            >
              <EmojiEventsOutlinedIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Cycle {lottery.cycle?.cycleNumber ?? '?'}
                </Typography>
                <Chip
                  label={lottery.cycle?.status ?? 'COMPLETED'}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Winner: {lottery.winner?.user?.name ?? 'Unknown'}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {lottery.eligibleMemberCount} eligible members • Drawn {formatDate(lottery.executedAt)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              {lottery.winner?.user?.name && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: 'primary.main',
                      fontSize: '0.625rem',
                    }}
                  >
                    {getInitials(lottery.winner.user.name)}
                  </Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {lottery.winner.user.name.split(' ')[0]}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
