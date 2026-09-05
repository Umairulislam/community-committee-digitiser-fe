'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import type { Contribution, Payment, PaymentVerificationStatus } from '@/types';
import { formatCurrency, formatDate } from '@/utils';
import { useCreatePaymentMutation } from '../api/paymentsApi';
import { paymentClaimSchema, type PaymentClaimFormData } from '../schemas/paymentClaimSchema';

interface PayContributionDialogProps {
  open: boolean;
  onClose: () => void;
  committeeId: string;
  contribution: Contribution;
  cycleNumber?: number;
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

/** Label and value row used in the recorded payment summary. */
function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {value}
    </Box>
  );
}

interface PayContributionFormProps {
  onClose: () => void;
  committeeId: string;
  contribution: Contribution;
  cycleNumber?: number;
}

/**
 * Dialog body — records a payment claim via POST /committees/:committeeId/payments.
 * The payment starts as PENDING and only becomes VERIFIED after the committee
 * admin verifies it, so the success state never claims the payment is final —
 * the backend response is the source of truth for the status.
 */
function PayContributionForm({ onClose, committeeId, contribution, cycleNumber }: PayContributionFormProps) {
  const [createPayment, { isLoading }] = useCreatePaymentMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  /** Payment returned by the backend after a successful claim. */
  const [recordedPayment, setRecordedPayment] = useState<Payment | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentClaimFormData>({
    resolver: zodResolver(paymentClaimSchema),
    defaultValues: { transactionReference: '' },
  });

  const onSubmit = async (data: PaymentClaimFormData) => {
    setServerError(null);
    try {
      const payment = await createPayment({
        committeeId,
        contributionId: contribution.id,
        amount: parseFloat(contribution.amount),
        transactionReference: data.transactionReference,
      }).unwrap();
      setRecordedPayment(payment);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error.data?.message ?? 'Failed to record payment. Please try again.');
    }
  };

  if (recordedPayment) {
    // ── Success state: show the backend-returned payment ──────────────────
    return (
      <>
        <DialogTitle>Payment Recorded</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 1.5 }}>
            <CheckCircleOutlineOutlinedIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Your payment has been recorded
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The committee admin will verify your payment. The contribution is marked
              as paid only after verification.
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <SummaryRow
              label="Amount"
              value={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(recordedPayment.amount)}
                </Typography>
              }
            />
            <SummaryRow
              label="Transaction Reference"
              value={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {recordedPayment.transactionReference}
                </Typography>
              }
            />
            <SummaryRow
              label="Payment Date"
              value={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatDate(recordedPayment.paidAt)}
                </Typography>
              }
            />
            <SummaryRow
              label="Status"
              value={
                <Chip
                  label={recordedPayment.status}
                  color={paymentStatusColor(recordedPayment.status)}
                  size="small"
                  variant="outlined"
                />
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Done</Button>
        </DialogActions>
      </>
    );
  }

  // ── Form state ──────────────────────────────────────────────────────────
  return (
    <>
      <DialogTitle>Pay Contribution</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Record your payment against this contribution. It will be verified by the
          committee admin.
        </Typography>

        {/* Contribution context — amounts come from the backend */}
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Amount
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {formatCurrency(contribution.amount)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Cycle
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {cycleNumber ?? '—'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                <EventOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Due Date
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatDate(contribution.dueDate)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          component="form"
          id="payment-claim-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 2.5 }}
        >
          <TextField
            label="Transaction Reference"
            placeholder="e.g. TRX-2026-1004"
            autoComplete="off"
            disabled={isLoading}
            error={!!errors.transactionReference}
            helperText={
              errors.transactionReference?.message ??
              'Enter the reference/ID from your bank transfer or payment receipt'
            }
            {...register('transactionReference')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="payment-claim-form"
          disabled={isLoading}
          startIcon={isLoading ? undefined : <PaymentsOutlinedIcon />}
        >
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Recording Payment…
            </>
          ) : (
            'Record Payment'
          )}
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Dialog for paying a contribution. The form is remounted on every open so
 * it always starts fresh.
 */
export function PayContributionDialog({
  open,
  onClose,
  committeeId,
  contribution,
  cycleNumber,
}: PayContributionDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {open ? (
        <PayContributionForm
          key={contribution.id}
          onClose={onClose}
          committeeId={committeeId}
          contribution={contribution}
          cycleNumber={cycleNumber}
        />
      ) : null}
    </Dialog>
  );
}
