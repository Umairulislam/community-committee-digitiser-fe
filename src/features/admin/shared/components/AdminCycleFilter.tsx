'use client';

import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Pagination, TextField, Typography } from '@mui/material';
import { useGetCyclesQuery } from '@/features/committees';

export function AdminCycleFilter({ committeeId, value, onChange }: { committeeId: string; value: string; onChange: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const { currentData: data, isFetching, isError, refetch } = useGetCyclesQuery({ committeeId, page, limit: 25 });
  return (
    <Box sx={{ mb: 2 }}>
      <TextField select fullWidth size="small" label="Cycle" value={value} onChange={(event) => onChange(event.target.value)}>
        <MenuItem value="">All cycles</MenuItem>
        {value && (isFetching || isError || !data?.data.some((cycle) => cycle.id === value)) && <MenuItem value={value}>Selected cycle: {value}</MenuItem>}
        {!isFetching && !isError && data?.data.map((cycle) => <MenuItem key={cycle.id} value={cycle.id}>Cycle {cycle.cycleNumber}</MenuItem>)}
      </TextField>
      {isFetching ? <CircularProgress size={20} aria-label="Loading cycle options" sx={{ mt: 1 }} /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load cycle options.</Alert>
      ) : (
        <>
          {!data?.data.length && <Typography variant="body2" color="text.secondary">No cycles on this page.</Typography>}
          {(data?.total ?? 0) > 25 && <Pagination aria-label="Cycle option pages" size="small" sx={{ mt: 1 }} page={page} count={Math.max(page, Math.ceil((data?.total ?? 0) / 25))} onChange={(_, next) => setPage(next)} />}
        </>
      )}
    </Box>
  );
}
