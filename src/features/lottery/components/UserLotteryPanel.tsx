'use client';

import { Alert, Box, Paper } from '@mui/material';
import {
  LotteryHistory,
  useGetCyclesQuery,
  useGetLotteriesQuery,
  useGetPayoutsQuery,
} from '@/features/committees';
import { CurrentLotteryCard } from './CurrentLotteryCard';

interface UserLotteryPanelProps {
  committeeId: string;
}

/**
 * User-side lottery panel for a committee: the current draw status for the
 * active cycle plus the completed lottery results enriched with payout
 * information.
 */
export function UserLotteryPanel({ committeeId }: UserLotteryPanelProps) {
  const {
    data: cyclesData,
    isLoading,
    isError,
    error,
  } = useGetCyclesQuery({ committeeId, limit: 50 });

  const {
    data: lotteriesData,
    isLoading: lotteriesLoading,
  } = useGetLotteriesQuery({ committeeId });

  // Payout records supply the payout amount/status shown alongside each
  // completed lottery result.
  const { data: payoutsData } = useGetPayoutsQuery({ committeeId, limit: 100 });

  const activeCycle = cyclesData?.data.find((cycle) => cycle.status === 'ACTIVE');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ height: 20, bgcolor: 'action.hover', borderRadius: 1, mb: 2, width: '35%' }} />
          <Box sx={{ height: 16, bgcolor: 'action.hover', borderRadius: 1, mb: 1.5, width: '50%' }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ height: 32, bgcolor: 'action.hover', borderRadius: 5, width: 120 }} />
            ))}
          </Box>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ height: 20, bgcolor: 'action.hover', borderRadius: 1, mb: 2, width: '35%' }} />
          {[1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: 'action.hover' }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '40%' }} />
                <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '55%' }} />
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    );
  }

  if (isError) {
    const errorMessage = (error as { data?: { message?: string } })?.data?.message
      ?? 'Failed to load lottery information. Please try again.';
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Current draw status */}
      {activeCycle ? (
        <CurrentLotteryCard committeeId={committeeId} cycle={activeCycle} />
      ) : (
        <Alert severity="info">
          No active cycle. The lottery runs when an active cycle is completed.
        </Alert>
      )}

      {/* Completed results with payout information */}
      <LotteryHistory
        lotteries={lotteriesData?.data ?? []}
        loading={lotteriesLoading}
        payouts={payoutsData?.data ?? []}
      />
    </Box>
  );
}
