'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginMutation } from '../api/authApi';
import { setUser } from '../authSlice';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { useAppDispatch } from '@/store/hooks';

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const result = await login(data).unwrap();
      dispatch(setUser(result.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      if (error.status === 401) {
        setServerError(error.data?.message ?? 'Invalid email or password');
      } else if (error.status === 400) {
        setServerError(error.data?.message ?? 'Please check your input and try again');
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Sign In
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back. Sign in to access your committees.
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        disabled={isLoading}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mb: 2 }}
        {...register('email')}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        disabled={isLoading}
        error={!!errors.password}
        helperText={errors.password?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
        {...register('password')}
      />

      <Button
        type="submit"
        disabled={isLoading}
        sx={{ mb: 2, width: '100%', py: 1.5 }}
      >
        {isLoading ? 'Signing in…' : 'Sign In'}
      </Button>
    </Box>
  );
}
