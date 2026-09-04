'use client';

import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
          <Link component={NextLink} href="/register" sx={{ fontWeight: 600 }}>
            Create one
          </Link>
        </Typography>
      </Box>
    </>
  );
}
