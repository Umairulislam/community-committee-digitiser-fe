'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, MenuItem, Pagination, Tab, Tabs, TextField, Typography } from '@mui/material';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '@/features/admin/committees';
import type { AdminCommittee } from '@/features/admin/committees/types';
import { useGetAuditTimelineQuery } from '@/features/timeline/api/timelineApi';
import type { AuditAction } from '@/types';
import { useGetAdminAuditLogsQuery } from '../api/adminAuditApi';
import { AUDIT_LABELS } from '../utils/auditLabels';
import { AuditEvents } from './AuditEvents';
import { AuditCycleFilter } from './AuditCycleFilter';

function AuditHistory({ committee }: { committee: AdminCommittee }) {
  const [action, setAction] = useState<AuditAction | ''>('');
  const [entityType, setEntityType] = useState('');
  const [cycleId, setCycleId] = useState('');
  const [page, setPage] = useState(1);
  const { currentData: data, isFetching, isError, refetch } = useGetAdminAuditLogsQuery({
    committeeId: committee.id, action: action || undefined, entityType: entityType.trim() || undefined,
    cycleId: cycleId || undefined, page, limit: 25,
  }, { refetchOnMountOrArgChange: true });
  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
        <TextField select size="small" label="Action" value={action} onChange={(event) => { setAction(event.target.value as AuditAction | ''); setPage(1); }}>
          <MenuItem value="">All actions</MenuItem>
          {Object.entries(AUDIT_LABELS).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Entity type" value={entityType} helperText="Exact type, e.g. Committee, Payment, LotteryResult" onChange={(event) => { setEntityType(event.target.value); setPage(1); }} />
        <AuditCycleFilter committeeId={committee.id} value={cycleId} onChange={(value) => { setCycleId(value); setPage(1); }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button onClick={() => { setAction(''); setEntityType(''); setCycleId(''); setPage(1); }}>Clear filters</Button>
        <Button onClick={() => refetch()} disabled={isFetching}>Refresh</Button>
      </Box>
      {isFetching ? <CircularProgress aria-label="Loading audit logs" /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load audit logs. The committee may be unavailable or you may not have access.</Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{data?.total ?? 0} events · newest first</Typography>
          {!data?.data.length && <Alert severity="info">No audit events match this page and filters.</Alert>}
          <AuditEvents events={data?.data ?? []} committeeName={committee.name} creator={committee.creator} />
          <Pagination sx={{ mt: 2 }} page={page} count={Math.max(page, Math.ceil((data?.total ?? 0) / 25))} onChange={(_, value) => setPage(value)} />
        </>
      )}
    </Box>
  );
}

function AuditTimeline({ committee }: { committee: AdminCommittee }) {
  const { currentData: data, isFetching, isError, refetch } = useGetAuditTimelineQuery({ committeeId: committee.id }, { refetchOnMountOrArgChange: true });
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography color="text.secondary">Full committee history · oldest first</Typography>
        <Button onClick={() => refetch()} disabled={isFetching}>Refresh</Button>
      </Box>
      {isFetching ? <CircularProgress aria-label="Loading committee timeline" /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load the timeline. The committee may be unavailable or you may not have access.</Alert>
      ) : (
        <>
          {!data?.data.length && <Alert severity="info">No committee activity yet.</Alert>}
          <AuditEvents events={data?.data ?? []} committeeName={committee.name} creator={committee.creator} chronological />
        </>
      )}
    </Box>
  );
}

export function CommitteeAuditAdmin() {
  const { committeeId } = useParams<{ committeeId: string }>();
  return <CommitteeAuditContent key={committeeId} committeeId={committeeId} />;
}

function CommitteeAuditContent({ committeeId }: { committeeId: string }) {
  const [tab, setTab] = useState(0);
  const { currentData: committee, isFetching, isError, refetch } = useGetCommitteeQuery({ id: committeeId }, { refetchOnMountOrArgChange: true });
  return (
    <AdminPageContainer title="Audit Logs & Timeline"
      breadcrumbs={[{ label: 'Audit Logs', href: '/admin/audit-logs' }, { label: committee?.name ?? 'Committee' }]}
      actions={<Button component={Link} href={`/admin/committees/${committeeId}`} variant="outlined">View committee</Button>}>
      {isFetching ? <CircularProgress aria-label="Loading committee" /> : isError || !committee ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load this committee.</Alert>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ overflowWrap: 'anywhere', mb: 1 }}>{committee.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Audit history is read-only. Events cannot be edited or deleted.</Typography>
          <Tabs value={tab} onChange={(_, value: number) => setTab(value)} aria-label="Audit views" sx={{ mb: 3 }}>
            <Tab id="audit-history-tab" aria-controls="audit-history-panel" label="Audit history" />
            <Tab id="audit-timeline-tab" aria-controls="audit-timeline-panel" label="Timeline" />
          </Tabs>
          {tab === 0 ? <Box role="tabpanel" id="audit-history-panel" aria-labelledby="audit-history-tab"><AuditHistory committee={committee} /></Box>
            : <Box role="tabpanel" id="audit-timeline-panel" aria-labelledby="audit-timeline-tab"><AuditTimeline committee={committee} /></Box>}
        </Box>
      )}
    </AdminPageContainer>
  );
}
