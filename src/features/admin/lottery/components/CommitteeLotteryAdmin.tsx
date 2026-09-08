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
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import type { Cycle, CycleStatus } from '@/types';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '@/features/admin/committees';
import { committeeStatusColor } from '@/features/admin/committees/utils/statusFlow';
import { useGetCyclesQuery, useGetLotteriesQuery } from '@/features/committees';
import { formatCurrency } from '@/utils';
import { LotteryPanel } from '@/features/admin/cycles/components/LotteryPanel';
import { LotteryResultCard } from '@/features/admin/cycles/components/LotteryResultCard';

/** Single-page fetch bound. */
const LIST_LIMIT = 100;

/** Cycles that could have a lottery: ACTIVE or COMPLETED. */
const LOTTERY_RELEVANT: CycleStatus[] = ['ACTIVE', 'COMPLETED'];

/**
 * Committee-scoped lottery management (/admin/lottery/:committeeId).
 *
 * Shows lottery history (completed draws) and allows running the lottery
 * for the currently active cycle when eligible. Uses the admin cycles
 * LotteryPanel component for the active cycle's lottery execution.
 */
export function CommitteeLotteryAdmin() {
  const params = useParams();
  const committeeId = params.committeeId as string;
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

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

  const {
    data: lotteriesData,
    isLoading: lotteriesLoading,
  } = useGetLotteriesQuery({ committeeId });

  const cycles = useMemo(() => cyclesData?.data ?? [], [cyclesData]);
  const lotteries = lotteriesData?.data ?? [];

  // Cycles relevant to lottery: ACTIVE or COMPLETED
  const relevantCycles = useMemo(
    () => cycles.filter((c) => LOTTERY_RELEVANT.includes(c.status)),
    [cycles],
  );

  const activeCycle = cycles.find((c) => c.status === 'ACTIVE') ?? null;
  const selectedCycle = cycles.find((c) => c.id === selectedCycleId) ?? activeCycle;

  const crumbs = [
    { label: 'Lottery', href: '/admin/lottery' },
    { label: committee?.name ?? 'Committee' },
  ];

  if (isLoading) {
    return (
      <AdminPageContainer title="Lottery" breadcrumbs={crumbs}>
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
      <AdminPageContainer title="Lottery" breadcrumbs={crumbs}>
        <Alert severity="error" icon={<ErrorOutlineOutlinedIcon />} sx={{ mb: 2 }}>
          {message}
        </Alert>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/admin/lottery"
            startIcon={<ArrowBackOutlinedIcon />}
            variant="outlined"
          >
            Back to Lottery
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
      <AdminPageContainer title="Lottery" breadcrumbs={crumbs}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Committee not found.
        </Alert>
        <Button
          component={Link}
          href="/admin/lottery"
          startIcon={<ArrowBackOutlinedIcon />}
          variant="outlined"
        >
          Back to Lottery
        </Button>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer
      title="Lottery"
      breadcrumbs={crumbs}
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            href={`/admin/cycles/${committee.id}`}
            variant="outlined"
          >
            View Cycles
          </Button>
          <Button
            component={Link}
            href={`/admin/committees/${committee.id}`}
            variant="outlined"
            startIcon={<ArrowBackOutlinedIcon />}
          >
            View Committee
          </Button>
        </Box>
      }
    >
      {/* Committee context header */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <CasinoOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
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
        </Box>
      </Paper>

      {cyclesLoading || lotteriesLoading ? (
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
          {/* Left: lottery history + cycle selector */}
          <Box sx={{ flex: { xs: 1, lg: '0 0 55%' } }}>
            {/* Active cycle lottery panel */}
            {activeCycle && (
              <Paper sx={{ p: 2.5, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Active Cycle — Cycle {activeCycle.cycleNumber}
                </Typography>
                <LotteryPanel committeeId={committeeId} cycle={activeCycle} />
              </Paper>
            )}

            {/* Lottery history */}
            <Paper sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Lottery History
              </Typography>
              {lotteries.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No lottery results yet. Lotteries appear here once executed.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {lotteries.map((result) => (
                    <LotteryResultCard key={result.id} result={result} />
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          {/* Right: cycle selector for viewing specific cycle lottery */}
          <Box sx={{ flex: { xs: 1, lg: '0 0 45%' } }}>
            <Paper sx={{ p: 2, position: 'sticky', top: 80 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Cycle Lottery Status
              </Typography>
              <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                <InputLabel id="lottery-cycle-select-label">Select Cycle</InputLabel>
                <Select
                  labelId="lottery-cycle-select-label"
                  label="Select Cycle"
                  value={selectedCycle?.id ?? ''}
                  onChange={(event) => setSelectedCycleId(event.target.value)}
                >
                  {relevantCycles.map((cycle) => (
                    <MenuItem key={cycle.id} value={cycle.id}>
                      Cycle {cycle.cycleNumber} ({cycle.status})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedCycle ? (
                <LotteryPanel committeeId={committeeId} cycle={selectedCycle} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {relevantCycles.length === 0
                    ? 'No cycles available for lottery. Generate cycles first.'
                    : 'Select a cycle to view its lottery status.'}
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      )}
    </AdminPageContainer>
  );
}
