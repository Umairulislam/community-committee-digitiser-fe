'use client';

import NextLink from 'next/link';
import { Box, Link, Typography } from '@mui/material';
import { RegisterForm } from '@/features/auth';

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={NextLink} href="/login" sx={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </>
  );
}
