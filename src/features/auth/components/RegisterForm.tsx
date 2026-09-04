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
import { useRegisterMutation } from '../api/authApi';
import { setUser } from '../authSlice';
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema';
import { useAppDispatch } from '@/store/hooks';

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const { confirmPassword: _confirm, ...body } = data;
      const result = await registerUser(body).unwrap();
      dispatch(setUser(result.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; status?: number };
      if (error.status === 409) {
        setServerError(error.data?.message ?? 'This email is already registered');
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
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Join a committee and start tracking contributions today.
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <TextField
        label="Full Name"
        autoComplete="name"
        disabled={isLoading}
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
        {...register('name')}
      />

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
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        disabled={isLoading}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        sx={{ mb: 2 }}
        {...register('phone')}
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
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
        sx={{ mb: 2 }}
        {...register('password')}
      />

      <TextField
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        disabled={isLoading}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
        {...register('confirmPassword')}
      />

      <Button
        type="submit"
        disabled={isLoading}
        sx={{ mb: 2, width: '100%', py: 1.5 }}
      >
        {isLoading ? 'Creating account…' : 'Create Account'}
      </Button>
    </Box>
  );
}
