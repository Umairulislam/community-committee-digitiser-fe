'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useAuth } from '@/features/auth';
import { ProfileInfo, AccountStatus } from '@/features/profile';

/**
 * User profile page.
 * Displays the authenticated user's personal information and account status.
 * Profile editing is not yet supported by the backend.
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Loading state
  if (authLoading || !user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          View your account information
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Profile editing is not yet available. Contact support if you need to update your information.
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <ProfileInfo user={user} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AccountStatus user={user} />
        </Grid>
      </Grid>
    </Container>
  );
}
