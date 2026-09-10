import { Box, Chip, Typography } from '@mui/material';
import type { AdminPayout } from '../types';
import { formatCurrency, formatDateTime } from '@/utils';

export function PayoutSummary({ payout }: { payout: AdminPayout }) {
  const fields = [
    ['Winner', payout.member?.user?.name ?? payout.memberId],
    ['Email', payout.member?.user?.email ?? 'Not provided'],
    ['Member ID', payout.memberId],
    ['Membership', payout.member ? `${payout.member.role} / ${payout.member.status}` : 'Not available'],
    ['Cycle', payout.cycle ? `Cycle ${payout.cycle.cycleNumber} / ${payout.cycle.status}` : payout.cycleId],
    ['Payout amount', formatCurrency(payout.amount)],
    ['Reference', payout.reference || 'Not provided'],
    ['Paid at', formatDateTime(payout.paidAt)],
    ['Created', formatDateTime(payout.createdAt)],
    ['Updated', formatDateTime(payout.updatedAt)],
    ['Payout ID', payout.id],
  ];
  return (
    <Box>
      <Chip label={payout.status} sx={{ mb: 2 }} color={payout.status === 'COMPLETED' ? 'success' : payout.status === 'FAILED' ? 'error' : 'warning'} />
      <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        {fields.map(([label, value]) => (
          <Box key={label} sx={{ minWidth: 0 }}>
            <Typography component="dt" variant="caption" color="text.secondary">{label}</Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0, overflowWrap: 'anywhere' }}>{value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
