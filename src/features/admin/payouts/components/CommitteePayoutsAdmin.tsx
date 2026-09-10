'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, MenuItem, Pagination, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '@/features/admin/committees';
import { useGetCyclesQuery, useGetPayoutsQuery } from '@/features/committees';
import type { PayoutStatus } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils';
import { PAYOUT_STATUSES } from '../utils/statusFlow';
import { CyclePayoutPanel } from './CyclePayoutPanel';

function CommitteePayoutList({ committeeId, onSelect }: { committeeId: string; onSelect: (id: string) => void }) {
  const [status, setStatus] = useState<PayoutStatus | ''>('');
  const [page, setPage] = useState(1);
  const { currentData: data, isFetching, isError, refetch } = useGetPayoutsQuery({ committeeId, status: status || undefined, page, limit: 10 }, { refetchOnMountOrArgChange: true });
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField select label="Payout status" size="small" value={status} sx={{ minWidth: 200 }}
          onChange={(event) => { setStatus(event.target.value as PayoutStatus | ''); setPage(1); }}>
          <MenuItem value="">All statuses</MenuItem>
          {PAYOUT_STATUSES.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
        </TextField>
        <Button onClick={() => refetch()} disabled={isFetching}>Refresh</Button>
      </Box>
      {isFetching ? <CircularProgress aria-label="Loading payouts" /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load payouts.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {!data?.data.length && <Alert severity="info">No payouts match this page and status. Use Cycle payouts to view a cycle or create its payout after the lottery.</Alert>}
          {data?.data.map((payout) => (
            <Paper key={payout.id} sx={{ p: 2.5 }}>
              <Typography variant="subtitle1">{payout.member?.user?.name ?? payout.memberId} · Cycle {payout.cycle?.cycleNumber ?? payout.cycleId}</Typography>
              <Typography variant="body2">{formatCurrency(payout.amount)} · {payout.status}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere', mb: 1 }}>Reference: {payout.reference || 'Not provided'} · Paid: {formatDateTime(payout.paidAt)}</Typography>
              <Button variant="outlined" onClick={() => onSelect(payout.cycleId)}>View payout details</Button>
            </Paper>
          ))}
          <Pagination page={page} count={Math.max(page, Math.ceil((data?.total ?? 0) / 10))} onChange={(_, value) => setPage(value)} />
        </Box>
      )}
    </Box>
  );
}

function PayoutCycleSelector({ committeeId, onSelect }: { committeeId: string; onSelect: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const { currentData: data, isFetching, isError, refetch } = useGetCyclesQuery({ committeeId, page, limit: 10 });
  return (
    <Paper sx={{ p: 2.5, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Choose a cycle</Typography>
      {isFetching ? <CircularProgress aria-label="Loading cycles" /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load cycles.</Alert>
      ) : (
        <Box>
          {!data?.data.length && <Alert severity="info">No cycles on this page.</Alert>}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {data?.data.map((cycle) => <Button key={cycle.id} variant="outlined" onClick={() => onSelect(cycle.id)}>Cycle {cycle.cycleNumber} · {cycle.status}</Button>)}
          </Box>
          <Pagination page={page} count={Math.max(page, Math.ceil((data?.total ?? 0) / 10))} onChange={(_, value) => setPage(value)} />
        </Box>
      )}
    </Paper>
  );
}

export function CommitteePayoutsAdmin() {
  const { committeeId } = useParams<{ committeeId: string }>();
  return <CommitteePayoutsContent key={committeeId} committeeId={committeeId} />;
}

function CommitteePayoutsContent({ committeeId }: { committeeId: string }) {
  const { currentData: committee, isFetching, isError, refetch } = useGetCommitteeQuery({ id: committeeId });
  const [tab, setTab] = useState(0);
  const [cycleId, setCycleId] = useState('');
  const selectCycle = (id: string) => { setCycleId(id); setTab(1); };
  return (
    <AdminPageContainer title="Payout management" breadcrumbs={[{ label: 'Payouts', href: '/admin/payouts' }, { label: committee?.name ?? 'Committee' }]}
      actions={<Button component={Link} href={`/admin/committees/${committeeId}`} variant="outlined">View committee</Button>}>
      {isFetching ? <CircularProgress aria-label="Loading committee" /> : isError || !committee ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load this committee.</Alert>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>{committee.name}</Typography>
          <Tabs value={tab} onChange={(_, value: number) => setTab(value)} aria-label="Payout views" sx={{ mb: 3 }}>
            <Tab id="payout-list-tab" aria-controls="payout-list-panel" label="All payouts" />
            <Tab id="cycle-payout-tab" aria-controls="cycle-payout-panel" label="Cycle payouts" />
          </Tabs>
          {tab === 0 ? <Box role="tabpanel" id="payout-list-panel" aria-labelledby="payout-list-tab"><CommitteePayoutList committeeId={committeeId} onSelect={selectCycle} /></Box> : (
            <Box role="tabpanel" id="cycle-payout-panel" aria-labelledby="cycle-payout-tab">
              <PayoutCycleSelector committeeId={committeeId} onSelect={selectCycle} />
              {cycleId ? <CyclePayoutPanel key={cycleId} committeeId={committeeId} cycleId={cycleId} /> : <Alert severity="info">Select a cycle to view its payout and saved lottery winner.</Alert>}
            </Box>
          )}
        </Box>
      )}
    </AdminPageContainer>
  );
}
