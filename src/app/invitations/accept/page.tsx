'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Container } from '@mui/material';
import { useAuth } from '@/features/auth';
import { AcceptInvitation } from '@/features/invitations';

/**
 * Invitation acceptance page.
 *
 * Supports two entry modes:
 * - /invitations/accept?token=... — direct link with pre-filled token
 * - /invitations/accept?committeeId=... — from notification, user pastes token
 *
 * Requires authentication; unauthenticated users are redirected to login
 * with a return URL back to this page.
 */
function AcceptInvitationContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <AcceptInvitation />
    </Container>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
