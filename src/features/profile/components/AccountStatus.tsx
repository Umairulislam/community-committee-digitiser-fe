'use client';

import {
  Box,
  Chip,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import type { User } from '@/types';
import { formatDateTime } from '@/utils';

interface AccountStatusProps {
  user: User;
}

/**
 * Displays the user's account status, role, and last updated timestamp.
 * Uses status chips to visually communicate account state.
 */
export function AccountStatus({ user }: AccountStatusProps) {
  const statusColor =
    user.status === 'ACTIVE'
      ? 'success'
      : user.status === 'INACTIVE'
      ? 'default'
      : 'error';

  const statusLabel =
    user.status === 'ACTIVE'
      ? 'Active'
      : user.status === 'INACTIVE'
      ? 'Inactive'
      : 'Suspended';

  const roleColor = user.role === 'ADMIN' ? 'secondary' : 'primary';
  const RoleIcon = user.role === 'ADMIN' ? AdminPanelSettingsOutlinedIcon : VerifiedUserOutlinedIcon;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Account Status
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Role
          </Typography>
          <Chip
            icon={<RoleIcon sx={{ fontSize: 18 }} />}
            label={user.role}
            color={roleColor}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Account Status
          </Typography>
          <Chip
            label={statusLabel}
            color={statusColor}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UpdateOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Last updated
            </Typography>
            <Typography variant="body2">
              {formatDateTime(user.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
