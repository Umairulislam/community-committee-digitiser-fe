'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from '@mui/material';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { colors } from '@/theme/tokens';
import { ADMIN_DRAWER_WIDTH, ADMIN_NAV_SECTIONS } from './navigation';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/**
 * Admin navigation sidebar.
 * Permanent drawer on desktop, temporary drawer on mobile.
 */
export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

  const handleNavigate = (path: string) => {
    onMobileClose();
    router.push(path);
  };

  const navContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Toolbar sx={{ gap: 1 }}>
        <AdminPanelSettingsOutlinedIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Kameti Admin
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Chip label="Admin Panel" color="primary" variant="outlined" sx={{ width: '100%' }} />
      </Box>
      <Box component="nav" sx={{ flexGrow: 1, overflowY: 'auto' }} aria-label="Admin navigation">
        {ADMIN_NAV_SECTIONS.map((section, sectionIndex) => (
          <List
            key={section.caption ?? `section-${sectionIndex}`}
            disablePadding
            subheader={
              section.caption ? (
                <ListSubheader
                  component="div"
                  disableSticky
                  sx={{
                    bgcolor: 'transparent',
                    lineHeight: '32px',
                    mt: 1,
                  }}
                >
                  <Typography variant="overline" color="text.secondary">
                    {section.caption}
                  </Typography>
                </ListSubheader>
              ) : undefined
            }
          >
            {section.items.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ px: 1.5, py: 0.25 }}>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    '&.Mui-selected': {
                      bgcolor: colors.background.subtle,
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                      '&:hover': { bgcolor: colors.background.subtle },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <item.icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500 } } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop — permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: ADMIN_DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: ADMIN_DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
        }}
        open
      >
        {navContent}
      </Drawer>

      {/* Mobile — temporary drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: ADMIN_DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
        }}
      >
        {navContent}
      </Drawer>
    </>
  );
}
