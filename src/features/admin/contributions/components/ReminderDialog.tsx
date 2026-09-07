'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useSendCommitteeNotificationMutation } from '../api/adminContributionsApi';
import { reminderSchema, REMINDER_TYPES, type ReminderFormData } from '../schemas/reminderSchema';

interface ReminderDialogProps {
  open: boolean;
  onClose: () => void;
  committeeId: string;
  committeeName: string;
  /** Pre-selected notification type based on where the action was triggered. */
  defaultType?: (typeof REMINDER_TYPES)[number];
}

/**
 * Payment reminder form for POST /committees/:committeeId/notifications.
 *
 * The documented endpoint broadcasts to every ACTIVE and INVITED member plus
 * the committee admin and takes no recipient list, so the dialog states that
 * clearly instead of implying targeted delivery. Submits only the documented
 * body fields (`type`, `title`, `message`).
 */
export function ReminderDialog({
  open,
  onClose,
  committeeId,
  committeeName,
  defaultType = 'CONTRIBUTION_REMINDER',
}: ReminderDialogProps) {
  const [sendNotification, result] = useSendCommitteeNotificationMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentCount, setSentCount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: { type: defaultType, title: '', message: '' },
  });

  const handleClose = () => {
    if (result.isLoading) return;
    setSentCount(null);
    setServerError(null);
    reset({ type: defaultType, title: '', message: '' });
    onClose();
  };

  const onSubmit = async (data: ReminderFormData) => {
    setServerError(null);
    try {
      const response = await sendNotification({ committeeId, ...data }).unwrap();
      setSentCount(response.sent);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error.data?.message ?? 'Failed to send the reminder. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {sentCount !== null ? (
        <>
          <DialogTitle>Reminder Sent</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                py: 1.5,
              }}
            >
              <CheckCircleOutlineOutlinedIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Notification delivered to {sentCount} recipient{sentCount === 1 ? '' : 's'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Every ACTIVE and INVITED member of <strong>{committeeName}</strong> plus the
                committee admin received the reminder.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Done</Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Send Payment Reminder</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Broadcast a reminder to <strong>{committeeName}</strong>.
            </Typography>

            <Alert severity="info" sx={{ mb: 2.5 }}>
              The reminder is delivered to all ACTIVE and INVITED members of the committee plus the
              committee admin. Individual recipients cannot be selected.
            </Alert>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              <FormControl size="small">
                <InputLabel id="reminder-type-label">Type</InputLabel>
                <Select
                  labelId="reminder-type-label"
                  label="Type"
                  defaultValue={defaultType}
                  {...register('type')}
                >
                  {REMINDER_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Title"
                fullWidth
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
                {...register('title')}
              />

              <TextField
                size="small"
                label="Message"
                fullWidth
                multiline
                minRows={4}
                error={Boolean(errors.message)}
                helperText={errors.message?.message}
                {...register('message')}
              />
            </Box>

            {serverError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {serverError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={result.isLoading} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={result.isLoading} variant="contained">
              {result.isLoading ? <CircularProgress size={18} /> : 'Send Reminder'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
