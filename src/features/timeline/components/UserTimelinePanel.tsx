'use client';

import { Alert, Box, Paper } from '@mui/material';
import { useAuth } from '@/features/auth';
import { useGetCyclesQuery, useGetMembersQuery } from '@/features/committees';
import { useGetAuditTimelineQuery } from '../api/timelineApi';
import { CommitteeTimeline } from './CommitteeTimeline';

interface UserTimelinePanelProps {
  committeeId: string;
}

/**
 * User-side timeline panel for a committee. Renders the committee's
 * immutable audit trail (payments, cycles, lottery, payouts, membership,
 * and committee events) in chronological order. The backend restricts
 * access to committee members — this panel only displays what it returns.
 */
export function UserTimelinePanel({ committeeId }: UserTimelinePanelProps) {
  const { user } = useAuth();

  const {
    data: timelineData,
    isLoading,
    isError,
    error,
  } = useGetAuditTimelineQuery({ committeeId });

  // Members and cycles enrich events with actor names and cycle numbers.
  // They are already fetched by the committee detail page, so these calls
  // are served from the RTK Query cache.
  const { data: membersData } = useGetMembersQuery({ committeeId, limit: 50 });
  const { data: cyclesData } = useGetCyclesQuery({ committeeId, limit: 50 });

  if (isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 20, bgcolor: 'action.hover', borderRadius: 1, mb: 2.5, width: '35%' }} />
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: 'action.hover' }} />
            <Box sx={{ flex: 1, pt: 0.5 }}>
              <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.75, width: '40%' }} />
              <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '60%' }} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  if (isError) {
    const errorMessage = (error as { data?: { message?: string } })?.data?.message
      ?? 'Failed to load the committee timeline. Please try again.';
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  const actorNames = new Map(
    (membersData?.data ?? [])
      .filter((member) => member.user)
      .map((member) => [member.userId, member.user?.name as string]),
  );
  const cycleNumbers = new Map(
    (cyclesData?.data ?? []).map((cycle) => [cycle.id, cycle.cycleNumber]),
  );

  return (
    <CommitteeTimeline
      events={timelineData?.data ?? []}
      actorNames={actorNames}
      cycleNumbers={cycleNumbers}
      currentUserId={user?.id}
    />
  );
}
