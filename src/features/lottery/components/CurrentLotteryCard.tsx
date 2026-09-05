'use client';

import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import type { Cycle } from '@/types';
import { useAuth } from '@/features/auth';
import { getInitials } from '@/utils';
import {
  useGetLotteryEligibilityQuery,
  useGetLotteryEligibleMembersQuery,
} from '../api/lotteryApi';

interface CurrentLotteryCardProps {
  committeeId: string;
  cycle: Cycle;
}

/**
 * Card describing the lottery status of the active cycle. Eligibility and
 * eligible members are determined exclusively by the backend — this card
 * only displays what the backend returns.
 */
export function CurrentLotteryCard({ committeeId, cycle }: CurrentLotteryCardProps) {
  const { user } = useAuth();

  const {
    data: eligibility,
    isLoading,
    isError,
    error,
  } = useGetLotteryEligibilityQuery({ committeeId, cycleId: cycle.id });

  // The eligible member list is only fetched once the backend confirms the
  // cycle can run a draw.
  const {
    data: eligibleMembersData,
    isLoading: membersLoading,
  } = useGetLotteryEligibleMembersQuery(
    { committeeId, cycleId: cycle.id },
    { skip: !eligibility?.eligible },
  );

  const eligibleMembers = eligibleMembersData?.data ?? [];
  const isUserEligible = eligibleMembers.some((member) => member.user?.id === user?.id);
  const isEligible = Boolean(eligibility?.eligible);

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            <EmojiEventsOutlinedIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Current Lottery
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cycle {cycle.cycleNumber}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={!isEligible ? 'Not Ready' : 'Draw Pending'}
          color={!isEligible ? 'default' : 'warning'}
          variant="outlined"
        />
      </Box>

      {/* Eligibility status */}
      {isLoading ? (
        <Box>
          <Box sx={{ height: 16, bgcolor: 'action.hover', borderRadius: 1, width: '45%', mb: 1.5 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ height: 32, bgcolor: 'action.hover', borderRadius: 5, width: 120 }} />
            ))}
          </Box>
        </Box>
      ) : isError ? (
        <Alert severity="error">
          {(error as { data?: { message?: string } })?.data?.message
            ?? 'Failed to load lottery status. Please try again.'}
        </Alert>
      ) : isEligible ? (
        <Box>
          <Typography variant="body2" color="text.secondary">
            This cycle is ready for the draw with{' '}
            {eligibility?.eligibleMemberCount} eligible{' '}
            {eligibility?.eligibleMemberCount === 1 ? 'member' : 'members'}.
          </Typography>
          {membersLoading ? (
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ height: 32, bgcolor: 'action.hover', borderRadius: 5, width: 120 }} />
              ))}
            </Box>
          ) : eligibleMembers.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
              {eligibleMembers.map((member) => {
                const isCurrentUser = member.user?.id === user?.id;
                return (
                  <Box
                    key={member.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 5,
                      border: 1,
                      borderColor: isCurrentUser ? 'secondary.main' : 'divider',
                      bgcolor: isCurrentUser ? 'action.selected' : 'transparent',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '0.625rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {getInitials(member.user?.name ?? '?')}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontWeight: isCurrentUser ? 600 : 400 }}>
                      {member.user?.name ?? 'Unknown'}
                      {isCurrentUser ? ' (You)' : ''}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ) : null}
          {!membersLoading && eligibleMembers.length > 0 && (
            <Alert severity={isUserEligible ? 'success' : 'info'} sx={{ mt: 2 }}>
              {isUserEligible
                ? 'You are among the eligible members for this draw.'
                : 'You are not currently among the eligible members for this draw.'}
            </Alert>
          )}
        </Box>
      ) : (
        <Alert severity="info">
          Draw not ready — {eligibility?.reason ?? 'this cycle cannot run a lottery yet.'}
        </Alert>
      )}

      <Divider sx={{ my: 2.5 }} />

      <Typography variant="caption" color="text.disabled">
        The lottery is run by the committee admin. Winners are determined solely by the
        backend draw and published here once complete.
      </Typography>
    </Paper>
  );
}
