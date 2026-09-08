'use client';

import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import { useGetLotteryEligibilityQuery, useGetLotteryEligibleMembersQuery, useRunLotteryMutation } from '../api/adminCyclesApi';
import { getInitials } from '@/utils';

interface RunLotteryDialogProps {
  open: boolean;
  committeeId: string;
  cycleId: string;
  cycleNumber: number;
  onClose: () => void;
}

/**
 * Confirmation dialog before running the lottery draw. Shows eligible members
 * returned by the backend and requires explicit confirmation. The backend
 * exclusively determines eligibility and selects the winner.
 */
export function RunLotteryDialog({
  open,
  committeeId,
  cycleId,
  cycleNumber,
  onClose,
}: RunLotteryDialogProps) {
  const [confirmed, setConfirmed] = useState(false);

  const { data: eligibility, isLoading: eligibilityLoading } = useGetLotteryEligibilityQuery(
    { committeeId, cycleId },
    { skip: !open },
  );

  const { data: membersData, isLoading: membersLoading } = useGetLotteryEligibleMembersQuery(
    { committeeId, cycleId },
    { skip: !open || !eligibility?.eligible },
  );

  const [runLottery, { isLoading: running, error, reset }] = useRunLotteryMutation();
  const [result, setResult] = useState<{ winner: string; cycle: string } | null>(null);

  const eligibleMembers = membersData?.data ?? [];
  const isEligible = Boolean(eligibility?.eligible);

  const handleRun = async () => {
    try {
      const response = await runLottery({ committeeId, cycleId }).unwrap();
      setResult({
        winner: response.winner?.user?.name ?? 'Unknown',
        cycle: `Cycle ${response.cycle?.cycleNumber ?? cycleNumber}`,
      });
    } catch {
      // Error displayed via error state
    }
  };

  const handleClose = () => {
    if (!running) {
      reset();
      setConfirmed(false);
      setResult(null);
      onClose();
    }
  };

  const errorMessage = (error as { data?: { message?: string } })?.data?.message
    ?? 'Failed to run the lottery. Please try again.';

  // Show result after successful execution
  if (result) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CasinoOutlinedIcon color="success" />
          Lottery Complete
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            The lottery for {result.cycle} has been executed successfully.
          </Alert>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Winner: {result.winner}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The winner has been determined by the backend. A payout record will be
            created separately. All active members have been notified.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Run Lottery — Cycle {cycleNumber}</DialogTitle>
      <DialogContent>
        {eligibilityLoading || membersLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : !isEligible ? (
          <Alert severity="warning">
            This cycle is not eligible for a lottery draw.
            {eligibility?.reason ? ` ${eligibility.reason}` : ''}
          </Alert>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              {eligibility?.eligibleMemberCount ?? eligibleMembers.length} members are eligible for this draw.
              The backend will randomly select the winner.
            </Alert>

            {/* Eligible members list */}
            {eligibleMembers.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Eligible Members
                </Typography>
                <List dense disablePadding>
                  {eligibleMembers.map((member) => (
                    <ListItem key={member.id} disableGutters>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                          {getInitials(member.user?.name ?? '?')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.user?.name ?? 'Unknown'}
                        secondary={member.user?.email ?? ''}
                      />
                      <Chip label={member.role} size="small" variant="outlined" />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {!confirmed ? (
              <Typography variant="body2" color="text.secondary">
                This action is irreversible. Once the lottery is run, the cycle will be
                marked as COMPLETED and a winner will be selected. Are you sure?
              </Typography>
            ) : (
              <Alert severity="warning">
                You are about to execute the lottery draw. This cannot be undone.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={running || !isEligible} color="inherit">
          Cancel
        </Button>
        {!confirmed ? (
          <Button
            onClick={() => setConfirmed(true)}
            disabled={!isEligible}
            variant="contained"
            color="warning"
          >
            Proceed to Run Lottery
          </Button>
        ) : (
          <Button
            onClick={handleRun}
            disabled={running || !isEligible}
            variant="contained"
            color="warning"
          >
            {running ? <CircularProgress size={18} /> : 'Confirm & Run Lottery'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
