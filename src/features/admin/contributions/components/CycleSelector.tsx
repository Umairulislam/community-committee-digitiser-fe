'use client';

import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { Cycle } from '@/types';
import { formatDate } from '@/utils';
import { cycleStatusColor } from '../utils/statusFlow';

interface CycleSelectorProps {
  cycles: Cycle[];
  value: string | null;
  onChange: (cycleId: string) => void;
  disabled?: boolean;
}

/** Short label for a cycle used across the feature ("Cycle 3"). */
export function cycleLabel(cycle: Pick<Cycle, 'cycleNumber'>): string {
  return `Cycle ${cycle.cycleNumber}`;
}

/**
 * Cycle picker for the contributions workflow. Contributions are cycle-scoped
 * in the documented API (`GET /committees/:cid/cycles/:cycleId/contributions`),
 * so the admin first selects which cycle to inspect.
 */
export function CycleSelector({ cycles, value, onChange, disabled = false }: CycleSelectorProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 280 }} disabled={disabled}>
      <InputLabel id="cycle-selector-label">Cycle</InputLabel>
      <Select
        labelId="cycle-selector-label"
        label="Cycle"
        value={value ?? ''}
        onChange={(event: SelectChangeEvent<string>) => onChange(event.target.value)}
      >
        {cycles.map((cycle) => (
          <MenuItem key={cycle.id} value={cycle.id}>
            {cycleLabel(cycle)}
            {' · '}
            {formatDate(cycle.startDate)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

/** Status chip for a cycle (kept next to the selector for context). */
export function CycleStatusChip({ cycle }: { cycle: Cycle }) {
  return <Chip label={cycle.status} size="small" color={cycleStatusColor(cycle.status)} />;
}
