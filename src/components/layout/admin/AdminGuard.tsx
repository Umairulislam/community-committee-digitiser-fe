'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '@/features/auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

function FullScreenCenter({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      {children}
    </Box>
  );
}

/**
 * Client-side role guard for the admin area.
 *
 * Layered on top of `proxy.ts` (which blocks `/admin*` when the `jwt` cookie
 * is absent). This guard additionally requires the authenticated user to hold
 * the `ADMIN` role before rendering the admin shell.
 *
 * It keys off the explicit auth `status` rather than derived booleans so the
 * initial `idle`/`loading` window shows a spinner instead of prematurely
 * redirecting a not-yet-resolved session. The backend remains the source of
 * truth for authorisation; this is a frontend routing/UX layer only.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, status } = useAuth();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?redirect=/admin');
    }
  }, [status, router]);

  // Session still resolving, or redirecting a signed-out user to login.
  if (status === 'idle' || status === 'loading' || status === 'unauthenticated') {
    return (
      <FullScreenCenter>
        <CircularProgress />
      </FullScreenCenter>
    );
  }

  // Authenticated, but without the ADMIN role.
  if (!isAdmin) {
    return (
      <FullScreenCenter>
        <Paper sx={{ maxWidth: 440, width: '100%', p: 4, textAlign: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Access denied
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You need administrator privileges to view this area. If you believe
            this is a mistake, contact your system administrator.
          </Typography>
          <Button variant="contained" onClick={() => router.replace('/dashboard')}>
            Back to Dashboard
          </Button>
        </Paper>
      </FullScreenCenter>
    );
  }

  return <>{children}</>;
}
