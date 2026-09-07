import { Alert, Grid, Paper, Typography } from '@mui/material';
import { AdminPageContainer } from '@/components/layout/admin/AdminPageContainer';
import { ADMIN_NAV_SECTIONS } from '@/components/layout/admin/navigation';

/**
 * Admin foundation landing page.
 *
 * Phase 1 delivers only the shared admin layout and navigation shell.
 * Feature panels (committees, members, contributions, cycles, lottery,
 * payouts, notifications, audit logs, reports, settings) are implemented
 * in later phases — this page simply confirms the protected shell is wired
 * up and previews the navigation that will host them.
 */
export default function AdminHomePage() {
  const areas = ADMIN_NAV_SECTIONS.flatMap((section) => section.items).filter(
    (item) => item.path !== '/admin',
  );

  return (
    <AdminPageContainer title="Admin Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
      <Alert severity="info" sx={{ mb: 3 }}>
        The admin foundation and shared layout are in place. Individual
        management areas arrive in upcoming phases.
      </Alert>

      <Grid container spacing={2}>
        {areas.map((area) => (
          <Grid key={area.path} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Paper sx={{ p: 2.5, height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {area.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coming in a later phase.
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </AdminPageContainer>
  );
}
