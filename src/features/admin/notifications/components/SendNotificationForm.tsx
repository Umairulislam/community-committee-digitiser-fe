'use client';

import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useSendCommitteeNotificationMutation } from '@/features/admin/contributions/api/adminContributionsApi';
import { ConfirmDialog } from '@/features/admin/members/components/ConfirmDialog';
import { NOTIFICATION_TYPES, notificationSchema, type NotificationFormData } from '../schemas/notificationSchema';

export function SendNotificationForm({ committeeId, committeeName }: { committeeId: string; committeeName: string }) {
  const [send, result] = useSendCommitteeNotificationMutation();
  const [draft, setDraft] = useState<NotificationFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<number | null>(null);
  const sending = useRef(false);
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema), defaultValues: { type: 'GENERAL', title: '', message: '' },
  });

  const confirmSend = async () => {
    if (!draft || sending.current) return;
    sending.current = true;
    setError(null);
    try {
      const response = await send({ committeeId, type: draft.type, title: draft.title, message: draft.message }).unwrap();
      setSent(response.sent);
      setDraft(null);
      reset();
    } catch {
      setError('Unable to confirm delivery. Check your inbox before trying again to avoid sending a duplicate notification.');
    } finally {
      sending.current = false;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Send notification</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>Audience: all ACTIVE and INVITED members of {committeeName}, plus the committee admin.</Alert>
      {sent !== null && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSent(null)}>Notification sent to {sent} recipient{sent === 1 ? '' : 's'}.</Alert>}
      <Box component="form" noValidate onSubmit={handleSubmit((values) => { setSent(null); setError(null); setDraft(values); })} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Controller name="type" control={control} render={({ field }) => (
          <TextField {...field} select label="Type" error={Boolean(errors.type)} helperText={errors.type?.message}>
            {NOTIFICATION_TYPES.map(type => <MenuItem key={type} value={type}>{type.replaceAll('_', ' ')}</MenuItem>)}
          </TextField>
        )} />
        <TextField label="Title" {...register('title')} error={Boolean(errors.title)} helperText={errors.title?.message} />
        <TextField label="Message" multiline minRows={4} {...register('message')} error={Boolean(errors.message)} helperText={errors.message?.message} />
        <Button type="submit" variant="contained" disabled={result.isLoading}>Review notification</Button>
      </Box>
      <ConfirmDialog open={Boolean(draft)} title="Send this notification?" confirmLabel="Send notification" loading={result.isLoading} errorMessage={error}
        onClose={() => { if (!sending.current) setDraft(null); }} onConfirm={confirmSend}>
        <Box sx={{ overflowWrap: 'anywhere', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>Committee: {committeeName}</Typography>
          <Typography>Recipients: all ACTIVE and INVITED members, plus the committee admin.</Typography>
          <Typography>Type: {draft?.type.replaceAll('_', ' ')}</Typography>
          <Typography sx={{ fontWeight: 600 }}>{draft?.title}</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{draft?.message}</Typography>
        </Box>
      </ConfirmDialog>
    </Paper>
  );
}
