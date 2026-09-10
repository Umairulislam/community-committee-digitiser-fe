'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, CircularProgress, Grid, Pagination, Paper, Typography } from '@mui/material';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteesQuery } from '@/features/admin/committees';

export function PayoutsAdmin() {
  const [page, setPage] = useState(1);
  const { currentData: data, isFetching, isError, refetch } = useGetCommitteesQuery({ page, limit: 12 });
  return (
    <AdminPageContainer title="Payouts" breadcrumbs={[{ label: 'Payouts' }]}>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Choose a committee to review payouts and manage payments to lottery winners.</Typography>
      {isFetching ? <CircularProgress aria-label="Loading committees" /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load committees.</Alert>
      ) : (
        <Box>
          {!data?.data.length && <Alert severity="info">No committees on this page.</Alert>}
          <Grid container spacing={2}>
            {data?.data.map((committee) => (
              <Grid key={committee.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6">{committee.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{committee.status}</Typography>
                  <Button component={Link} href={`/admin/payouts/${committee.id}`} variant="outlined">Manage payouts</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Pagination sx={{ mt: 3 }} page={page} count={Math.max(page, Math.ceil((data?.total ?? 0) / 12))} onChange={(_, value) => setPage(value)} />
        </Box>
      )}
    </AdminPageContainer>
  );
}
