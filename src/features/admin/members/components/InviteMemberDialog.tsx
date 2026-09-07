'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import type { CommitteeStatus } from '@/types';
import { formatDateTime } from '@/utils';
import { useInviteMemberMutation } from '../api/adminMembersApi';
import { inviteSchema, type InviteFormData } from '../schemas/inviteSchema';
import { canAcceptInvitations } from '../utils/memberStatus';
import type { AdminInvitation, CreateInvitationInput } from '../types';

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  committeeId: string;
  committeeName: string;
  committeeStatus: CommitteeStatus;
}

type InviteFormProps = Omit<InviteMemberDialogProps, 'open'>;

/**
 * Invite-by-email form for POST /committees/:committeeId/invitations.
 *
 * Submits only the documented body fields (`email`, optional
 * `expiresAfterDays`). The backend enforces the member limit, duplicate-member
 * and pending-invitation rules (400/409) and surfaces them as `serverError`.
 */
function InviteForm({ committeeId, committeeName, committeeStatus, onClose }: InviteFormProps) {
  const [inviteMember, result] = useInviteMemberMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState<AdminInvitation | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', expiresAfterDays: '' },
  });

  const onSubmit = async (data: InviteFormData) => {
    setServerError(null);
    const body: CreateInvitationInput = { committeeId, email: data.email.trim() };
    const days = data.expiresAfterDays.trim();
    if (days) body.expiresAfterDays = parseInt(days, 10);

    try {
      const invitation = await inviteMember(body).unwrap();
      setSent(invitation);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error.data?.message ?? 'Failed to send the invitation. Please try again.');
    }
  };

  if (sent) {
    return (
      <>
        <DialogTitle>Invitation Sent</DialogTitle>
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
              {sent.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              The invitation is {sent.status} and expires {formatDateTime(sent.expiresAt)}.
            </Typography>
            {!canAcceptInvitations(committeeStatus) && (
              <Alert severity="info" sx={{ mt: 1, textAlign: 'left' }}>
                This committee is {committeeStatus}. The invitee can only accept while the
                committee is ACTIVE.
              </Alert>
            )}
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
      <DialogTitle>Invite Member</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Invite someone to join <strong>{committeeName}</strong> by email. They must have (or
          create) an account with the same email to accept the invitation.
        </Typography>

        {!canAcceptInvitations(committeeStatus) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            This committee is {committeeStatus}. Invitations can be sent now, but invitees can
            only accept while the committee is ACTIVE.
          </Alert>
        )}

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" id="invite-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            required
            autoFocus
            disabled={result.isLoading}
            placeholder="name@example.com"
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
            {...register('email')}
          />
          <TextField
            label="Expiry (days)"
            type="number"
            fullWidth
            disabled={result.isLoading}
            placeholder="7"
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            error={!!errors.expiresAfterDays}
            helperText={errors.expiresAfterDays?.message ?? 'Leave blank for the default 7 days.'}
            {...register('expiresAfterDays')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={result.isLoading} color="inherit">
          Cancel
        </Button>
        <Button type="submit" form="invite-form" disabled={result.isLoading}>
          {result.isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Sending…
            </>
          ) : (
            'Send Invitation'
          )}
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Dialog wrapper for the invite flow. The form remounts on each open (keyed) so
 * it always starts empty and clears any prior success/error state.
 */
export function InviteMemberDialog({
  open,
  onClose,
  committeeId,
  committeeName,
  committeeStatus,
}: InviteMemberDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {open ? (
        <InviteForm
          key={committeeId}
          committeeId={committeeId}
          committeeName={committeeName}
          committeeStatus={committeeStatus}
          onClose={onClose}
        />
      ) : null}
    </Dialog>
  );
}
