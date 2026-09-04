'use client';

import { Box, Chip, Paper, Typography } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import type { Committee, MemberRole, MemberStatus } from '@/types';
import { formatCurrency } from '@/utils';

interface CommitteeCardProps {
  committee: Committee;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
}

/** Maps committee status to chip color. */
function statusChipColor(status: Committee['status']): 'default' | 'success' | 'warning' | 'info' | 'error' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PAUSED':
      return 'warning';
    case 'COMPLETED':
      return 'info';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * A card showing a committee summary with key details.
 */
export function CommitteeCard({ committee, role, status, joinedAt }: CommitteeCardProps) {
  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <GroupsOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {committee.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {committee.description ?? 'No description'}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={committee.status}
          color={statusChipColor(committee.status)}
          size="small"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Contribution
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formatCurrency(committee.contributionAmount)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total Cycles
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {committee.totalCycles}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Due Day
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {committee.dueDay}th
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Your Role
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {role}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, color: 'text.secondary' }}>
        <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
        <Typography variant="caption">
          Joined {new Date(joinedAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}
        </Typography>
        {status !== 'ACTIVE' && (
          <Chip label={status} size="small" sx={{ ml: 1, height: 20, fontSize: '0.625rem' }} />
        )}
      </Box>
    </Paper>
  );
}
