'use client';

import { Box, Button, Typography } from '@mui/material';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

/** Pre-defined example questions the user can tap to get started. */
const EXAMPLE_QUESTIONS = [
  'How much have I contributed?',
  'When is my next payment?',
  'When will I receive my payout?',
  'Who won the last lottery?',
  'What is my current contribution status?',
] as const;

interface SuggestedQuestionsProps {
  /** Called when the user taps a suggested question. */
  onSelect: (question: string) => void;
  /** Disables selection while a request is in-flight. */
  disabled?: boolean;
}

/**
 * Renders a list of clickable suggested questions.
 * Shown when the conversation is empty to help users get started.
 */
export function SuggestedQuestions({ onSelect, disabled }: SuggestedQuestionsProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
      <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Ask me anything about your committees
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
        Try one of these questions to get started
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
        {EXAMPLE_QUESTIONS.map((question) => (
          <Button
            key={question}
            variant="outlined"
            size="small"
            disabled={disabled}
            onClick={() => onSelect(question)}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            {question}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
