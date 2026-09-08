'use client';

import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import type { Cycle } from '@/types';
import { getInitials } from '@/utils';
import { useGetLotteryEligibilityQuery, useGetLotteryEligibleMembersQuery, useGetLotteryResultQuery } from '../api/adminCyclesApi';
import { LotteryResultCard } from './LotteryResultCard';
import { RunLotteryDialog } from './RunLotteryDialog';

interface LotteryPanelProps {
  committeeId: string;
  cycle: Cycle;
}

/**
 * Lottery management panel for a single cycle. Shows eligibility status,
 * eligible members, and allows running the lottery when the cycle is ACTIVE
 * and the backend reports it eligible. For COMPLETED cycles, shows the
 * lottery result if one exists.
 */
export function LotteryPanel({ committeeId, cycle }: LotteryPanelProps) {
  const [runDialogOpen, setRunDialogOpen] = useState(false);

  const { data: eligibility, isLoading: eligibilityLoading } = useGetLotteryEligibilityQuery(
    { committeeId, cycleId: cycle.id },
  );

  const { data: membersData, isLoading: membersLoading } = useGetLotteryEligibleMembersQuery(
    { committeeId, cycleId: cycle.id },
    { skip: !eligibility?.eligible },
  );

  const { data: lotteryResult, isLoading: resultLoading } = useGetLotteryResultQuery(
    { committeeId, cycleId: cycle.id },
    { skip: cycle.status !== 'COMPLETED' },
  );

  const eligibleMembers = membersData?.data ?? [];
  const isEligible = Boolean(eligibility?.eligible);
  const showRunButton = cycle.status === 'ACTIVE' && isEligible;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Active cycle: eligibility + run */}
      {cycle.status === 'ACTIVE' && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
              }}
            >
              <CasinoOutlinedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Lottery — Cycle {cycle.cycleNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isEligible ? 'Ready for draw' : 'Not ready'}
              </Typography>
            </Box>
            {isEligible && <Chip label="Ready" color="success" size="small" />}
          </Box>

          {eligibilityLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : !isEligible ? (
            <Alert severity="info">
              {eligibility?.reason ?? 'This cycle is not eligible for a lottery draw yet.'}
            </Alert>
          ) : (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                {eligibility?.eligibleMemberCount ?? 0} members are eligible for this draw.
              </Alert>

              {/* Eligible members */}
              {membersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : eligibleMembers.length > 0 ? (
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
              ) : null}

              {showRunButton && (
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<CasinoOutlinedIcon />}
                  onClick={() => setRunDialogOpen(true)}
                  fullWidth
                >
                  Run Lottery
                </Button>
              )}
            </>
          )}
        </Paper>
      )}

      {/* Completed cycle: show result */}
      {cycle.status === 'COMPLETED' && (
        <>
          {resultLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : lotteryResult ? (
            <LotteryResultCard result={lotteryResult} />
          ) : (
            <Alert severity="info">
              No lottery result found for this cycle.
            </Alert>
          )}
        </>
      )}

      <RunLotteryDialog
        open={runDialogOpen}
        committeeId={committeeId}
        cycleId={cycle.id}
        cycleNumber={cycle.cycleNumber}
        onClose={() => setRunDialogOpen(false)}
      />
    </Box>
  );
}
