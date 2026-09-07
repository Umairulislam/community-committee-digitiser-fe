'use client';

import Link from 'next/link';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { formatCurrency, formatDate } from '@/utils';
import type { AdminCommittee } from '../types';
import { canEditCommittee, committeeStatusColor } from '../utils/statusFlow';

interface AdminCommitteeCardProps {
  committee: AdminCommittee;
  /** Opens the edit dialog — only offered for DRAFT committees. */
  onEdit: (committee: AdminCommittee) => void;
}

/** Small label/value pair used in the card fact grid. */
function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
        {value}
      </Typography>
    </Box>
  );
}

/**
 * Admin committee card for the listing grid. Shows the documented committee
 * fields and links to the detail page, with an inline edit action for drafts.
 */
export function AdminCommitteeCard({ committee, onEdit }: AdminCommitteeCardProps) {
  const editable = canEditCommittee(committee.status);

  return (
    <Paper sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
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
              flexShrink: 0,
            }}
          >
            <GroupsOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
              {committee.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {committee.creator ? `Created by ${committee.creator.name}` : '\u00A0'}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={committee.status}
          color={committeeStatusColor(committee.status)}
          size="small"
          variant="outlined"
          sx={{ flexShrink: 0 }}
        />
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2,
          minHeight: 40,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {committee.description || 'No description'}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 2 }}>
        <Fact label="Contribution" value={formatCurrency(committee.contributionAmount)} />
        <Fact label="Member Limit" value={committee.memberLimit} />
        <Fact label="Total Cycles" value={committee.totalCycles} />
        <Fact label="Due Day" value={committee.dueDay} />
        <Fact label="Start Date" value={formatDate(committee.startDate)} />
        <Fact label="Payout" value={committee.payoutMethod} />
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <Button
          component={Link}
          href={`/admin/committees/${committee.id}`}
          size="small"
          variant="outlined"
          endIcon={<ArrowForwardOutlinedIcon />}
          sx={{ flexGrow: 1 }}
        >
          View
        </Button>
        {editable && (
          <Button
            size="small"
            variant="text"
            startIcon={<EditOutlinedIcon />}
            onClick={() => onEdit(committee)}
          >
            Edit
          </Button>
        )}
      </Box>
    </Paper>
  );
}
