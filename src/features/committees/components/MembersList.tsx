'use client';

import {
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import type { Member, MemberStatus } from '@/types';
import { formatDate, getInitials } from '@/utils';

interface MembersListProps {
  members: Member[];
  loading?: boolean;
}

/** Maps member status to chip color. */
function statusColor(status: MemberStatus): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INVITED':
      return 'info';
    case 'REMOVED':
      return 'error';
    case 'INACTIVE':
      return 'warning';
    default:
      return 'default';
  }
}

/**
 * Displays a table of committee members.
 */
export function MembersList({ members, loading }: MembersListProps) {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Members
        </Typography>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'action.hover' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ height: 14, bgcolor: 'action.hover', borderRadius: 1, mb: 0.5, width: '40%' }} />
              <Box sx={{ height: 12, bgcolor: 'action.hover', borderRadius: 1, width: '30%' }} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  if (members.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Members
        </Typography>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <PersonOutlineOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No members found
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Members ({members.length})
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: member.role === 'ADMIN' ? 'secondary.main' : 'primary.main',
                        fontSize: '0.75rem',
                      }}
                    >
                      {member.user?.name ? getInitials(member.user.name) : '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {member.user?.name ?? 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.user?.email ?? ''}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.role}
                    size="small"
                    color={member.role === 'ADMIN' ? 'secondary' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.status}
                    size="small"
                    color={statusColor(member.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(member.joinedAt)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
