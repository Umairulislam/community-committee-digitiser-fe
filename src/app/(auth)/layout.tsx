import type { Metadata } from 'next';
import { Box, Paper, ThemeProvider } from '@mui/material';
import { theme } from '@/theme/theme';

export const metadata: Metadata = {
  title: 'Authentication',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: '16px',
          border: '1px solid #DDE1EA',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
