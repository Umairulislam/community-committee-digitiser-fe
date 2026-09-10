'use client';

import { Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatReportValue, reportFieldLabel } from '../utils/formatReport';

export function ReportTable<T extends object>({ rows, columns, rowKey, label }: { rows: T[]; columns: readonly (keyof T & string)[]; rowKey: keyof T; label: string }) {
  if (!rows.length) return <Alert severity="info">No report records match this selection.</Alert>;
  return (
    <TableContainer component={Paper} tabIndex={0} role="region" aria-label={label} sx={{ maxWidth: '100%' }}>
      <Table size="small" aria-label={label}>
        <TableHead><TableRow>{columns.map(key => <TableCell key={key} sx={{ whiteSpace: 'nowrap' }}>{reportFieldLabel(key)}</TableCell>)}</TableRow></TableHead>
        <TableBody>{rows.map(row => <TableRow key={String(row[rowKey])}>{columns.map(key => (
          <TableCell key={key} sx={{ minWidth: 120, maxWidth: 320, overflowWrap: 'anywhere' }}>{formatReportValue(key, row[key])}</TableCell>
        ))}</TableRow>)}</TableBody>
      </Table>
    </TableContainer>
  );
}
