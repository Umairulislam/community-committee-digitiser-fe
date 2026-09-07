'use client';

import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { AdminAppBar } from './AdminAppBar';
import { AdminSidebar } from './AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
}

/**
 * Admin layout shell — responsive sidebar + top app bar.
 * Wraps all authenticated admin pages.
 */
export function AdminShell({ children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
        <AdminAppBar onMobileMenuOpen={() => setMobileOpen(true)} />
        {/* Spacer for the fixed app bar */}
        <Toolbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
