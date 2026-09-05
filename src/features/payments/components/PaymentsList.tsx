'use client';

import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import type { Cycle, Payment, PaymentVerificationStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface PaymentsListProps {
  payments: Payment[];
  cycles: Cycle[];
  onSelect: (paymentId: string) => void;
}

/** Maps payment status to chip color. */
function paymentStatusColor(status: PaymentVerificationStatus): 'warning' | 'success' | 'error' {
  switch (status) {
    case 'VERIFIED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'warning';
  }
}

/**
 * Displays the user's payment history for a committee.
 * Clicking a payment opens its details.
 */
export function PaymentsList({ payments, cycles, onSelect }: PaymentsListProps) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        My Payments ({payments.length})
      </Typography>
      <List disablePadding>
        {payments.map((payment) => {
          const cycle = cycles.find((c) => c.id === payment.contribution?.cycleId);
          return (
            <ListItem
              key={payment.id}
              disablePadding
              sx={{ mb: 0.5 }}
              secondaryAction={
                <Chip
                  label={payment.status}
                  color={paymentStatusColor(payment.status)}
                  size="small"
                  variant="outlined"
                />
              }
            >
              <ListItemButton
                onClick={() => onSelect(payment.id)}
                aria-label={`View payment ${payment.transactionReference}`}
                sx={{ px: 1.5, py: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
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
                    <PaymentsOutlinedIcon sx={{ fontSize: 18 }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(payment.amount)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" component="span">
                      Cycle {cycle?.cycleNumber ?? '—'} • Ref: {payment.transactionReference} •{' '}
                      {formatDate(payment.paidAt)}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
