'use client';

import Link from 'next/link';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { formatCurrency, formatDateTime } from '@/utils';
import type { ActionRequiredItem } from '../types';

interface ActionRequiredListProps {
  items: ActionRequiredItem[];
  /** Total pending payments across all committees (may exceed the preview list). */
  totalCount: number;
}

/**
 * Action Required — payments awaiting admin verification
 * (GET /committees/:id/payments?status=PENDING). Verification itself is a
 * later phase; this surfaces what needs attention and links to the section.
 */
export function ActionRequiredList({ items, totalCount }: ActionRequiredListProps) {
  return (
    <Paper sx={{ p: 2.5, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Action Required
        </Typography>
        {totalCount > 0 && (
          <Chip label={`${totalCount} pending`} color="warning" size="small" />
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Payments awaiting verification
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <FactCheckOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Nothing to verify
          </Typography>
          <Typography variant="caption" color="text.disabled">
            No payments are awaiting verification
          </Typography>
        </Box>
      ) : (
        <Box>
          {items.map((item) => (
            <Box
              key={item.paymentId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 1.5,
                px: 1.5,
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {item.memberName} · {formatCurrency(item.amount)}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {item.committeeName} · Ref {item.transactionReference} ·{' '}
                  {formatDateTime(item.createdAt)}
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/contributions"
                size="small"
                variant="outlined"
                sx={{ flexShrink: 0 }}
              >
                Review
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
