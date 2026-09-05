'use client';

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import type { Cycle, PaymentVerificationStatus } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils';
import { useGetPaymentQuery } from '../api/paymentsApi';

interface PaymentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  committeeId: string;
  paymentId: string | null;
  cycles: Cycle[];
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

/** Human-readable explanation per payment status. */
function paymentStatusHint(status: PaymentVerificationStatus): string {
  switch (status) {
    case 'VERIFIED':
      return 'Verified by the committee admin — the contribution is marked as paid.';
    case 'REJECTED':
      return 'Rejected by the committee admin — the contribution remains unpaid.';
    default:
      return 'Awaiting verification by the committee admin.';
  }
}

/** Label and value row used in the details layout. */
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );
}

/**
 * Dialog showing a single payment's details.
 * Fetches the payment fresh from GET /committees/:committeeId/payments/:id —
 * the backend response is the source of truth for the payment status.
 */
export function PaymentDetailsDialog({
  open,
  onClose,
  committeeId,
  paymentId,
  cycles,
}: PaymentDetailsDialogProps) {
  const {
    data: payment,
    isLoading,
    isError,
    error,
  } = useGetPaymentQuery(
    { committeeId, id: paymentId ?? '' },
    { skip: !open || !paymentId },
  );

  const cycle = payment?.contribution
    ? cycles.find((c) => c.id === payment.contribution?.cycleId)
    : undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Payment Details</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">
            {(error as { data?: { message?: string } })?.data?.message ??
              'Failed to load payment details. Please try again.'}
          </Alert>
        ) : payment ? (
          <Box>
            {/* Status header */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {formatCurrency(payment.amount)}
              </Typography>
              <Chip
                label={payment.status}
                color={paymentStatusColor(payment.status)}
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {paymentStatusHint(payment.status)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <DetailRow label="Transaction Reference" value={payment.transactionReference} />
              <DetailRow label="Payment Date" value={formatDateTime(payment.paidAt)} />
              <DetailRow
                label="Verified Date"
                value={payment.verifiedAt ? formatDateTime(payment.verifiedAt) : '—'}
              />
              <DetailRow label="Cycle" value={cycle ? `Cycle ${cycle.cycleNumber}` : '—'} />
              <DetailRow
                label="Contribution Status"
                value={
                  payment.contribution ? (
                    <Chip
                      label={payment.contribution.status}
                      size="small"
                      variant="outlined"
                      color={
                        payment.contribution.status === 'PAID'
                          ? 'success'
                          : payment.contribution.status === 'OVERDUE'
                            ? 'error'
                            : 'warning'
                      }
                    />
                  ) : (
                    '—'
                  )
                }
              />
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
