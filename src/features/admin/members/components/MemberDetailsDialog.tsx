'use client';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { useGetMemberQuery } from '@/features/committees';
import { formatDate, formatDateTime, getInitials } from '@/utils';
import { memberStatusColor } from '../utils/memberStatus';

interface MemberDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  committeeId: string;
  /** Null closes the dialog; the query is skipped until an id is present. */
  memberId: string | null;
}

/** A label/value row used in the member details body. */
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  );
}

/**
 * Member details for GET /committees/:committeeId/members/:id. The query is
 * skipped until the dialog is open with a member id, and the body covers
 * loading / error / success states.
 */
export function MemberDetailsDialog({
  open,
  onClose,
  committeeId,
  memberId,
}: MemberDetailsDialogProps) {
  const { data: member, isError, error } = useGetMemberQuery(
    { committeeId, id: memberId ?? '' },
    { skip: !open || !memberId },
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Member Details</DialogTitle>
      <DialogContent>
        {isError ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {(error as { data?: { message?: string } })?.data?.message ??
              'Failed to load member details. Please try again.'}
          </Alert>
        ) : !member ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: member.role === 'ADMIN' ? 'secondary.main' : 'primary.main',
                }}
              >
                {member.user?.name ? getInitials(member.user.name) : '?'}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" noWrap>
                  {member.user?.name ?? 'Unknown member'}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {member.user?.email ?? '—'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
                  <Chip
                    label={member.role}
                    size="small"
                    color={member.role === 'ADMIN' ? 'secondary' : 'default'}
                    variant="outlined"
                  />
                  <Chip
                    label={member.status}
                    size="small"
                    color={memberStatusColor(member.status)}
                  />
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Detail label="Phone" value={member.user?.phone || '—'} />
            <Detail label="Joined" value={formatDateTime(member.joinedAt)} />
            {member.removedAt && (
              <Detail label="Removed" value={formatDateTime(member.removedAt)} />
            )}
            <Detail label="Membership updated" value={formatDate(member.updatedAt)} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
