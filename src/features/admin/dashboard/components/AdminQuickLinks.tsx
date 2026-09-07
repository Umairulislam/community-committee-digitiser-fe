'use client';

import Link from 'next/link';
import { Box, Paper, Typography } from '@mui/material';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { ADMIN_NAV_SECTIONS } from '@/components/layout/admin';

/**
 * Quick links to the admin sections, reusing the shared navigation config so
 * the destinations stay in sync with the sidebar. The dashboard itself is
 * excluded.
 */
export function AdminQuickLinks() {
  const links = ADMIN_NAV_SECTIONS.flatMap((section) => section.items).filter(
    (item) => item.path !== '/admin',
  );

  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Quick Links
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 1,
        }}
      >
        {links.map((link) => (
          <Box
            key={link.path}
            component={Link}
            href={link.path}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 1.5,
              border: 1,
              borderColor: 'divider',
              color: 'text.primary',
              textDecoration: 'none',
              transition: 'background-color 150ms, border-color 150ms',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
            }}
          >
            <link.icon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
              {link.label}
            </Typography>
            <ArrowForwardOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
