'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import type { CommitteeStatus } from '@/types';
import { useUpdateCommitteeStatusMutation } from '../api/adminCommitteesApi';
import type { AdminCommittee } from '../types';
import { committeeStatusColor, getNextStatuses } from '../utils/statusFlow';

interface UpdateStatusDialogProps {
  open: boolean;
  onClose: () => void;
  committee: AdminCommittee;
}

/** Terminal targets get an explicit warning before the admin confirms. */
const TERMINAL_WARNING: Partial<Record<CommitteeStatus, string>> = {
  COMPLETED:
    'Completing marks the committee as finished. This is a terminal status and cannot be reversed.',
  CANCELLED:
    'Cancelling ends the committee. This is a terminal status and cannot be reversed.',
};

interface UpdateStatusFormProps {
  committee: AdminCommittee;
  onClose: () => void;
}

/**
 * Status transition form for PATCH /committees/:id/status. Only the documented
 * transitions for the current status are offered; the backend still enforces the
 * lifecycle and rejects invalid or same-status transitions.
 */
function UpdateStatusForm({ committee, onClose }: UpdateStatusFormProps) {
  const allowed = getNextStatuses(committee.status);
  const [selected, setSelected] = useState<CommitteeStatus | ''>(allowed[0] ?? '');
  const [updateStatus, { isLoading }] = useUpdateCommitteeStatusMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<CommitteeStatus | null>(null);

  const onSubmit = async () => {
    if (!selected) return;
    setServerError(null);
    try {
      await updateStatus({ id: committee.id, status: selected }).unwrap();
      setDone(selected);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(
        error.data?.message ?? 'Failed to update the committee status. Please try again.',
      );
    }
  };

  if (done) {
    return (
      <>
        <DialogTitle>Status Updated</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 1.5,
            }}
          >
            <CheckCircleOutlineOutlinedIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              {committee.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={committee.status}
                color={committeeStatusColor(committee.status)}
                size="small"
                variant="outlined"
              />
              <ArrowForwardOutlinedIcon fontSize="small" color="action" />
              <Chip label={done} color={committeeStatusColor(done)} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Active members are notified of this change and it is recorded in the audit trail.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Done</Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <DialogTitle>Update Status</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current:
          </Typography>
          <Chip
            label={committee.status}
            color={committeeStatusColor(committee.status)}
            size="small"
            variant="outlined"
          />
        </Box>

        {allowed.length === 0 ? (
          <Alert severity="info">
            This committee is {committee.status}. No further status changes are allowed.
          </Alert>
        ) : (
          <>
            <FormControl fullWidth size="small">
              <InputLabel id="committee-status-select-label">New status</InputLabel>
              <Select
                labelId="committee-status-select-label"
                label="New status"
                value={selected}
                onChange={(event) => setSelected(event.target.value as CommitteeStatus)}
                disabled={isLoading}
              >
                {allowed.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selected && TERMINAL_WARNING[selected] && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {TERMINAL_WARNING[selected]}
              </Alert>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Allowed from {committee.status}: {allowed.join(', ')}. Status changes notify active
              members and are recorded in the audit trail.
            </Typography>

            {serverError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {serverError}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading} color="inherit">
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading || !selected}>
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Updating…
            </>
          ) : (
            'Update Status'
          )}
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Dialog for changing a committee's status. The form remounts on open so the
 * offered transitions always reflect the latest status.
 */
export function UpdateStatusDialog({ open, onClose, committee }: UpdateStatusDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {open ? (
        <UpdateStatusForm
          key={`${committee.id}-${committee.status}`}
          committee={committee}
          onClose={onClose}
        />
      ) : null}
    </Dialog>
  );
}
