'use client';

import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useGetCycleQuery } from '@/features/committees/api/committeesApi';
import { useGetLotteryResultQuery } from '@/features/admin/cycles/api/adminCyclesApi';
import { useGetAdminCyclePayoutQuery } from '../api/adminPayoutsApi';
import type { AdminPayout, PayoutActionStatus, PayoutCycleParams } from '../types';
import { isNotFound, matchesLottery, payoutTransitions } from '../utils/statusFlow';
import { PayoutSummary } from './PayoutSummary';
import { PayoutActionDialog } from './PayoutActionDialog';
import type { LotteryResult } from '@/types';
import { formatDateTime } from '@/utils';

export function CyclePayoutPanel({ committeeId, cycleId }: PayoutCycleParams) {
  const options = { refetchOnMountOrArgChange: true };
  const cycleQuery = useGetCycleQuery({ committeeId, id: cycleId }, options);
  const payoutQuery = useGetAdminCyclePayoutQuery({ committeeId, cycleId }, options);
  const lotteryQuery = useGetLotteryResultQuery({ committeeId, cycleId }, options);
  const [success, setSuccess] = useState('');
  const [action, setAction] = useState<{ target: PayoutActionStatus | 'CREATE'; payout?: AdminPayout; lottery: LotteryResult } | null>(null);
  const payout = payoutQuery.currentData;
  const lottery = lotteryQuery.currentData;
  const cycle = cycleQuery.currentData;
  const busy = cycleQuery.isFetching || payoutQuery.isFetching || lotteryQuery.isFetching;
  const validCycle = !cycleQuery.isError && cycle?.id === cycleId && cycle.committeeId === committeeId;
  const validLottery = !lotteryQuery.isError && lottery?.cycleId === cycleId && Boolean(lottery.winnerMemberId);
  const canUpdate = validCycle && validLottery && payout && !payoutQuery.isError && matchesLottery(payout, lottery!, cycleId);
  const canCreate = validCycle && validLottery && isNotFound(payoutQuery.error);
  const refresh = () => { void cycleQuery.refetch(); void payoutQuery.refetch(); void lotteryQuery.refetch(); };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="h6">Cycle payout details</Typography>
        <Button onClick={refresh} disabled={busy}>Refresh</Button>
      </Box>
      {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}
      {busy ? <CircularProgress aria-label="Loading payout details" /> : !validCycle ? (
        <Alert severity="error">Unable to load this cycle. Refresh to try again.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2">Cycle {cycle.cycleNumber} · {cycle.status} · Started {formatDateTime(cycle.startDate)} · Ended {formatDateTime(cycle.endDate)}</Typography>
          {payoutQuery.isError ? (
            <Alert severity={isNotFound(payoutQuery.error) ? 'info' : 'error'}>
              {isNotFound(payoutQuery.error) ? 'No payout exists for this cycle.' : 'Unable to load the payout. Refresh to try again.'}
            </Alert>
          ) : payout ? <PayoutSummary payout={payout} /> : <Alert severity="error">Payout details are unavailable.</Alert>}
          {!validLottery ? <Alert severity={isNotFound(lotteryQuery.error) ? 'info' : 'error'}>
            {isNotFound(lotteryQuery.error) ? 'No saved lottery winner exists for this cycle. Run its lottery before creating a payout.' : 'The saved lottery winner could not be verified. Payout actions are unavailable.'}
          </Alert> : <Typography variant="body2">Lottery winner: {lottery?.winner?.user?.name ?? lottery?.winnerMemberId} · Drawn {formatDateTime(lottery?.executedAt)}</Typography>}
          {payout && validLottery && !payoutQuery.isError && !canUpdate && <Alert severity="error">This payout does not match the saved lottery winner. Actions are unavailable.</Alert>}
          {payout?.status === 'COMPLETED' && !payoutQuery.isError && <Alert severity="info">This payout is completed and cannot be changed.</Alert>}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {canCreate && lottery && <Button variant="contained" onClick={() => { setSuccess(''); setAction({ target: 'CREATE', lottery }); }}>Create payout</Button>}
            {canUpdate && payout && lottery && payoutTransitions(payout.status).map((target) => (
              <Button key={target} variant="outlined" color={target === 'FAILED' ? 'error' : 'primary'}
                onClick={() => { setSuccess(''); setAction({ target, payout, lottery }); }}>
                {payout.status === 'FAILED' ? 'Retry processing' : `Mark ${target}`}
              </Button>
            ))}
          </Box>
        </Box>
      )}
      {action && <PayoutActionDialog {...action} committeeId={committeeId} cycleId={cycleId}
        onClose={() => setAction(null)} onSuccess={(message) => { setAction(null); setSuccess(message); refresh(); }} />}
    </Paper>
  );
}
