'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import type { Member, MemberStatus } from '@/types';
import { formatDate, getInitials } from '@/utils';
import { useGetMembersQuery } from '@/features/committees';
import { useRemoveMemberMutation } from '../api/adminMembersApi';
import { canRemoveMember, memberStatusColor } from '../utils/memberStatus';
import { ConfirmDialog } from './ConfirmDialog';
import { MemberDetailsDialog } from './MemberDetailsDialog';

/** Member status filter options — "ALL" plus every documented MemberStatus. */
const STATUS_FILTERS: Array<MemberStatus | 'ALL'> = [
  'ALL',
  'ACTIVE',
  'INACTIVE',
  'INVITED',
  'REMOVED',
];

/** Single-page fetch bound; matches the admin committees listing cap. */
const LIST_LIMIT = 100;

interface MembersTabProps {
  committeeId: string;
}

/**
 * Committee member list for GET /committees/:committeeId/members.
 *
 * Status is a documented server-side filter; name/email search is applied
 * client-side (the endpoint has no text-search param). Removing a member calls
 * the documented DELETE endpoint (soft-remove) behind a confirmation dialog.
 */
export function MembersTab({ committeeId }: MembersTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'ALL'>('ALL');
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const [removeMember, removeResult] = useRemoveMemberMutation();

  const { data, isLoading, isFetching, isError, error, refetch } = useGetMembersQuery({
    committeeId,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    limit: LIST_LIMIT,
  });

  // Stable reference so the search memo does not recompute every render.
  const members = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return members;
    return members.filter((member) =>
      `${member.user?.name ?? ''} ${member.user?.email ?? ''}`.toLowerCase().includes(term),
    );
  }, [members, search]);

  const filtersActive = statusFilter !== 'ALL' || search.trim() !== '';
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoveError(null);
    try {
      await removeMember({ committeeId, id: removeTarget.id }).unwrap();
      setRemoveTarget(null);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setRemoveError(e.data?.message ?? 'Failed to remove the member. Please try again.');
    }
  };

  return (
    <Box>
      {/* Search + status filter toolbar */}
      <Paper sx={{ p: 2, mb: 2 }}>
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
            placeholder="Search by name or email"
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
            aria-label="Search members"
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }}>
            <InputLabel id="member-status-filter-label">Status</InputLabel>
            <Select
              labelId="member-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as MemberStatus | 'ALL')}
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
        <Paper sx={{ p: 2 }}>
          {[0, 1, 2, 3, 4].map((key) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="rounded" height={14} width="40%" sx={{ mb: 0.75 }} />
                <Skeleton variant="rounded" height={12} width="28%" />
              </Box>
              <Skeleton variant="rounded" width={120} height={32} />
            </Box>
          ))}
        </Paper>
      ) : isError ? (
        <Paper sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {(error as { data?: { message?: string } })?.data?.message ??
              'Failed to load members. Please try again.'}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      ) : visible.length === 0 ? (
        <Paper sx={{ py: 7, px: 3, textAlign: 'center' }}>
          {members.length === 0 && !filtersActive ? (
            <>
              <PersonOutlineOutlinedIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No members yet
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Invite people from the Invitations tab. They appear here once they accept.
              </Typography>
            </>
          ) : (
            <>
              <PersonSearchOutlinedIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No members match your filters
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
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {isFetching ? 'Updating…' : `Showing ${visible.length} of ${total} members`}
            {total > members.length ? ` (first ${members.length} loaded)` : ''}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: '0.75rem',
                            bgcolor: member.role === 'ADMIN' ? 'secondary.main' : 'primary.main',
                          }}
                        >
                          {member.user?.name ? getInitials(member.user.name) : '?'}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                            {member.user?.name ?? 'Unknown'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {member.user?.email ?? '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.role}
                        size="small"
                        variant="outlined"
                        color={member.role === 'ADMIN' ? 'secondary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        size="small"
                        color={memberStatusColor(member.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(member.joinedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Button size="small" onClick={() => setDetailsId(member.id)}>
                          View
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<PersonRemoveOutlinedIcon />}
                          disabled={!canRemoveMember(member.status)}
                          onClick={() => {
                            setRemoveError(null);
                            setRemoveTarget(member);
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <MemberDetailsDialog
        open={detailsId !== null}
        onClose={() => setDetailsId(null)}
        committeeId={committeeId}
        memberId={detailsId}
      />

      <ConfirmDialog
        open={removeTarget !== null}
        title="Remove Member"
        confirmLabel="Remove"
        confirmColor="error"
        loading={removeResult.isLoading}
        errorMessage={removeError}
        onConfirm={handleRemove}
        onClose={() => (removeResult.isLoading ? undefined : setRemoveTarget(null))}
      >
        {removeTarget && (
          <>
            Remove <strong>{removeTarget.user?.name ?? removeTarget.user?.email ?? 'this member'}</strong>{' '}
            from the committee? Their membership is marked REMOVED and the change is recorded in the
            audit trail. This does not delete their account.
          </>
        )}
      </ConfirmDialog>
    </Box>
  );
}
