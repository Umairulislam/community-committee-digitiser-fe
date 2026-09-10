'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, CircularProgress, Grid, Pagination, Paper, Typography } from '@mui/material';

import { useGetCommitteesQuery } from '@/features/admin/committees';

export function AdminCommitteePicker({ title, path, description }: { title: string; path: string; description: string }) {
  const [page, setPage] = useState(1);
  const { currentData: data, isFetching, isError, refetch } = useGetCommitteesQuery({ page, limit: 12 }, { refetchOnMountOrArgChange: true });
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>
      {isFetching ? <CircularProgress aria-label="Loading committees" /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load committees.</Alert>
      ) : (
        <Box>
          {!data?.data.length && <Alert severity="info">No committees on this page.</Alert>}
          <Grid container spacing={2}>
            {data?.data.map((committee) => (
              <Grid key={committee.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ overflowWrap: 'anywhere' }}>{committee.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{committee.status}</Typography>
                  <Button component={Link} href={`${path}/${committee.id}`} variant="outlined">Open committee</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Pagination sx={{ mt: 3 }} page={page} count={Math.max(page, Math.ceil((data?.total ?? 0) / 12))} onChange={(_, value) => setPage(value)} />
        </Box>
      )}
    </Box>
  );
}
