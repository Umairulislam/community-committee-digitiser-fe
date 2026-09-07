'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth, useLogoutMutation } from '@/features/auth';
import { getInitials } from '@/utils';
import { ADMIN_DRAWER_WIDTH } from './navigation';

interface AdminAppBarProps {
  onMobileMenuOpen: () => void;
}

/**
 * Admin top app bar.
 * Shows the mobile navigation toggle, panel identity, and the admin
 * profile menu (user panel link, profile, logout).
 */
export function AdminAppBar({ onMobileMenuOpen }: AdminAppBarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [logout] = useLogoutMutation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logout().unwrap();
      router.replace('/login');
    } catch {
      router.replace('/login');
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${ADMIN_DRAWER_WIDTH}px)` },
        ml: { md: `${ADMIN_DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          aria-label="Open admin navigation"
          onClick={onMobileMenuOpen}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuOutlinedIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" color="text.secondary" noWrap>
            Admin Panel
          </Typography>
        </Box>

        {/* Admin profile menu */}
        <Tooltip title="Admin account">
          <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }} aria-label="Admin account menu">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              {user?.name ? getInitials(user.name) : 'A'}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                mt: 1.5,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                minWidth: 220,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.name ?? 'Admin'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email ?? ''}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => router.push('/dashboard')}>
            <ListItemIcon>
              <SpaceDashboardOutlinedIcon fontSize="small" />
            </ListItemIcon>
            User Dashboard
          </MenuItem>
          <MenuItem onClick={() => router.push('/profile')}>
            <ListItemIcon>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
