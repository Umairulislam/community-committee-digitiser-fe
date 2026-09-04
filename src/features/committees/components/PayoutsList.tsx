'use client';

import {
  Box,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import type { Payout, PayoutStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface PayoutsListProps {
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
 * Displays a list of committee payouts.
 */
export function PayoutsList({ payouts, loading }: PayoutsListProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Payouts
        </Typography>
        {[1, 2].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'action.hover' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '40%' }} />
              <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '30%' }} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  if (payouts.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Payouts
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No payouts yet
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Payouts are created after lottery winners are drawn
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Payouts ({payouts.length})
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {payouts.map((payout) => (
          <Box
            key={payout.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
              >
                <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(payout.amount)}
                  </Typography>
                  <Chip
                    label={payout.status}
                    size="small"
                    color={payoutStatusColor(payout.status)}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Cycle {payout.cycle?.cycleNumber ?? '?'} • {payout.member?.user?.name ?? 'Unknown'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                  <Typography variant="caption" color="text.disabled">
                    Created: {formatDate(payout.createdAt)}
                  </Typography>
                  {payout.paidAt && (
                    <Typography variant="caption" color="text.disabled">
                      Paid: {formatDate(payout.paidAt)}
                    </Typography>
                  )}
                  {payout.reference && (
                    <Typography variant="caption" color="text.disabled">
                      Ref: {payout.reference}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
