import { Box, Container, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        p: 4,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <AccountBalanceIcon color="primary" sx={{ fontSize: 56, mb: 2 }} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Community Committee Digitiser
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A transparent and auditable digital platform for managing community
          committees — contributions, cycles, lottery, and payouts.
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Phase 1 — Foundation &amp; Architecture
        </Typography>
      </Container>
    </Box>
  );
}
