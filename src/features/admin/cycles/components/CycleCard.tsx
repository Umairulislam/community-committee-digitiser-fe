'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import type { Cycle } from '@/types';
import { formatCurrency, formatDate } from '@/utils';
import {
  cycleStatusColor,
  cycleProgressPercent,
  getNextCycleStatuses,
  canRunLottery,
} from '../utils/statusFlow';

interface CycleCardProps {
  cycle: Cycle;
  hasActiveCycle: boolean;
  onTransitionStatus: (cycle: Cycle, status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => void;
  onViewLottery: (cycle: Cycle) => void;
}

/**
 * Card displaying a single cycle's status, progress, and available actions.
 * Actions (activate, complete, cancel, view lottery) are shown only when the
 * documented state machine allows them.
 */
export function CycleCard({
  cycle,
  hasActiveCycle,
  onTransitionStatus,
  onViewLottery,
}: CycleCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const nextStatuses = getNextCycleStatuses(cycle.status);
  const progress = cycleProgressPercent(cycle.totalExpected, cycle.totalCollected);
  const showLotteryAction = canRunLottery(cycle.status);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTransition = (status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    handleMenuClose();
    onTransitionStatus(cycle, status);
  };

  const canActivate = nextStatuses.includes('ACTIVE') && !hasActiveCycle;

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Cycle {cycle.cycleNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={cycle.status} size="small" color={cycleStatusColor(cycle.status)} />
            {nextStatuses.length > 0 && (
              <>
                <Button
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ minWidth: 0, p: 0.5 }}
                  aria-label="Cycle actions"
                >
                  <MoreVertOutlinedIcon fontSize="small" />
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  {nextStatuses.includes('ACTIVE') && (
                    <MenuItem
                      onClick={() => handleTransition('ACTIVE')}
                      disabled={!canActivate}
                    >
                      {canActivate ? 'Start Cycle' : 'Another Cycle Active'}
                    </MenuItem>
                  )}
                  {nextStatuses.includes('COMPLETED') && (
                    <MenuItem onClick={() => handleTransition('COMPLETED')}>
                      Complete Cycle
                    </MenuItem>
                  )}
                  {nextStatuses.includes('CANCELLED') && (
                    <MenuItem onClick={() => handleTransition('CANCELLED')}>
                      Cancel Cycle
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Collected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">
              {formatCurrency(cycle.totalCollected)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expected {formatCurrency(cycle.totalExpected)}
            </Typography>
          </Box>
        </Box>

        {/* Lottery action */}
        {showLotteryAction && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => onViewLottery(cycle)}
          >
            View Lottery
          </Button>
        )}

        {/* Completed lottery view */}
        {cycle.status === 'COMPLETED' && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onViewLottery(cycle)}
          >
            View Lottery Result
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
