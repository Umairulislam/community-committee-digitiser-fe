'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { AdminPageContainer, ADMIN_NAV_SECTIONS } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '../api/adminCommitteesApi';
import { CommitteeOverview } from './CommitteeOverview';
import { CommitteeFormDialog } from './CommitteeFormDialog';
import { UpdateStatusDialog } from './UpdateStatusDialog';
import { canEditCommittee, isTerminalStatus } from '../utils/statusFlow';

/** Admin sections related to a committee, reused from the shared nav config. */
const RELATED_PATHS = [
  '/admin/members',
  '/admin/contributions',
  '/admin/cycles',
  '/admin/payouts',
  '/admin/audit-logs',
];

const CRUMBS = [{ label: 'Committees', href: '/admin/committees' }];

/**
 * Admin committee detail page.
 *
 * Loads a single committee via GET /committees/:id and presents its overview,
 * the management actions allowed by its status (edit while DRAFT, status
 * transitions while non-terminal), and links to related admin sections.
 */
export function AdminCommitteeDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data: committee, isLoading, isError, error, refetch } = useGetCommitteeQuery({ id });
  const [editOpen, setEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  if (isLoading) {
    return (
      <AdminPageContainer title="Committee Details" breadcrumbs={CRUMBS}>
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
      <AdminPageContainer title="Committee Details" breadcrumbs={CRUMBS}>
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 2 }}>
          {message}
        </Alert>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/admin/committees"
            startIcon={<ArrowBackOutlinedIcon />}
            variant="outlined"
          >
            Back to Committees
          </Button>
          <Button onClick={() => refetch()}>Retry</Button>
        </Box>
      </AdminPageContainer>
    );
  }

  if (!committee) {
    return (
      <AdminPageContainer title="Committee Details" breadcrumbs={CRUMBS}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Committee not found.
        </Alert>
        <Button
          component={Link}
          href="/admin/committees"
          startIcon={<ArrowBackOutlinedIcon />}
          variant="outlined"
        >
          Back to Committees
        </Button>
      </AdminPageContainer>
    );
  }

  const editable = canEditCommittee(committee.status);
  const terminal = isTerminalStatus(committee.status);
  const relatedLinks = ADMIN_NAV_SECTIONS.flatMap((section) => section.items).filter((item) =>
    RELATED_PATHS.includes(item.path) && !item.disabled,
  );

  return (
    <AdminPageContainer title={committee.name} breadcrumbs={CRUMBS}>
      <CommitteeOverview committee={committee} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Management
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Edit details or move the committee through its lifecycle.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Edit details
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {editable
                    ? 'Name, description, amounts, and schedule.'
                    : 'Editing is only available while the committee is a DRAFT.'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                disabled={!editable}
                onClick={() => setEditOpen(true)}
                sx={{ flexShrink: 0 }}
              >
                Edit
              </Button>
            </Box>

            <Divider />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Committee status
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {terminal
                    ? `${committee.status} is a terminal status.`
                    : 'Activate, pause, complete, or cancel.'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<SwapHorizOutlinedIcon />}
                disabled={terminal}
                onClick={() => setStatusOpen(true)}
                sx={{ flexShrink: 0 }}
              >
                Update Status
              </Button>
            </Box>

            <Alert severity="info" sx={{ mt: 1.5 }}>
              Edits and status changes are recorded in the audit trail. The backend validates every
              change and remains the source of truth.
            </Alert>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Related sections
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Manage this committee&apos;s members, money, and history.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {relatedLinks.map((link) => (
                <Box
                  key={link.path}
                  component={Link}
                  href={link.path === '/admin/payouts' ? `${link.path}/${committee.id}` : link.path}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 1.5,
                    border: 1,
                    borderColor: 'divider',
                    color: 'text.primary',
                    textDecoration: 'none',
                    transition: 'background-color 150ms, border-color 150ms',
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                  }}
                >
                  <link.icon sx={{ fontSize: 20, color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, flexGrow: 1 }}>
                    {link.label}
                  </Typography>
                  <ArrowForwardOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <CommitteeFormDialog
        open={editOpen}
        mode="edit"
        committee={committee}
        onClose={() => setEditOpen(false)}
      />
      <UpdateStatusDialog
        open={statusOpen}
        committee={committee}
        onClose={() => setStatusOpen(false)}
      />
    </AdminPageContainer>
  );
}
