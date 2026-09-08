'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import type { Cycle, CycleStatus } from '@/types';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '@/features/admin/committees';
import { committeeStatusColor } from '@/features/admin/committees/utils/statusFlow';
import { useGetCyclesQuery } from '@/features/committees';
import { formatCurrency } from '@/utils';
import { cycleStatusColor } from '../utils/statusFlow';
import { useUpdateCycleStatusMutation } from '../api/adminCyclesApi';
import { CycleCard } from './CycleCard';
import { GenerateCyclesDialog } from './GenerateCyclesDialog';
import { ConfirmCycleDialog } from './ConfirmCycleDialog';
import { LotteryPanel } from './LotteryPanel';

/** Single-page fetch bound; matches the admin listings cap. */
const LIST_LIMIT = 100;

const CYCLE_FILTERS: Array<CycleStatus | 'ALL'> = ['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED', 'CANCELLED'];

type TransitionState = { cycle: Cycle; status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' } | null;

/**
 * Admin cycle & lottery management for a single committee
 * (/admin/cycles/:committeeId).
 *
 * Loads the committee for context and its cycles (ascending by cycle number).
 * Shows cycle cards with progress, status transitions, generate-cycles action,
 * and per-cycle lottery management.
 */
export function CommitteeCyclesAdmin() {
  const params = useParams();
  const committeeId = params.committeeId as string;
  const [statusFilter, setStatusFilter] = useState<CycleStatus | 'ALL'>('ALL');
  const [generateOpen, setGenerateOpen] = useState(false);
  const [transition, setTransition] = useState<TransitionState>(null);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [showLotteryFor, setShowLotteryFor] = useState<Cycle | null>(null);

  const {
    data: committee,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCommitteeQuery({ id: committeeId });

  const {
    data: cyclesData,
    isLoading: cyclesLoading,
    isError: cyclesError,
    error: cyclesErrorData,
    refetch: refetchCycles,
  } = useGetCyclesQuery({ committeeId, limit: LIST_LIMIT });

  const [updateCycleStatus, { isLoading: transitioning, error: transitionError }] =
    useUpdateCycleStatusMutation();

  const cycles = useMemo(() => cyclesData?.data ?? [], [cyclesData]);
  const hasActiveCycle = cycles.some((c) => c.status === 'ACTIVE');

  const filteredCycles = useMemo(() => {
    if (statusFilter === 'ALL') return cycles;
    return cycles.filter((c) => c.status === statusFilter);
  }, [cycles, statusFilter]);

  const selectedCycle = showLotteryFor ?? cycles.find((c) => c.id === selectedCycleId) ?? null;

  const crumbs = [
    { label: 'Cycles', href: '/admin/cycles' },
    { label: committee?.name ?? 'Committee' },
  ];

  const handleTransition = async () => {
    if (!transition) return;
    try {
      await updateCycleStatus({
        committeeId,
        id: transition.cycle.id,
        status: transition.status,
      }).unwrap();
      setTransition(null);
    } catch {
      // Error displayed via transitionError state
    }
  };

  const handleViewLottery = (cycle: Cycle) => {
    setShowLotteryFor(cycle);
    setSelectedCycleId(cycle.id);
  };

  const transitionErrorMessage = transitionError
    ? (transitionError as { data?: { message?: string } })?.data?.message ?? 'Failed to update cycle status.'
    : null;

  if (isLoading) {
    return (
      <AdminPageContainer title="Cycles" breadcrumbs={crumbs}>
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
      <AdminPageContainer title="Cycles" breadcrumbs={crumbs}>
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 2 }}>
          {message}
        </Alert>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/admin/cycles"
            startIcon={<ArrowBackOutlinedIcon />}
            variant="outlined"
          >
            Back to Cycles
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
      <AdminPageContainer title="Cycles" breadcrumbs={crumbs}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Committee not found.
        </Alert>
        <Button
          component={Link}
          href="/admin/cycles"
          startIcon={<ArrowBackOutlinedIcon />}
          variant="outlined"
        >
          Back to Cycles
        </Button>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer
      title="Cycles"
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
          <AutorenewOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              {committee.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member limit {committee.memberLimit} · Contribution{' '}
              {formatCurrency(committee.contributionAmount)} · {committee.totalCycles} total cycles
            </Typography>
          </Box>
          <Chip label={committee.status} color={committeeStatusColor(committee.status)} />
          <Button
            variant="contained"
            startIcon={<AutorenewOutlinedIcon />}
            onClick={() => setGenerateOpen(true)}
            disabled={committee.status !== 'ACTIVE'}
          >
            Generate Cycles
          </Button>
        </Box>
      </Paper>

      {cyclesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : cyclesError ? (
        <Box>
          <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 2 }}>
            {(cyclesErrorData as { data?: { message?: string } })?.data?.message ??
              'Failed to load cycles. Please try again.'}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => refetchCycles()}>
            Retry
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Cycle list */}
          <Box sx={{ flex: { xs: 1, lg: '0 0 55%' } }}>
            {/* Filter */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="cycle-status-filter-label">Status</InputLabel>
                <Select
                  labelId="cycle-status-filter-label"
                  label="Status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as CycleStatus | 'ALL')}
                >
                  {CYCLE_FILTERS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === 'ALL' ? 'All statuses' : status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            {filteredCycles.length === 0 ? (
              <Paper sx={{ py: 6, px: 3, textAlign: 'center' }}>
                <AutorenewOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {cycles.length === 0 ? 'No cycles yet' : 'No cycles match the filter'}
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  {cycles.length === 0
                    ? 'Click "Generate Cycles" to create the cycle schedule for this committee.'
                    : 'Try a different status filter.'}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {filteredCycles.map((cycle) => (
                  <Grid key={cycle.id} size={{ xs: 12, md: 6 }}>
                    <CycleCard
                      cycle={cycle}
                      hasActiveCycle={hasActiveCycle}
                      onTransitionStatus={(c, status) => setTransition({ cycle: c, status })}
                      onViewLottery={handleViewLottery}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Lottery panel for selected cycle */}
          {selectedCycle && (
            <Box sx={{ flex: { xs: 1, lg: '0 0 45%' } }}>
              <Paper sx={{ p: 2, position: 'sticky', top: 80 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Lottery - Cycle {selectedCycle.cycleNumber}
                  </Typography>
                  <Chip
                    label={selectedCycle.status}
                    size="small"
                    color={cycleStatusColor(selectedCycle.status)}
                  />
                </Box>
                <LotteryPanel committeeId={committeeId} cycle={selectedCycle} />
              </Paper>
            </Box>
          )}
        </Box>
      )}

      {/* Generate cycles dialog */}
      <GenerateCyclesDialog
        open={generateOpen}
        committeeId={committeeId}
        committeeName={committee.name}
        onClose={() => setGenerateOpen(false)}
      />

      {/* Confirm status transition dialog */}
      {transition && (
        <ConfirmCycleDialog
          open
          title={
            transition.status === 'ACTIVE'
              ? 'Start Cycle'
              : transition.status === 'COMPLETED'
                ? 'Complete Cycle'
                : 'Cancel Cycle'
          }
          message={
            transition.status === 'ACTIVE'
              ? `Activate Cycle ${transition.cycle.cycleNumber}? Only one cycle can be active at a time. The start date will be set automatically.`
              : transition.status === 'COMPLETED'
                ? `Complete Cycle ${transition.cycle.cycleNumber}? The end date will be set automatically. This action cannot be undone.`
                : `Cancel Cycle ${transition.cycle.cycleNumber}? This action cannot be undone.`
          }
          confirmLabel={
            transition.status === 'ACTIVE'
              ? 'Start Cycle'
              : transition.status === 'COMPLETED'
                ? 'Complete Cycle'
                : 'Cancel Cycle'
          }
          confirmColor={transition.status === 'CANCELLED' ? 'error' : 'primary'}
          loading={transitioning}
          errorMessage={transitionErrorMessage}
          onConfirm={handleTransition}
          onClose={() => setTransition(null)}
        />
      )}
    </AdminPageContainer>
  );
}
