'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import type { CommitteeStatus } from '@/types';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteesQuery } from '../api/adminCommitteesApi';
import { AdminCommitteeCard } from './AdminCommitteeCard';
import { CommitteeFormDialog } from './CommitteeFormDialog';
import type { AdminCommittee } from '../types';

/** Status filter options — "ALL" plus every documented committee status. */
const STATUS_FILTERS: Array<CommitteeStatus | 'ALL'> = [
  'ALL',
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'CANCELLED',
];

/** Single-page fetch bound; matches the admin dashboard's committee cap. */
const LIST_LIMIT = 100;

type DialogState = { mode: 'create' | 'edit'; committee?: AdminCommittee } | null;

/**
 * Admin committees listing.
 *
 * Uses the documented GET /committees endpoint (status is a server-side filter).
 * The API has no text-search parameter, so name/description search is applied
 * client-side to the loaded committees. Create/edit reuse `CommitteeFormDialog`.
 */
export function CommitteesAdmin() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommitteeStatus | 'ALL'>('ALL');
  const [dialog, setDialog] = useState<DialogState>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetCommitteesQuery({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    limit: LIST_LIMIT,
  });

  // Stable reference so the search memo below does not recompute every render.
  const committees = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return committees;
    return committees.filter((committee) =>
      `${committee.name} ${committee.description ?? ''}`.toLowerCase().includes(term),
    );
  }, [committees, search]);

  const filtersActive = statusFilter !== 'ALL' || search.trim() !== '';
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
  };

  const refreshAction = (
    <Button
      variant="outlined"
      startIcon={<AddOutlinedIcon />}
      onClick={() => setDialog({ mode: 'create' })}
    >
      Create Committee
    </Button>
  );

  return (
    <AdminPageContainer
      title="Committees"
      breadcrumbs={[{ label: 'Committees' }]}
      actions={refreshAction}
    >
      {/* Filter toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { sm: 'center' },
          }}
        >
          <TextField
            size="small"
            placeholder="Search by name or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ flexGrow: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            aria-label="Search committees"
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <InputLabel id="committee-status-filter-label">Status</InputLabel>
            <Select
              labelId="committee-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as CommitteeStatus | 'ALL')
              }
            >
              {STATUS_FILTERS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status === 'ALL' ? 'All statuses' : status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {isLoading ? (
        <Grid container spacing={2}>
          {[0, 1, 2, 3, 4, 5].map((key) => (
            <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rounded" height={280} />
            </Grid>
          ))}
        </Grid>
      ) : isError ? (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            {(error as { data?: { message?: string } })?.data?.message ??
              'Failed to load committees. Please try again.'}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => refetch()}>
            Retry
          </Button>
        </Box>
      ) : visible.length === 0 ? (
        <Paper sx={{ py: 8, px: 3, textAlign: 'center' }}>
          {committees.length === 0 && !filtersActive ? (
            <>
              <GroupsOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No committees yet
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                Create your first committee to start managing members, cycles, and payouts.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => setDialog({ mode: 'create' })}
              >
                Create Committee
              </Button>
            </>
          ) : (
            <>
              <SearchOffOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No committees match your filters
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                Try a different search term or status.
              </Typography>
              <Button variant="outlined" onClick={clearFilters}>
                Clear filters
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isFetching ? 'Updating…' : `Showing ${visible.length} of ${total} committees`}
            {total > committees.length ? ` (first ${committees.length} loaded)` : ''}
          </Typography>
          <Grid container spacing={2}>
            {visible.map((committee) => (
              <Grid key={committee.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <AdminCommitteeCard
                  committee={committee}
                  onEdit={(target) => setDialog({ mode: 'edit', committee: target })}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <CommitteeFormDialog
        open={dialog !== null}
        mode={dialog?.mode ?? 'create'}
        committee={dialog?.committee}
        onClose={() => setDialog(null)}
      />
    </AdminPageContainer>
  );
}
