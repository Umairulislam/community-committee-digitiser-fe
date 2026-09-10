'use client';

import { useRef, useState } from 'react';
import { Alert, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LotteryResult } from '@/types';
import { ConfirmDialog } from '@/features/admin/members/components/ConfirmDialog';
import { adminCyclesApi } from '@/features/admin/cycles/api/adminCyclesApi';
import { committeesApi } from '@/features/committees/api/committeesApi';
import { adminPayoutsApi, useCreateAdminPayoutMutation, useUpdateAdminPayoutStatusMutation } from '../api/adminPayoutsApi';
import type { AdminPayout, PayoutActionStatus, PayoutCycleParams } from '../types';
import { isNotFound, matchesLottery, payoutError, payoutTransitions } from '../utils/statusFlow';
import { payoutReferenceSchema, type PayoutReferenceValues } from '../schemas/payoutSchema';
import { formatCurrency } from '@/utils';

interface Props extends PayoutCycleParams {
  payout?: AdminPayout;
  lottery: LotteryResult;
  target: PayoutActionStatus | 'CREATE';
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function PayoutActionDialog({ committeeId, cycleId, payout, lottery, target, onClose, onSuccess }: Props) {
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [readPayout] = adminPayoutsApi.useLazyGetAdminCyclePayoutQuery();
  const [readLottery] = adminCyclesApi.useLazyGetLotteryResultQuery();
  const [readCycle] = committeesApi.useLazyGetCycleQuery();
  const [createPayout] = useCreateAdminPayoutMutation();
  const [updatePayout] = useUpdateAdminPayoutStatusMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<PayoutReferenceValues>({
    resolver: zodResolver(payoutReferenceSchema),
    defaultValues: { reference: payout?.reference ?? '' },
  });

  const submit = handleSubmit(async ({ reference }) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError(null);
    const params = { committeeId, cycleId };
    try {
      // Fetch again before acting. The server still arbitrates concurrent changes.
      const currentLottery = await readLottery(params, false).unwrap();
      if (!currentLottery.winnerMemberId || currentLottery.cycleId !== cycleId ||
          currentLottery.id !== lottery.id || currentLottery.winnerMemberId !== lottery.winnerMemberId) {
        setError('The lottery result has changed or is unavailable. Close this dialog and review the cycle.');
        return;
      }
      if (target === 'CREATE') {
        const cycle = await readCycle({ committeeId, id: cycleId }, false).unwrap();
        if (cycle.id !== cycleId || cycle.committeeId !== committeeId) {
          setError('The cycle could not be verified. Close this dialog and refresh.');
          return;
        }
        const existing = await readPayout(params, false);
        if (!isNotFound(existing.error)) {
          setError(existing.data ? 'A payout already exists. Close this dialog to review it.' : payoutError(existing.error));
          return;
        }
        const created = await createPayout(params).unwrap();
        onSuccess(`Payout created. Backend status: ${created.status}.`);
      } else {
        const current = await readPayout(params, false).unwrap();
        if (!payout || !matchesLottery(current, currentLottery, cycleId) ||
            current.id !== payout.id || current.updatedAt !== payout.updatedAt ||
            current.status !== payout.status || current.amount !== payout.amount ||
            current.reference !== payout.reference || !payoutTransitions(current.status).includes(target)) {
          setError('The payout has changed or does not match the lottery winner. Close this dialog and review the latest details.');
          return;
        }
        const updated = await updatePayout({ ...params, id: current.id, status: target,
          ...(reference !== (payout.reference ?? '') ? { reference } : {}),
        }).unwrap();
        onSuccess(`Payout updated. Backend status: ${updated.status}.`);
      }
    } catch (reason) {
      setError(payoutError(reason));
    } finally {
      locked.current = false;
      setBusy(false);
    }
  });

  return (
    <ConfirmDialog open title={target === 'CREATE' ? 'Create payout?' : `Mark payout as ${target}?`}
      confirmLabel={target === 'CREATE' ? 'Confirm creation' : `Confirm ${target}`}
      confirmColor={target === 'FAILED' ? 'error' : 'primary'} loading={busy} errorMessage={error}
      onClose={onClose} onConfirm={() => void submit()}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Cycle {lottery.cycle?.cycleNumber ?? cycleId} · Winner: {lottery.winner?.user?.name ?? lottery.winnerMemberId}
      </Typography>
      {payout ? <Typography variant="body2" sx={{ mb: 2 }}>{formatCurrency(payout.amount)} · {payout.status} → {target}</Typography> :
        <Typography variant="body2">The backend will create the payout using the saved lottery winner and collected funds.</Typography>}
      {target === 'COMPLETED' && <Alert severity="warning" sx={{ mb: 2 }}>Confirm only after the payout has been made. Completion is final; the backend records the paid date.</Alert>}
      {target !== 'CREATE' && <TextField label="Payout reference (optional)" fullWidth
        {...register('reference')} disabled={busy} error={Boolean(errors.reference)}
        helperText={errors.reference?.message ?? 'Up to 255 characters.'} />}
    </ConfirmDialog>
  );
}
