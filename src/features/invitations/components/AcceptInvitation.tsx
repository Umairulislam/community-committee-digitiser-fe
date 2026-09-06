'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { useAcceptInvitationMutation } from '../api/invitationsApi';
import type { AcceptedInvitation } from '../types';

/**
 * Classifies backend error responses into user-friendly messages.
 *
 * - 400: invitation already accepted/cancelled, or expired
 * - 404: invalid or unknown token
 * - 409: user is already a member of this committee
 */
function getErrorMessage(status: number | undefined, data: unknown): string {
  if (status === 400) {
    const msg = (data as { message?: string })?.message ?? '';
    if (/expir/i.test(msg)) return 'This invitation has expired. Please ask the committee admin for a new one.';
    if (/already (accepted|cancelled)/i.test(msg)) return 'This invitation has already been accepted or cancelled.';
    return 'This invitation is no longer valid.';
  }
  if (status === 409) return 'You are already a member of this committee.';
  if (status === 404) return 'Invalid invitation token. Please check the token and try again.';
  return 'Something went wrong. Please try again later.';
}

/**
 * Invitation acceptance panel.
 *
 * Supports two entry modes:
 * 1. Direct link with ?token=... — token is pre-filled, user confirms.
 * 2. Notification click with ?committeeId=... — user pastes the token.
 *
 * On success the user sees a confirmation and is redirected to the
 * committee detail page after a short delay.
 */
export function AcceptInvitation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenFromUrl = searchParams.get('token') ?? '';
  const committeeIdFromUrl = searchParams.get('committeeId') ?? '';

  const [token, setToken] = useState(tokenFromUrl);
  const [accepted, setAccepted] = useState<AcceptedInvitation | null>(null);
  const [acceptInvitation, { isLoading, error }] = useAcceptInvitationMutation();

  // Auto-redirect after successful acceptance
  useEffect(() => {
    if (accepted) {
      const timer = setTimeout(() => {
        router.replace(`/committees/${accepted.committeeId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [accepted, router]);

  const handleAccept = async () => {
    const trimmed = token.trim();
    if (!trimmed) return;

    try {
      const result = await acceptInvitation({ token: trimmed }).unwrap();
      setAccepted(result);
    } catch {
      // Error is handled via the `error` state from the mutation hook
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && token.trim().length > 0 && !isLoading) {
      handleAccept();
    }
  };

  // Error state extraction
  const errorStatus = (error as { status?: number } | undefined)?.status;
  const errorData = (error as { data?: unknown } | undefined)?.data;
  const errorMessage = error ? getErrorMessage(errorStatus, errorData) : null;

  // ── Success state ──
  if (accepted) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 480, mx: 'auto' }}>
        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Invitation Accepted!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You have joined <strong>{accepted.committee.name}</strong>.
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Redirecting to committee page…
        </Typography>
        <Box sx={{ mt: 3 }}>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  // ── Input / confirmation state ──
  return (
    <Paper sx={{ p: 4, maxWidth: 480, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <MailOutlineOutlinedIcon sx={{ fontSize: 32, color: 'primary.contrastText' }} />
        </Box>
        <Typography variant="h5" gutterBottom>
          Accept Committee Invitation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your invitation token to join the committee.
          {committeeIdFromUrl && ' The committee admin has invited you — paste the token they shared.'}
        </Typography>
      </Box>

      {/* Error alert */}
      {errorMessage && (
        <Alert
          severity={errorStatus === 409 ? 'warning' : 'error'}
          icon={<ErrorOutlineOutlinedIcon />}
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* Token input */}
      <TextField
        fullWidth
        label="Invitation Token"
        placeholder="Paste your invitation token here"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading || !!tokenFromUrl}
        slotProps={{
          htmlInput: { maxLength: 128 },
        }}
        helperText={
          !tokenFromUrl
            ? 'The admin who invited you should have shared this token.'
            : 'Token pre-filled from invitation link.'
        }
        sx={{ mb: 3 }}
      />

      {/* Accept button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GroupsOutlinedIcon />}
        disabled={!token.trim() || isLoading}
        onClick={handleAccept}
        sx={{ textTransform: 'none', py: 1.5 }}
      >
        {isLoading ? 'Accepting…' : 'Accept Invitation'}
      </Button>

      {/* Secondary actions */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          color="inherit"
          size="small"
          onClick={() => router.push('/dashboard')}
          disabled={isLoading}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Paper>
  );
}
