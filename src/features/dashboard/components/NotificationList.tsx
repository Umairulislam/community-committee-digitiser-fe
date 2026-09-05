'use client';

import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import type { Notification } from '@/types';
import { formatDateTime } from '@/utils';
import {
  notificationChipColor,
  NotificationTypeIcon,
} from '@/features/notifications';

interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
}

/**
 * Displays a list of recent notifications (dashboard widget).
 */
export function NotificationList({ notifications, loading }: NotificationListProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Notifications
        </Typography>
        {[1, 2, 3].map((i) => (
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

  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Recent Notifications
      </Typography>
      {notifications.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <MarkEmailReadOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No recent notifications
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {notifications.map((notification) => {
            return (
              <ListItem
                key={notification.id}
                sx={{
                  px: 1.5,
                  py: 1.5,
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <NotificationTypeIcon type={notification.type} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Chip label="New" size="small" color="primary" sx={{ height: 18, fontSize: '0.625rem' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary" component="span">
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={notification.type.replace(/_/g, ' ')}
                          size="small"
                          color={notificationChipColor(notification.type)}
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.625rem' }}
                        />
                        <Typography variant="caption" color="text.disabled">
                          {formatDateTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}
