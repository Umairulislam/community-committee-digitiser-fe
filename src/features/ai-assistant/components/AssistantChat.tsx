'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useAskAssistantMutation } from '../api/aiAssistantApi';
import { ChatMessage } from './ChatMessage';
import { SuggestedQuestions } from './SuggestedQuestions';
import type { ChatMessage as ChatMessageType } from '../types';

let nextId = 1;
function createId(): string {
  return `msg-${Date.now()}-${nextId++}`;
}

/**
 * Main AI Committee Assistant chat panel.
 *
 * Manages the conversation state, dispatches questions to the backend
 * via RTK Query, and renders the message list with input field.
 * Conversation history is client-side only and resets on unmount.
 */
export function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [askAssistant, { isLoading }] = useAskAssistantMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || trimmed.length < 3) return;

      // Add user message
      const userMessage: ChatMessageType = {
        id: createId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      };

      // Add a placeholder assistant message with loading state
      const loadingMessage: ChatMessageType = {
        id: createId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        loading: true,
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setInput('');

      try {
        const result = await askAssistant({ question: trimmed }).unwrap();

        // Replace the loading placeholder with the actual answer
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, content: result.answer, loading: false, timestamp: new Date() }
              : msg,
          ),
        );
      } catch (err) {
        const errorMessage =
          (err as { data?: { message?: string } })?.data?.message ??
          'The AI assistant is currently unavailable. Please try again later.';

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, content: errorMessage, loading: false, timestamp: new Date() }
              : msg,
          ),
        );
      }
    },
    [askAssistant],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
    textFieldRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const inputError = input.trim().length > 0 && input.trim().length < 3
    ? 'Question must be at least 3 characters'
    : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Info Banner */}
      <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
        <Typography variant="body2">
          The AI Assistant answers questions about your committees using authorised data.
          Responses are informational only — official records remain the source of truth.
        </Typography>
      </Alert>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 1,
          py: 2,
          minHeight: 300,
          maxHeight: 'calc(100vh - 360px)',
        }}
      >
        {messages.length === 0 ? (
          <SuggestedQuestions onSelect={handleSend} disabled={isLoading} />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Clear Conversation */}
      {messages.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <IconButton
            size="small"
            onClick={handleClear}
            disabled={isLoading}
            aria-label="Clear conversation"
            sx={{ color: 'text.secondary' }}
          >
            <ClearOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              Clear conversation
            </Typography>
          </IconButton>
        </Box>
      )}

      {/* Input Area */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          gap: 1,
          pt: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <TextField
          inputRef={textFieldRef}
          fullWidth
          size="small"
          placeholder="Ask about your committees..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          error={!!inputError}
          helperText={inputError}
          slotProps={{
            htmlInput: { maxLength: 500 },
            input: {
              endAdornment: input.length > 0 && !isLoading ? (
                <InputAdornment position="end">
                  <Typography variant="caption" color="text.disabled">
                    {input.length}/500
                  </Typography>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={isLoading || !input.trim() || input.trim().length < 3}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            width: 42,
            height: 42,
          }}
        >
          <SendOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
