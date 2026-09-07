'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
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
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import type { CommitteeStatus } from '@/types';
import type { InvitationStatus } from '@/features/invitations';
import { formatDate } from '@/utils';
import { useCancelInvitationMutation, useGetInvitationsQuery } from '../api/adminMembersApi';
import { invitationStatusColor } from '../utils/memberStatus';
import type { AdminInvitation } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { InviteMemberDialog } from './InviteMemberDialog';

/** Invitation status filter options — "ALL" plus every documented status. */
const STATUS_FILTERS: Array<InvitationStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'ACCEPTED',
  'EXPIRED',
  'CANCELLED',
];

/** Single-page fetch bound; matches the members listing cap. */
const LIST_LIMIT = 100;

interface InvitationsTabProps {
  committeeId: string;
  committeeName: string;
  committeeStatus: CommitteeStatus;
}

/**
 * Committee invitations for GET /committees/:committeeId/invitations.
 *
 * Status is a documented server-side filter; email search is client-side.
 * Inviting uses POST .../invitations and cancelling a PENDING invitation uses
 * POST .../invitations/:id/cancel — both behind the documented admin guard.
 */
export function InvitationsTab({ committeeId, committeeName, committeeStatus }: InvitationsTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | 'ALL'>('ALL');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<AdminInvitation | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [cancelInvitation, cancelResult] = useCancelInvitationMutation();

  const { data, isLoading, isFetching, isError, error, refetch } = useGetInvitationsQuery({
    committeeId,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    limit: LIST_LIMIT,
  });

  // Stable reference so the search memo does not recompute every render.
  const invitations = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return invitations;
    return invitations.filter((invitation) => invitation.email.toLowerCase().includes(term));
  }, [invitations, search]);

  const filtersActive = statusFilter !== 'ALL' || search.trim() !== '';
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelError(null);
    try {
      await cancelInvitation({ committeeId, id: cancelTarget.id }).unwrap();
      setCancelTarget(null);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setCancelError(e.data?.message ?? 'Failed to cancel the invitation. Please try again.');
    }
  };

  return (
    <Box>
      {/* Invite action + guidance */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 620 }}>
          Invite members by email. A single-use token is generated and pending invitations can be
          cancelled before they are accepted.
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddOutlinedIcon />}
          onClick={() => setInviteOpen(true)}
        >
          Invite Member
        </Button>
      </Box>

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
            placeholder="Search by email"
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
            aria-label="Search invitations"
          />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }}>
            <InputLabel id="invitation-status-filter-label">Status</InputLabel>
            <Select
              labelId="invitation-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as InvitationStatus | 'ALL')
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
        <Paper sx={{ p: 2 }}>
          {[0, 1, 2].map((key) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="rounded" height={14} width="36%" sx={{ mb: 0.75 }} />
                <Skeleton variant="rounded" height={12} width="24%" />
              </Box>
              <Skeleton variant="rounded" width={100} height={32} />
            </Box>
          ))}
        </Paper>
      ) : isError ? (
        <Paper sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {(error as { data?: { message?: string } })?.data?.message ??
              'Failed to load invitations. Please try again.'}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      ) : visible.length === 0 ? (
        <Paper sx={{ py: 7, px: 3, textAlign: 'center' }}>
          {invitations.length === 0 && !filtersActive ? (
            <>
              <MarkEmailReadOutlinedIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No invitations yet
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                Invite someone by email to grow this committee.
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddOutlinedIcon />}
                onClick={() => setInviteOpen(true)}
              >
                Invite Member
              </Button>
            </>
          ) : (
            <>
              <MarkEmailReadOutlinedIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No invitations match your filters
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
            {isFetching ? 'Updating…' : `Showing ${visible.length} of ${total} invitations`}
            {total > invitations.length ? ` (first ${invitations.length} loaded)` : ''}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Invitee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Sent</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((invitation) => (
                  <TableRow key={invitation.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {invitation.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invitation.status}
                        size="small"
                        color={invitationStatusColor(invitation.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(invitation.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(invitation.expiresAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {invitation.status === 'PENDING' ? (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<CancelOutlinedIcon />}
                          onClick={() => {
                            setCancelError(null);
                            setCancelTarget(invitation);
                          }}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <InviteMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        committeeId={committeeId}
        committeeName={committeeName}
        committeeStatus={committeeStatus}
      />

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancel Invitation"
        confirmLabel="Cancel Invitation"
        confirmColor="error"
        loading={cancelResult.isLoading}
        errorMessage={cancelError}
        onConfirm={handleCancel}
        onClose={() => (cancelResult.isLoading ? undefined : setCancelTarget(null))}
      >
        {cancelTarget && (
          <>
            Cancel the pending invitation for <strong>{cancelTarget.email}</strong>? The invitee will
            no longer be able to accept it. You can send a new invitation afterwards.
          </>
        )}
      </ConfirmDialog>
    </Box>
  );
}
