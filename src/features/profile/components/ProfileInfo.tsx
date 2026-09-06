'use client';

import {
  Avatar,
  Box,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import type { User } from '@/types';
import { formatDateTime } from '@/utils';

interface ProfileInfoProps {
  user: User;
}

/**
 * Displays the user's personal information in a card layout.
 * Shows avatar with initials, name, email, phone, and member since date.
 */
export function ProfileInfo({ user }: ProfileInfoProps) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            fontSize: '1.5rem',
            fontWeight: 600,
            bgcolor: 'primary.main',
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <EmailOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Email
            </Typography>
            <Typography variant="body2">{user.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PhoneOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Phone
            </Typography>
            <Typography variant="body2">
              {user.phone ?? '—'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Member since
            </Typography>
            <Typography variant="body2">
              {formatDateTime(user.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
