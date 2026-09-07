'use client';

import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteesQuery } from '@/features/admin/committees';
import { committeeStatusColor } from '@/features/admin/committees/utils/statusFlow';

/** Single-page fetch bound; matches the admin committees listing cap. */
const LIST_LIMIT = 100;

/**
 * Members landing page (`/admin/members`).
 *
 * Members and invitations are committee-scoped in the documented API, so this
 * page lists the committees the admin manages (GET /committees) and links each
 * to its member management view. Covers loading / error / empty / success.
 */
export function MembersAdmin() {
  const { data, isLoading, isError, error, refetch } = useGetCommitteesQuery({ limit: LIST_LIMIT });
  const committees = data?.data ?? [];

  return (
    <AdminPageContainer
      title="Members"
      breadcrumbs={[{ label: 'Members' }]}
      actions={
        <Button component={Link} href="/admin/committees" variant="outlined">
          Go to Committees
        </Button>
      }
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
        Member management is organised per committee. Choose a committee to view its members,
        invite people by email, track invitation status, and remove members.
      </Typography>

      {isLoading ? (
        <Grid container spacing={2}>
          {[0, 1, 2, 3].map((key) => (
            <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      ) : isError ? (
        <Box>
          <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 2 }}>
            {(error as { data?: { message?: string } })?.data?.message ??
              'Failed to load your committees. Please try again.'}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => refetch()}>
            Retry
          </Button>
        </Box>
      ) : committees.length === 0 ? (
        <Paper sx={{ py: 8, px: 3, textAlign: 'center' }}>
          <GroupsOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No committees yet
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
            Create a committee first — you can manage its members once it exists.
          </Typography>
          <Button component={Link} href="/admin/committees" variant="contained">
            Go to Committees
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {committees.map((committee) => (
            <Grid key={committee.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                component={Link}
                href={`/admin/members/${committee.id}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  height: '100%',
                  p: 2.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  textDecoration: 'none',
                  color: 'text.primary',
                  transition: 'border-color 150ms, box-shadow 150ms',
                  '&:hover': { borderColor: 'primary.main', boxShadow: 3 },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {committee.name}
                  </Typography>
                  <Chip
                    label={committee.status}
                    size="small"
                    color={committeeStatusColor(committee.status)}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Member limit {committee.memberLimit} · {committee.totalCycles} cycles
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 'auto',
                    color: 'primary.main',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Manage members
                  </Typography>
                  <ChevronRightOutlinedIcon fontSize="small" />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </AdminPageContainer>
  );
}
