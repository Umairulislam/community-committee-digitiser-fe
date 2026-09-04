'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '@/features/auth';

/**
 * Root page — redirects based on authentication state.
 * Authenticated → /dashboard
 * Unauthenticated → /login
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? '/dashboard' : '/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
