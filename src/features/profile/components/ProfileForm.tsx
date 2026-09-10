'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useUpdateProfileMutation } from '@/features/auth';
import type { User } from '@/types';
import { getProfileChanges, getProfileValues, profileSchema, type ProfileFormData } from '../schemas/profileSchema';

export function ProfileForm({ user }: { user: User }) {
  const [updateProfile, { isLoading, error, reset: resetMutation }] = useUpdateProfileMutation();
  const [feedback, setFeedback] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: getProfileValues(user),
    resetOptions: { keepDirtyValues: true },
  });
  const saving = isLoading || isSubmitting;

  const onSubmit = async (values: ProfileFormData) => {
    resetMutation();
    setFeedback(null);
    const body = getProfileChanges(values, user);
    if (Object.keys(body).length === 0) {
      reset(getProfileValues(user));
      setFeedback('No changes to save.');
      return;
    }
    try {
      const updatedUser = await updateProfile(body).unwrap();
      reset(getProfileValues(updatedUser));
      setFeedback('Profile updated successfully.');
    } catch {
      // The mutation error is displayed below. Keep the entered values for retry.
    }
  };

  let errorMessage = 'Unable to update your profile. Please try again.';
  if (error && 'status' in error) {
    if (error.status === 401) {
      errorMessage = 'Your session has expired or your account is unavailable. Please sign in again.';
    } else if (error.status === 400 && error.data && typeof error.data === 'object' && 'message' in error.data) {
      const message = error.data.message;
      if (typeof message === 'string') errorMessage = message;
      else if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
        errorMessage = message.join(' ');
      }
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Edit Profile</Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} onChange={() => {
        setFeedback(null);
        resetMutation();
      }} aria-busy={saving}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{errorMessage}</Alert>}
          {feedback && <Alert severity="success" role="status">{feedback}</Alert>}
          <TextField
            label="Full Name"
            autoComplete="name"
            required
            fullWidth
            disabled={saving}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
          />
          <TextField
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            fullWidth
            disabled={saving}
            error={!!errors.phone}
            helperText={errors.phone?.message ?? 'Leave blank to remove your phone number.'}
            {...register('phone')}
          />
          <Typography variant="body2" color="text.secondary">Email cannot be changed here.</Typography>
          <Stack direction="row" spacing={1}>
            <Button type="submit" disabled={saving || !isDirty}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button variant="outlined" disabled={saving || !isDirty} onClick={() => {
              reset(getProfileValues(user));
              resetMutation();
              setFeedback(null);
            }}>Cancel</Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
