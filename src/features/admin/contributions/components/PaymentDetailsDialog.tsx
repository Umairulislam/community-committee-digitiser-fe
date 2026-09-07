'use client';

import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import type { Cycle } from '@/types';
import { formatCurrency, formatDateTime, getInitials } from '@/utils';
import { useGetPaymentQuery } from '@/features/payments';
import { useRejectPaymentMutation, useVerifyPaymentMutation } from '../api/adminContributionsApi';
import { canActOnPayment, paymentStatusColor, contributionStatusColor } from '../utils/statusFlow';
import { cycleLabel } from './CycleSelector';
import { ConfirmDialog } from './ConfirmDialog';

interface PaymentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  committeeId: string;
  /** Null closes the dialog; the query is skipped until an id is present. */
  paymentId: string | null;
  /** Committee cycles, used only to label which cycle the payment belongs to. */
  cycles: Cycle[];
}

/** A label/value row used in the payment details body. */
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  );
}

function cycleNameFor(cycles: Cycle[], cycleId: string | undefined): string | null {
  if (!cycleId) return null;
  const cycle = cycles.find((item) => item.id === cycleId);
  return cycle ? cycleLabel(cycle) : null;
}

/**
 * Payment details + verification panel for
 * GET /committees/:committeeId/payments/:id.
 *
 * Verify and reject call the documented POST endpoints with no body. Every
 * consequence (payment status, contribution status, cycle totals, audit
 * entries, member notifications) is performed by the backend — this dialog
 * only reflects the responses it gets back.
 */
export function PaymentDetailsDialog({
  open,
  onClose,
  committeeId,
  paymentId,
  cycles,
}: PaymentDetailsDialogProps) {
  const [verifyConfirmOpen, setVerifyConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [verifyPayment, verifyResult] = useVerifyPaymentMutation();
  const [rejectPayment, rejectResult] = useRejectPaymentMutation();

  const { data: payment, isError, error } = useGetPaymentQuery(
    { committeeId, id: paymentId ?? '' },
    { skip: !open || !paymentId },
  );

  const handleClose = () => {
    if (verifyResult.isLoading || rejectResult.isLoading) return;
    setSuccessMessage(null);
    setActionError(null);
    onClose();
  };

  const handleVerify = async () => {
    if (!paymentId) return;
    setActionError(null);
    try {
      await verifyPayment({ committeeId, id: paymentId }).unwrap();
      setSuccessMessage('Payment verified. The contribution is now PAID and the member has been notified.');
      setVerifyConfirmOpen(false);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setActionError(e.data?.message ?? 'Failed to verify the payment. Please try again.');
    }
  };

  const handleReject = async () => {
    if (!paymentId) return;
    setActionError(null);
    try {
      await rejectPayment({ committeeId, id: paymentId }).unwrap();
      setSuccessMessage('Payment rejected. The member has been notified and can submit a new payment claim.');
      setRejectConfirmOpen(false);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setActionError(e.data?.message ?? 'Failed to reject the payment. Please try again.');
    }
  };

  const member = payment?.contribution?.member;
  const cycleName = cycleNameFor(cycles, payment?.contribution?.cycleId);
  const actionable = payment ? canActOnPayment(payment.status) : false;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {isError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              {(error as { data?: { message?: string } })?.data?.message ??
                'Failed to load payment details. Please try again.'}
            </Alert>
          ) : !payment ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                  {member?.user?.name ? getInitials(member.user.name) : '?'}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" noWrap>
                    {member?.user?.name ?? 'Unknown member'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {member?.user?.email ?? '—'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Payment ${payment.status}`}
                      size="small"
                      color={paymentStatusColor(payment.status)}
                    />
                    {payment.contribution && (
                      <Chip
                        label={`Contribution ${payment.contribution.status}`}
                        size="small"
                        variant="outlined"
                        color={contributionStatusColor(payment.contribution.status)}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Detail label="Amount" value={formatCurrency(payment.amount)} />
              <Detail label="Transaction reference" value={payment.transactionReference} />
              {cycleName && <Detail label="Cycle" value={cycleName} />}
              <Detail label="Paid at" value={formatDateTime(payment.paidAt)} />
              <Detail label="Verified at" value={formatDateTime(payment.verifiedAt)} />
              {payment.contribution && (
                <Detail
                  label="Contribution amount"
                  value={formatCurrency(payment.contribution.amount)}
                />
              )}
              <Detail label="Recorded" value={formatDateTime(payment.createdAt)} />

              {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccessMessage(null)}>
                  {successMessage}
                </Alert>
              )}
              {actionError && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={() => setActionError(null)}>
                  {actionError}
                </Alert>
              )}

              {!actionable && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This payment is {payment.status}. Only PENDING payments can be verified or
                  rejected.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
          {payment && actionable && (
            <>
              <Button
                color="error"
                startIcon={<BlockOutlinedIcon />}
                disabled={verifyResult.isLoading || rejectResult.isLoading}
                onClick={() => {
                  setActionError(null);
                  setRejectConfirmOpen(true);
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<TaskAltOutlinedIcon />}
                disabled={verifyResult.isLoading || rejectResult.isLoading}
                onClick={() => {
                  setActionError(null);
                  setVerifyConfirmOpen(true);
                }}
              >
                Verify
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={verifyConfirmOpen}
        title="Verify Payment"
        confirmLabel="Verify"
        confirmColor="success"
        loading={verifyResult.isLoading}
        errorMessage={actionError}
        onConfirm={handleVerify}
        onClose={() => (verifyResult.isLoading ? undefined : setVerifyConfirmOpen(false))}
      >
        Verify the payment of{' '}
        <strong>{payment ? formatCurrency(payment.amount) : 'this amount'}</strong> from{' '}
        <strong>{member?.user?.name ?? 'this member'}</strong>? The backend will mark the
        contribution PAID, update the cycle totals, write an audit entry, and notify the member.
      </ConfirmDialog>

      <ConfirmDialog
        open={rejectConfirmOpen}
        title="Reject Payment"
        confirmLabel="Reject"
        confirmColor="error"
        loading={rejectResult.isLoading}
        errorMessage={actionError}
        onConfirm={handleReject}
        onClose={() => (rejectResult.isLoading ? undefined : setRejectConfirmOpen(false))}
      >
        Reject the payment of{' '}
        <strong>{payment ? formatCurrency(payment.amount) : 'this amount'}</strong> from{' '}
        <strong>{member?.user?.name ?? 'this member'}</strong>? The member is notified and can
        submit a new payment claim — the contribution remains PENDING or OVERDUE.
      </ConfirmDialog>
    </>
  );
}
