'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {
  useCreateCommitteeMutation,
  useUpdateCommitteeMutation,
} from '../api/adminCommitteesApi';
import { committeeSchema, type CommitteeFormData } from '../schemas/committeeSchema';
import type { AdminCommittee, CreateCommitteeInput } from '../types';

interface CommitteeFormDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  /** Required when `mode` is `edit`. */
  committee?: AdminCommittee;
}

interface CommitteeFormProps {
  mode: 'create' | 'edit';
  committee?: AdminCommittee;
  onClose: () => void;
}

/** Convert a committee into string form values (all fields are edited as text). */
function toFormValues(committee?: AdminCommittee): CommitteeFormData {
  if (!committee) {
    return {
      name: '',
      description: '',
      contributionAmount: '',
      memberLimit: '',
      totalCycles: '',
      startDate: '',
      dueDay: '',
    };
  }
  return {
    name: committee.name,
    description: committee.description ?? '',
    // contributionAmount arrives as a decimal string ("5000.00").
    contributionAmount: String(parseFloat(committee.contributionAmount)),
    memberLimit: String(committee.memberLimit),
    totalCycles: String(committee.totalCycles),
    // startDate arrives as an ISO datetime; the date input needs YYYY-MM-DD.
    startDate: committee.startDate ? committee.startDate.slice(0, 10) : '',
    dueDay: String(committee.dueDay),
  };
}

/**
 * Shared create/edit committee form.
 *
 * Submits only documented POST/PATCH fields (no `payoutMethod` — the backend
 * sets it to LOTTERY). Editing is offered only for DRAFT committees; the
 * backend enforces that rule and re-validates every field.
 */
function CommitteeForm({ mode, committee, onClose }: CommitteeFormProps) {
  const isEdit = mode === 'edit';
  const [createCommittee, createResult] = useCreateCommitteeMutation();
  const [updateCommittee, updateResult] = useUpdateCommitteeMutation();
  const isLoading = isEdit ? updateResult.isLoading : createResult.isLoading;

  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState<AdminCommittee | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommitteeFormData>({
    resolver: zodResolver(committeeSchema),
    defaultValues: toFormValues(committee),
  });

  const onSubmit = async (data: CommitteeFormData) => {
    setServerError(null);
    const body: CreateCommitteeInput = {
      name: data.name.trim(),
      contributionAmount: parseFloat(data.contributionAmount),
      memberLimit: parseInt(data.memberLimit, 10),
      totalCycles: parseInt(data.totalCycles, 10),
      startDate: data.startDate,
      dueDay: parseInt(data.dueDay, 10),
    };
    const description = data.description?.trim();
    if (description) body.description = description;

    try {
      const result =
        isEdit && committee
          ? await updateCommittee({ id: committee.id, ...body }).unwrap()
          : await createCommittee(body).unwrap();
      setSaved(result);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(
        error.data?.message ??
          `Failed to ${isEdit ? 'update' : 'create'} the committee. Please try again.`,
      );
    }
  };

  if (saved) {
    return (
      <>
        <DialogTitle>{isEdit ? 'Committee Updated' : 'Committee Created'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 1.5,
            }}
          >
            <CheckCircleOutlineOutlinedIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              {saved.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEdit
                ? 'The committee details have been updated.'
                : `Created with status ${saved.status}. Activate it when you are ready to invite members.`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Done</Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <DialogTitle>{isEdit ? 'Edit Committee' : 'Create Committee'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {isEdit
            ? 'Update the committee details. Editing is available while the committee is a draft.'
            : 'Set the basic information and financial rules. The committee is created as a draft.'}
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" id="committee-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Committee Name"
                fullWidth
                required
                disabled={isLoading}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description (optional)"
                fullWidth
                multiline
                minRows={2}
                disabled={isLoading}
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register('description')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Contribution Amount"
                type="number"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  },
                  htmlInput: { min: 1, step: '0.01' },
                }}
                error={!!errors.contributionAmount}
                helperText={errors.contributionAmount?.message}
                {...register('contributionAmount')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Member Limit"
                type="number"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{ htmlInput: { min: 2, step: 1 } }}
                error={!!errors.memberLimit}
                helperText={errors.memberLimit?.message}
                {...register('memberLimit')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Total Cycles"
                type="number"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
                error={!!errors.totalCycles}
                helperText={errors.totalCycles?.message}
                {...register('totalCycles')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Contribution Due Day (1–31)"
                type="number"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{ htmlInput: { min: 1, max: 31, step: 1 } }}
                error={!!errors.dueDay}
                helperText={errors.dueDay?.message}
                {...register('dueDay')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                required
                disabled={isLoading}
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
                {...register('startDate')}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading} color="inherit">
          Cancel
        </Button>
        <Button type="submit" form="committee-form" disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              {isEdit ? 'Saving…' : 'Creating…'}
            </>
          ) : isEdit ? (
            'Save Changes'
          ) : (
            'Create Committee'
          )}
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Dialog wrapper for creating or editing a committee. The form remounts on each
 * open (keyed) so it always starts from the correct default values.
 */
export function CommitteeFormDialog({
  open,
  onClose,
  mode,
  committee,
}: CommitteeFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {open ? (
        <CommitteeForm
          key={mode === 'edit' ? (committee?.id ?? 'edit') : 'create'}
          mode={mode}
          committee={committee}
          onClose={onClose}
        />
      ) : null}
    </Dialog>
  );
}
