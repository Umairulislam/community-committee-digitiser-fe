'use client';

import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { formatCurrency, formatDate, formatDateTime } from '@/utils';
import type { AdminCommittee } from '../types';
import { committeeStatusColor } from '../utils/statusFlow';

interface CommitteeOverviewProps {
  committee: AdminCommittee;
}

/** Label/value pair for the overview fact grid. */
function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

/**
 * Committee overview — the documented committee fields from GET /committees/:id.
 * Values are shown exactly as the backend returns them (status included).
 */
export function CommitteeOverview({ committee }: CommitteeOverviewProps) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              flexShrink: 0,
            }}
          >
            <GroupsOutlinedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {committee.name}
            </Typography>
            {committee.description && (
              <Typography variant="body2" color="text.secondary">
                {committee.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.disabled">
              {committee.creator
                ? `Created by ${committee.creator.name} (${committee.creator.email})`
                : 'Created by you'}{' '}
              on {formatDate(committee.createdAt)}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={committee.status}
          color={committeeStatusColor(committee.status)}
          variant="outlined"
          sx={{ flexShrink: 0 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(6, 1fr)',
          },
          gap: 2,
        }}
      >
        <Fact label="Contribution" value={formatCurrency(committee.contributionAmount)} />
        <Fact label="Member Limit" value={committee.memberLimit} />
        <Fact label="Total Cycles" value={committee.totalCycles} />
        <Fact label="Due Day" value={committee.dueDay} />
        <Fact label="Start Date" value={formatDate(committee.startDate)} />
        <Fact label="Payout Method" value={committee.payoutMethod} />
      </Box>

      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 2 }}>
        Last updated {formatDateTime(committee.updatedAt)}
      </Typography>
    </Paper>
  );
}
