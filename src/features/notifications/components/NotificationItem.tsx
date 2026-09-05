'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import type { Notification } from '@/types';
import { formatDateTime } from '@/utils';
import { useMarkNotificationReadMutation } from '../api/notificationsApi';
import { notificationChipColor, notificationHref, NotificationTypeIcon } from '../utils/notificationVisuals';

interface NotificationItemProps {
  notification: Notification;
}

/**
 * A single notification row. Unread items are visually distinguished
 * (highlighted background, bold title, "New" chip) and offer an explicit
 * "Mark as read" action. Clicking a notification with a related committee
 * marks it as read and navigates to the related feature tab.
 */
export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const [markRead, { isLoading: markingRead }] = useMarkNotificationReadMutation();

  const href = notificationHref(notification);

  const handleMarkRead = async () => {
    try {
      await markRead(notification.id).unwrap();
    } catch {
      // Error is surfaced by the invalidation/refetch cycle; the item
      // simply stays unread if the request fails.
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      handleMarkRead();
    }
    if (href) {
      router.push(href);
    }
  };

  const content = (
    <>
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
    </>
  );

  return (
    <ListItem
      disablePadding
      sx={{
        mb: 0.5,
        borderRadius: 1,
        bgcolor: notification.read ? 'transparent' : 'action.hover',
      }}
      secondaryAction={
        notification.read ? (
          href ? (
            <ChevronRightOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
          ) : null
        ) : (
          <Tooltip title="Mark as read">
            <span>
              <IconButton
                edge="end"
                size="small"
                aria-label={`Mark "${notification.title}" as read`}
                disabled={markingRead}
                onClick={handleMarkRead}
              >
                <MarkEmailReadOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
        )
      }
    >
      {href ? (
        <ListItemButton onClick={handleClick} sx={{ borderRadius: 1, pr: 6 }}>
          {content}
        </ListItemButton>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', px: 2, py: 1.5, pr: 6 }}>
          {content}
        </Box>
      )}
    </ListItem>
  );
}
