'use client';

import Link from 'next/link';
import {
  Box,
  Breadcrumbs,
  Container,
  Typography,
} from '@mui/material';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export interface AdminBreadcrumb {
  label: string;
  /** When omitted the crumb renders as plain text (current page). */
  href?: string;
}

interface AdminPageContainerProps {
  title: string;
  breadcrumbs?: AdminBreadcrumb[];
  /** Optional page-level actions rendered on the right of the title row. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Shared container for admin pages.
 * Renders breadcrumbs, the page title, an optional actions area,
 * and the page content within consistent responsive padding.
 */
export function AdminPageContainer({
  title,
  breadcrumbs,
  actions,
  children,
}: AdminPageContainerProps) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          aria-label="Breadcrumb"
          separator={<ChevronRightOutlinedIcon fontSize="small" />}
          sx={{ mb: 1.5, fontSize: '0.875rem' }}
        >
          <Link
            href="/admin"
            style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
          >
            <HomeOutlinedIcon fontSize="small" style={{ marginRight: 4 }} />
            <Typography variant="body2" color="text.secondary">
              Admin
            </Typography>
          </Link>
          {breadcrumbs.map((crumb) =>
            crumb.href ? (
              <Link key={crumb.label} href={crumb.href} style={{ color: 'inherit' }}>
                <Typography variant="body2" color="text.secondary">
                  {crumb.label}
                </Typography>
              </Link>
            ) : (
              <Typography key={crumb.label} variant="body2" color="text.primary">
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
      </Box>

      {children}
    </Container>
  );
}
