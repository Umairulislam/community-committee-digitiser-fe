'use client';

import { useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, MenuItem, Pagination, Paper, TextField, Typography } from '@mui/material';
import { useGetNotificationsQuery } from '@/features/notifications/api/notificationsApi';
import { formatDateTime } from '@/utils';
import type { NotificationType } from '@/types';
import { NOTIFICATION_TYPES } from '../schemas/notificationSchema';

export function AdminNotificationHistory() {
  const [type, setType] = useState<NotificationType | ''>('');
  const [read, setRead] = useState('');
  const [page, setPage] = useState(1);
  const { currentData: data, isFetching, isError, refetch } = useGetNotificationsQuery({
    type: type || undefined, read: read === '' ? undefined : read === 'true', page, limit: 20,
  }, { refetchOnMountOrArgChange: true });
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Your notification history</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>Your received notifications, newest first. This includes your copy of committee broadcasts. Sent history for other recipients is not available.</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField select size="small" label="Type" value={type} sx={{ minWidth: 220 }} onChange={event => { setType(event.target.value as NotificationType | ''); setPage(1); }}>
          <MenuItem value="">All types</MenuItem>
          {NOTIFICATION_TYPES.map(value => <MenuItem key={value} value={value}>{value.replaceAll('_', ' ')}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Read status" value={read} sx={{ minWidth: 150 }} onChange={event => { setRead(event.target.value); setPage(1); }}>
          <MenuItem value="">All</MenuItem><MenuItem value="false">Unread</MenuItem><MenuItem value="true">Read</MenuItem>
        </TextField>
        <Button disabled={isFetching} onClick={() => refetch()}>Refresh</Button>
      </Box>
      {isFetching ? <CircularProgress aria-label="Loading notification history" /> : isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load your notification history.</Alert>
      ) : (
        <>
          {!data?.data.length && <Alert severity="info">No notifications match this page and filters.</Alert>}
          {data?.data.map(notification => (
            <Paper key={notification.id} sx={{ p: 2.5, mb: 2, overflowWrap: 'anywhere' }}>
              <Typography variant="subtitle1">{notification.title}</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>{notification.message}</Typography>
              <Chip size="small" label={notification.type.replaceAll('_', ' ')} sx={{ mr: 1 }} />
              <Chip size="small" label={notification.read ? 'Read' : 'Unread'} />
              <Typography variant="body2" sx={{ mt: 1 }}>Recipient: you ({notification.userId})</Typography>
              <Typography variant="body2">Committee: {notification.committeeId ?? 'No committee context'}</Typography>
              <Typography variant="body2" color="text.secondary">{formatDateTime(notification.createdAt)}</Typography>
            </Paper>
          ))}
          <Pagination page={page} count={Math.max(page, Math.ceil((data?.total ?? 0) / 20))} onChange={(_, next) => setPage(next)} />
        </>
      )}
    </Box>
  );
}
