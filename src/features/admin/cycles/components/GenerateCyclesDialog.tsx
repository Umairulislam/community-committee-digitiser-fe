'use client';

import { useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useGenerateCyclesMutation } from '../api/adminCyclesApi';

interface GenerateCyclesDialogProps {
  open: boolean;
  committeeId: string;
  committeeName: string;
  onClose: () => void;
}

/**
 * Dialog for generating all remaining cycles for a committee.
 * Calls POST /committees/:committeeId/cycles/generate.
 * Optional startDate override is accepted as ISO 8601.
 */
export function GenerateCyclesDialog({
  open,
  committeeId,
  committeeName,
  onClose,
}: GenerateCyclesDialogProps) {
  const [startDate, setStartDate] = useState('');
  const [generateCycles, { isLoading, error, reset }] = useGenerateCyclesMutation();

  const handleGenerate = async () => {
    try {
      const body: { committeeId: string; startDate?: string } = { committeeId };
      if (startDate) body.startDate = new Date(startDate).toISOString();
      await generateCycles(body).unwrap();
      onClose();
    } catch {
      // Error is displayed via the error state
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setStartDate('');
      onClose();
    }
  };

  const errorMessage = (error as { data?: { message?: string } })?.data?.message
    ?? 'Failed to generate cycles. Please try again.';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Cycles</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Generate all remaining cycles for <strong>{committeeName}</strong>.
          Cycle 1 will be created ACTIVE; later cycles will be UPCOMING.
        </Typography>
        <TextField
          label="Start Date (optional)"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          fullWidth
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          helperText="Overrides the committee's start date for cycle 1"
          disabled={isLoading}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleGenerate} disabled={isLoading} variant="contained">
          {isLoading ? <CircularProgress size={18} /> : 'Generate Cycles'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
