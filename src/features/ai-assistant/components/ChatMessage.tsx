'use client';

import {
  Box,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * A single chat bubble. User messages are right-aligned with primary
 * colour; assistant messages are left-aligned with a neutral paper
 * background and an AI icon.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      {!isUser && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            mr: 1,
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          maxWidth: '75%',
          px: 2,
          py: 1.5,
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
          borderTopRightRadius: isUser ? 0 : undefined,
          borderTopLeftRadius: isUser ? undefined : 0,
        }}
      >
        {message.loading ? (
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', py: 0.5 }}>
            <Skeleton variant="text" width={40} height={16} />
            <Skeleton variant="text" width={60} height={16} />
            <Skeleton variant="text" width={30} height={16} />
          </Box>
        ) : (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {message.content}
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            textAlign: 'right',
            opacity: 0.6,
            fontSize: '0.65rem',
          }}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
}
