'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { useAuth, useLogoutMutation } from '@/features/auth';
import { useGetUnreadCountQuery } from '@/features/dashboard';
import { getInitials } from '@/utils';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Shared application shell with AppBar and navigation.
 * Used by dashboard and committee layouts.
 */
export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [logout] = useLogoutMutation();
  const { data: unreadCountData } = useGetUnreadCountQuery();

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

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton edge="start" sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuOutlinedIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
            <DashboardOutlinedIcon sx={{ color: 'primary.main' }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: 'text.primary', cursor: 'pointer' }}
              onClick={() => router.push('/dashboard')}
            >
              Kameti
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              color={isActive('/dashboard') ? 'primary' : 'inherit'}
              startIcon={<DashboardOutlinedIcon />}
              onClick={() => router.push('/dashboard')}
              sx={{ textTransform: 'none' }}
            >
              Dashboard
            </Button>
            <Button
              color={isActive('/committees') ? 'primary' : 'inherit'}
              startIcon={<GroupsOutlinedIcon />}
              onClick={() => router.push('/committees')}
              sx={{ textTransform: 'none' }}
            >
              Committees
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={unreadCountData?.count ?? 0} color="error" max={99}>
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {user?.name ? getInitials(user.name) : 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 3,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            sx={{
              mt: 1.5,
              '& .MuiMenu-paper': {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                minWidth: 200,
              },
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.name ?? 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email ?? ''}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
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

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        {children}
      </Box>
    </Box>
  );
}
