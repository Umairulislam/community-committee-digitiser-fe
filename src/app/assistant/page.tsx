'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { useAuth } from '@/features/auth';
import { AssistantChat } from '@/features/ai-assistant';

/**
 * AI Committee Assistant page.
 * Provides a conversational interface for users to ask questions
 * about their committee data.
 */
export default function AssistantPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <SmartToyOutlinedIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            AI Committee Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask questions about your committees, contributions, payouts, and more
          </Typography>
        </Box>
      </Box>

      {/* Chat Panel */}
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 280px)',
        }}
      >
        <AssistantChat />
      </Paper>
    </Container>
  );
}
