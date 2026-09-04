'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { useAuth } from '@/features/auth';
import { useGetMyCommitteesQuery } from '@/features/dashboard';
import { CommitteeCard } from '@/features/dashboard/components/CommitteeCard';
import type { CommitteeStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: CommitteeStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Paused', value: 'PAUSED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

/**
 * My Committees page.
 * Lists all committees the user is a member of, with search and status filter.
 */
export default function CommitteesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data: memberships,
    isLoading,
    isError,
    error: errorData,
  } = useGetMyCommitteesQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommitteeStatus | 'ALL'>('ALL');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Filter committees
  const filteredMemberships = memberships?.filter((m) => {
    const matchesSearch =
      searchQuery === '' ||
      m.committee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.committee.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'ALL' || m.committee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (authLoading || isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (isError) {
    const errorMessage = (errorData as { data?: { message?: string } })?.data?.message
      ?? 'Failed to load committees. Please try again.';
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          My Committees
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          View and manage your committee memberships
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' } }}>
          {/* Search */}
          <TextField
            placeholder="Search committees..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, minWidth: { sm: 280 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Status Filter Chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <FilterListOutlinedIcon sx={{ color: 'text.secondary', mr: 0.5 }} />
            {STATUS_FILTERS.map((filter) => (
              <Chip
                key={filter.value}
                label={filter.label}
                onClick={() => setStatusFilter(filter.value)}
                color={statusFilter === filter.value ? 'primary' : 'default'}
                variant={statusFilter === filter.value ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Results Count */}
      {filteredMemberships && filteredMemberships.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredMemberships.length} of {memberships?.length ?? 0} committees
        </Typography>
      )}

      {/* Committee Grid */}
      {!memberships || memberships.length === 0 ? (
        <Paper sx={{ py: 8, textAlign: 'center' }}>
          <InboxOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No committees yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            You haven&apos;t joined any committees. Accept an invitation to get started.
          </Typography>
        </Paper>
      ) : filteredMemberships && filteredMemberships.length === 0 ? (
        <Paper sx={{ py: 6, textAlign: 'center' }}>
          <GroupsOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No committees match your filters
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Try adjusting your search or filter criteria
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {filteredMemberships?.map((membership) => (
            <Grid key={membership.committee.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{ cursor: 'pointer', transition: 'transform 0.15s', '&:hover': { transform: 'translateY(-2px)' } }}
                onClick={() => router.push(`/committees/${membership.committee.id}`)}
              >
                <CommitteeCard
                  committee={membership.committee}
                  role={membership.role}
                  status={membership.status}
                  joinedAt={membership.joinedAt}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
