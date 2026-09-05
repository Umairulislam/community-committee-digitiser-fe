'use client';

import { Alert, Box, Paper, Typography } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { PayoutsList, useGetPayoutsQuery } from '@/features/committees';
import { useGetMyCommitteesQuery, useGetMyPayoutsQuery } from '@/features/dashboard';
import { MyPayoutCard } from './MyPayoutCard';

interface UserPayoutsPanelProps {
  committeeId: string;
}

/**
 * User-side payouts panel for a committee: the user's own payout record
 * (payout cycle, amount, method, status, and completed payout details)
 * followed by the committee's payout history. All values come from the
 * backend — the client never computes payout amounts or predicts winners.
 */
export function UserPayoutsPanel({ committeeId }: UserPayoutsPanelProps) {
  const {
    data: myPayoutsData,
    isLoading,
    isError,
    error,
  } = useGetMyPayoutsQuery({ limit: 100 });

  // The committee's payout method comes from the user's membership record.
  const { data: memberships } = useGetMyCommitteesQuery();

  const {
    data: payoutsData,
    isLoading: payoutsLoading,
  } = useGetPayoutsQuery({ committeeId, limit: 100 });

  // /my-payouts spans all committees; keep only this committee's payouts.
  const myPayouts = (myPayoutsData?.data ?? []).filter(
    (payout) => payout.cycle?.committeeId === committeeId,
  );

  const payoutMethod = memberships?.find(
    (membership) => membership.committee.id === committeeId,
  )?.committee.payoutMethod;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* My payout */}
      {isLoading ? (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ height: 20, bgcolor: 'action.hover', borderRadius: 1, mb: 2, width: '35%' }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i}>
                <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '60%' }} />
                <Box sx={{ height: 24, bgcolor: 'action.hover', borderRadius: 1, width: '70%' }} />
              </Box>
            ))}
          </Box>
        </Paper>
      ) : isError ? (
        <Alert severity="error">
          {(error as { data?: { message?: string } })?.data?.message
            ?? 'Failed to load your payout. Please try again.'}
        </Alert>
      ) : myPayouts.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No payout in this committee yet
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
              With the lottery payout method, the cycle&apos;s collected pool is paid to
              the draw winner.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Your payout details will appear here after you win a draw.
            </Typography>
          </Box>
        </Paper>
      ) : (
        myPayouts.map((payout) => (
          <MyPayoutCard key={payout.id} payout={payout} payoutMethod={payoutMethod} />
        ))
      )}

      {/* Committee payout history */}
      <PayoutsList payouts={payoutsData?.data ?? []} loading={payoutsLoading} />
    </Box>
  );
}
