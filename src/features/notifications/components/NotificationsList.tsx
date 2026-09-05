'use client';

import { Box, List, Paper, Typography } from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import type { Notification } from '@/types';
import { NotificationItem } from './NotificationItem';

interface NotificationsListProps {
  notifications: Notification[];
  loading?: boolean;
}

/**
 * Displays a list of the user's notifications with read/unread state,
 * mark-as-read actions, and navigation to related features.
 */
export function NotificationsList({ notifications, loading }: NotificationsListProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 2.5 }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'action.hover' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '70%' }} />
              <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '50%' }} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  if (notifications.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <MarkEmailReadOutlinedIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No notifications
          </Typography>
          <Typography variant="body2" color="text.disabled">
            You&apos;re all caught up. Notifications about payments, contributions,
            lotteries, payouts, and committee updates will appear here.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2.5 }}>
      <List disablePadding>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </List>
    </Paper>
  );
}
