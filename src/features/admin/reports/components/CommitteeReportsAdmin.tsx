'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Box, Button, CircularProgress, MenuItem, Pagination, TextField, Typography } from '@mui/material';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '@/features/admin/committees';
import { AdminCycleFilter } from '@/features/admin/shared/components/AdminCycleFilter';
import { useGetOutstandingReportQuery } from '../api/adminReportsApi';
import { REPORTS, type ReportArgs, type ReportKind } from '../utils/reportRequest';
import { ReportView } from './ReportView';
import { ReportExport } from './ReportExport';

export function CommitteeReportsAdmin() {
  const { committeeId } = useParams<{ committeeId: string }>();
  return <CommitteeReportsContent key={committeeId} committeeId={committeeId} />;
}

function OutstandingPages({ args, onChange }: { args: ReportArgs; onChange: (page: number) => void }) {
  const { currentData, isFetching, isError } = useGetOutstandingReportQuery(args);
  if (isFetching || isError) return null;
  return <Box sx={{ mt: 2 }}>
    <Typography variant="body2">{currentData?.total ?? 0} outstanding contributions</Typography>
    <Pagination page={args.page ?? 1} count={Math.max(args.page ?? 1, Math.ceil((currentData?.total ?? 0) / 50))} onChange={(_, page) => onChange(page)} />
  </Box>;
}

function CommitteeReportsContent({ committeeId }: { committeeId: string }) {
  const [report, setReport] = useState<ReportKind>('summary');
  const [cycleId, setCycleId] = useState('');
  const [status, setStatus] = useState<'' | 'PENDING' | 'OVERDUE'>('');
  const [page, setPage] = useState(1);
  const { currentData: committee, isFetching, isError, refetch } = useGetCommitteeQuery({ id: committeeId }, { refetchOnMountOrArgChange: true });
  const args: ReportArgs = { committeeId, report, ...(report !== 'summary' && { cycleId: cycleId || undefined }), ...(report === 'outstanding' && { status: status || undefined, page, limit: 50 }) };
  return (
    <AdminPageContainer title="Committee reports" breadcrumbs={[{ label: 'Reports', href: '/admin/reports' }, { label: committee?.name ?? 'Committee' }]}>
      {isFetching ? <CircularProgress aria-label="Loading committee" /> : isError || !committee ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load this committee.</Alert>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>{committee.name}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            <TextField select label="Report" size="small" value={report} onChange={event => { setReport(event.target.value as ReportKind); setPage(1); }}>
              {Object.entries(REPORTS).map(([key, value]) => <MenuItem key={key} value={key}>{value.label}</MenuItem>)}
            </TextField>
            {report !== 'summary' && <AdminCycleFilter committeeId={committeeId} value={cycleId} onChange={value => { setCycleId(value); setPage(1); }} />}
            {report === 'outstanding' && <TextField select label="Contribution status" size="small" value={status} onChange={event => { setStatus(event.target.value as typeof status); setPage(1); }}>
              <MenuItem value="">Pending and overdue</MenuItem><MenuItem value="PENDING">Pending</MenuItem><MenuItem value="OVERDUE">Overdue</MenuItem>
            </TextField>}
          </Box>
          {report === 'members' && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>For member participation, the cycle filter applies to contribution counts.</Typography>}
          <ReportExport key={JSON.stringify(args)} args={args} />
          <ReportView args={args} />
          {report === 'outstanding' && <OutstandingPages args={args} onChange={setPage} />}
        </Box>
      )}
    </AdminPageContainer>
  );
}
