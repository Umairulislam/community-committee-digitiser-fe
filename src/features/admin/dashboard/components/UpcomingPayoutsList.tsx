'use client';

import { Box, Chip, Paper, Typography } from '@mui/material';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import type { PayoutStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils';
import type { UpcomingPayoutItem } from '../types';

interface UpcomingPayoutsListProps {
  items: UpcomingPayoutItem[];
}

/** Maps payout status to a chip colour (status text is shown too). */
function payoutStatusColor(
  status: PayoutStatus,
): 'default' | 'success' | 'warning' | 'error' | 'info' {
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
 * Upcoming Payouts — payouts in PENDING or PROCESSING status across the
 * admin's committees (GET /committees/:id/payouts).
 */
export function UpcomingPayoutsList({ items }: UpcomingPayoutsListProps) {
  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Upcoming Payouts
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Pending or processing
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <PaymentsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No upcoming payouts
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Payouts appear once a lottery selects a winner
          </Typography>
        </Box>
      ) : (
        <Box>
          {items.map((item) => (
            <Box
              key={item.payoutId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 1.5,
                px: 1.5,
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {formatCurrency(item.amount)} · {item.memberName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {item.committeeName}
                  {item.cycleNumber != null ? ` · Cycle ${item.cycleNumber}` : ''} ·{' '}
                  {formatDate(item.createdAt)}
                </Typography>
              </Box>
              <Chip
                label={item.status}
                color={payoutStatusColor(item.status)}
                size="small"
                variant="outlined"
                sx={{ flexShrink: 0 }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
