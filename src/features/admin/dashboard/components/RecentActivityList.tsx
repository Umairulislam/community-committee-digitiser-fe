'use client';

import { Box, Paper, Typography } from '@mui/material';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import { formatDateTime } from '@/utils';
import type { RecentActivityItem } from '../types';

interface RecentActivityListProps {
  items: RecentActivityItem[];
}

/** Humanise an AuditAction enum value (e.g. PAYMENT_VERIFIED → "Payment verified"). */
function humaniseAction(action: string): string {
  const words = action.replace(/_/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Recent Admin Activity — the newest audit-trail entries across the admin's
 * committees (GET /committees/:id/audit-logs). Audit entries are immutable and
 * created only by the backend, so they are shown read-only.
 */
export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Recent Activity
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Latest audit-trail events across your committees
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <HistoryEduOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No recent activity
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Audit events appear as committees are managed
          </Typography>
        </Box>
      ) : (
        <Box>
          {items.map((item) => (
            <Box
              key={item.auditLogId}
              sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.25 }}
            >
              <Box
                sx={{
                  mt: 0.25,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {humaniseAction(item.action)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.committeeName} · {formatDateTime(item.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
