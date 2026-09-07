'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '@/features/admin/committees';
import { committeeStatusColor } from '@/features/admin/committees/utils/statusFlow';
import { formatCurrency } from '@/utils';
import { MembersTab } from './MembersTab';
import { InvitationsTab } from './InvitationsTab';

/**
 * Admin member management for a single committee (`/admin/members/:committeeId`).
 *
 * Members and invitations are committee-scoped in the documented API, so this
 * page loads the committee (GET /committees/:id) for context and then presents
 * two tabs — Members and Invitations — each backed by its own documented
 * endpoints. Covers loading / error / not-found states for the committee fetch.
 */
export function CommitteeMembersAdmin() {
  const params = useParams();
  const committeeId = params.committeeId as string;
  const { data: committee, isLoading, isError, error, refetch } = useGetCommitteeQuery({
    id: committeeId,
  });
  const [tab, setTab] = useState(0);

  const crumbs = [
    { label: 'Members', href: '/admin/members' },
    { label: committee?.name ?? 'Committee' },
  ];

  if (isLoading) {
    return (
      <AdminPageContainer title="Member Management" breadcrumbs={crumbs}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </AdminPageContainer>
    );
  }

  if (isError) {
    const message =
      (error as { data?: { message?: string } })?.data?.message ??
      'Failed to load this committee.';
    return (
      <AdminPageContainer title="Member Management" breadcrumbs={crumbs}>
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 2 }}>
          {message}
        </Alert>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/admin/members"
            startIcon={<ArrowBackOutlinedIcon />}
            variant="outlined"
          >
            Back to Members
          </Button>
          <Button onClick={() => refetch()} startIcon={<RefreshOutlinedIcon />}>
            Retry
          </Button>
        </Box>
      </AdminPageContainer>
    );
  }

  if (!committee) {
    return (
      <AdminPageContainer title="Member Management" breadcrumbs={crumbs}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Committee not found.
        </Alert>
        <Button
          component={Link}
          href="/admin/members"
          startIcon={<ArrowBackOutlinedIcon />}
          variant="outlined"
        >
          Back to Members
        </Button>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer
      title="Member Management"
      breadcrumbs={crumbs}
      actions={
        <Button
          component={Link}
          href={`/admin/committees/${committee.id}`}
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
        >
          View Committee
        </Button>
      }
    >
      {/* Committee context header */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <HowToRegOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              {committee.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member limit {committee.memberLimit} · Contribution{' '}
              {formatCurrency(committee.contributionAmount)}
            </Typography>
          </Box>
          <Chip label={committee.status} color={committeeStatusColor(committee.status)} />
        </Box>
      </Paper>

      <Tabs
        value={tab}
        onChange={(_event, value) => setTab(value)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Members" />
        <Tab label="Invitations" />
      </Tabs>

      {tab === 0 ? (
        <MembersTab committeeId={committee.id} />
      ) : (
        <InvitationsTab
          committeeId={committee.id}
          committeeName={committee.name}
          committeeStatus={committee.status}
        />
      )}
    </AdminPageContainer>
  );
}
