'use client';

import { Box, Chip, Paper, Typography } from '@mui/material';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useGetContributionsQuery } from '@/features/committees';
import type { Contribution, ContributionStatus, Cycle } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

interface ContributionHistoryListProps {
  committeeId: string;
  cycles: Cycle[];
  currentUserId: string | undefined;
}

/** Maps contribution status to chip color. */
function contributionStatusColor(status: ContributionStatus): 'warning' | 'success' | 'error' {
  switch (status) {
    case 'PAID':
      return 'success';
    case 'OVERDUE':
      return 'error';
    default:
      return 'warning';
  }
}

/** Finds the current user's contribution within a cycle's contributions. */
function findMyContribution(contributions: Contribution[], userId: string | undefined) {
  return contributions.find((contribution) => contribution.member?.user?.id === userId);
}

interface ContributionCycleRowProps {
  committeeId: string;
  cycle: Cycle;
  currentUserId: string | undefined;
}

/**
 * One cycle row in the contribution history.
 * Fetches the cycle's contributions and shows the current user's record.
 */
function ContributionCycleRow({ committeeId, cycle, currentUserId }: ContributionCycleRowProps) {
  const { data, isLoading } = useGetContributionsQuery({
    committeeId,
    cycleId: cycle.id,
    limit: 100,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'action.hover' }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '40%' }} />
          <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '60%' }} />
        </Box>
      </Box>
    );
  }

  const myContribution = findMyContribution(data?.data ?? [], currentUserId);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        px: 1.5,
        borderRadius: 1,
        mb: 0.5,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {cycle.cycleNumber}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Cycle {cycle.cycleNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {myContribution
              ? `Due ${formatDate(myContribution.dueDate)}${
                  myContribution.paidAt ? ` • Paid ${formatDate(myContribution.paidAt)}` : ''
                }`
              : 'No contribution for you in this cycle'}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {myContribution ? formatCurrency(myContribution.amount) : '—'}
        </Typography>
        {myContribution && (
          <Chip
            label={myContribution.status}
            color={contributionStatusColor(myContribution.status)}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
}

/**
 * Displays the user's contribution history grouped by cycle,
 * most recent cycle first.
 */
export function ContributionHistoryList({ committeeId, cycles, currentUserId }: ContributionHistoryListProps) {
  // UPCOMING cycles never have generated contributions.
  const relevantCycles = cycles
    .filter((cycle) => cycle.status !== 'UPCOMING')
    .sort((a, b) => b.cycleNumber - a.cycleNumber);

  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Contribution History
      </Typography>
      {relevantCycles.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <ReceiptLongOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No contribution history yet
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Contributions appear once cycles start
          </Typography>
        </Box>
      ) : (
        <Box>
          {relevantCycles.map((cycle) => (
            <ContributionCycleRow
              key={cycle.id}
              committeeId={committeeId}
              cycle={cycle}
              currentUserId={currentUserId}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}
