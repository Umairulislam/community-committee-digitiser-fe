'use client';

import { useState } from 'react';
import { Alert, Box, Paper, Typography } from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useAuth } from '@/features/auth';
import { useGetCyclesQuery } from '@/features/committees';
import { useGetPaymentsQuery } from '../api/paymentsApi';
import { PaymentDetailsDialog } from './PaymentDetailsDialog';
import { PaymentsList } from './PaymentsList';

interface UserPaymentsPanelProps {
  committeeId: string;
}

/**
 * User-side payments panel for a committee.
 * Lists the current user's payment records with amount, status, transaction
 * reference, and payment date, and opens details on selection.
 */
export function UserPaymentsPanel({ committeeId }: UserPaymentsPanelProps) {
  const { user } = useAuth();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  const {
    data: payments,
    isLoading,
    isError,
    error,
  } = useGetPaymentsQuery({ committeeId });

  const {
    data: cyclesData,
    isLoading: cyclesLoading,
  } = useGetCyclesQuery({ committeeId, limit: 50 });

  // The endpoint lists committee-wide payments; show only the current user's.
  const myPayments = (payments ?? []).filter(
    (payment) => payment.contribution?.member?.user?.id === user?.id,
  );

  if (isLoading || cyclesLoading) {
    return (
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          My Payments
        </Typography>
        {[1, 2, 3].map((i) => (
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

  if (isError) {
    const errorMessage = (error as { data?: { message?: string } })?.data?.message
      ?? 'Failed to load payments. Please try again.';
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  return (
    <Box>
      {myPayments.length === 0 ? (
        <Paper sx={{ py: 8, textAlign: 'center' }}>
          <ReceiptLongOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No payments yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Your payment records will appear here after you pay a contribution.
          </Typography>
        </Paper>
      ) : (
        <PaymentsList
          payments={myPayments}
          cycles={cyclesData?.data ?? []}
          onSelect={setSelectedPaymentId}
        />
      )}

      <PaymentDetailsDialog
        open={Boolean(selectedPaymentId)}
        onClose={() => setSelectedPaymentId(null)}
        committeeId={committeeId}
        paymentId={selectedPaymentId}
        cycles={cyclesData?.data ?? []}
      />
    </Box>
  );
}
