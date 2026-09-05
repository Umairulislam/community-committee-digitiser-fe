'use client';

import {
  Alert,
  Box,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import type { Payout, PayoutMethod, PayoutStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface MyPayoutCardProps {
  payout: Payout;
  /** The committee's payout method, from the user's membership record. */
  payoutMethod?: PayoutMethod;
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

/** Human-friendly explanation of what the payout status means. */
function payoutStatusDetail(payout: Payout): { severity: 'success' | 'info' | 'warning'; text: string } {
  const reference = payout.reference ? ` Reference: ${payout.reference}` : '';
  switch (payout.status) {
    case 'COMPLETED':
      return {
        severity: 'success',
        text: `Payout completed on ${formatDate(payout.paidAt)}.${reference}`,
      };
    case 'PROCESSING':
      return {
        severity: 'info',
        text: `The payout is being processed by the committee admin.${reference}`,
      };
    case 'FAILED':
      return {
        severity: 'warning',
        text: `The payout attempt failed on ${formatDate(payout.updatedAt)}. The committee admin can retry it.${reference}`,
      };
    default:
      return {
        severity: 'info',
        text: `Payout created on ${formatDate(payout.createdAt)}. Awaiting processing by the committee admin.`,
      };
  }
}

/**
 * Card showing one of the user's payout records in a committee: payout
 * cycle, amount, method, status, and completed payout details. Every value
 * comes from the backend — the client never computes payout amounts.
 */
export function MyPayoutCard({ payout, payoutMethod }: MyPayoutCardProps) {
  const detail = payoutStatusDetail(payout);

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              My Payout
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cycle {payout.cycle?.cycleNumber ?? '—'}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={payout.status}
          color={payoutStatusColor(payout.status)}
          variant="outlined"
        />
      </Box>

      {/* Key facts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Payout Cycle
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Cycle {payout.cycle?.cycleNumber ?? '—'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Amount
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {formatCurrency(payout.amount)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Method
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {payoutMethod === 'LOTTERY' ? 'Lottery' : payoutMethod ?? '—'}
          </Typography>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EventOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Paid On
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {formatDate(payout.paidAt)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Status detail */}
      <Alert severity={detail.severity}>{detail.text}</Alert>
    </Paper>
  );
}
