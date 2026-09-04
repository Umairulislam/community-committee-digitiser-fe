'use client';

import { Box, Chip, Paper, Typography } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import type { Payout, PayoutStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface PayoutListProps {
  payouts: Payout[];
  loading?: boolean;
}

/** Maps payout status to chip color. */
function payoutStatusColor(status: PayoutStatus): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'PROCESSING':
      return 'info';
    case 'FAILED':
      return 'error';
    default:
      return 'warning';
  }
}

/**
 * Displays a list of the user's payouts.
 */
export function PayoutList({ payouts, loading }: PayoutListProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          My Payouts
        </Typography>
        {[1, 2].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'action.hover' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '60%' }} />
              <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '40%' }} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        My Payouts
      </Typography>
      {payouts.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No payouts yet
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Payouts appear when you win a lottery
          </Typography>
        </Box>
      ) : (
        <Box>
          {payouts.map((payout) => (
            <Box
              key={payout.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                px: 1.5,
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                  }}
                >
                  <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(payout.amount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cycle {payout.cycle?.cycleNumber ?? '—'} • {formatDate(payout.paidAt ?? payout.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={payout.status}
                color={payoutStatusColor(payout.status)}
                size="small"
                variant="outlined"
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
