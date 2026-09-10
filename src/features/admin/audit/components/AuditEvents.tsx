'use client';

import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from '@mui/material';
import type { AuditLog } from '@/types';
import { formatDateTime } from '@/utils';
import { auditLabel } from '../utils/auditLabels';

interface AuditEventsProps {
  events: AuditLog[];
  committeeName: string;
  creator?: { id: string; name: string };
  chronological?: boolean;
}

/** Only explicit record fields are displayed; arbitrary metadata is never rendered. */
export function AuditEvents({ events, committeeName, creator, chronological }: AuditEventsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = events.find((event) => event.id === selectedId);
  const actor = (event: AuditLog) => creator?.id === event.actorId ? `${creator.name} (${event.actorId})` : event.actorId || 'Not recorded';
  return (
    <>
      <Box component="ol" aria-label={chronological ? 'Committee timeline, oldest first' : 'Audit logs, newest first'} sx={{ m: 0, pl: chronological ? 3 : 0, listStyle: chronological ? 'decimal' : 'none' }}>
        {events.map((event) => (
          <Paper component="li" key={event.id} sx={{ p: 2.5, mb: 2, overflowWrap: 'anywhere', ...(chronological && { borderLeft: 3, borderColor: 'primary.main' }) }}>
            <Typography variant="subtitle1">{auditLabel(event.action)}</Typography>
            <Typography variant="body2">Performed by: {actor(event)}</Typography>
            <Typography variant="body2">Committee: {committeeName}</Typography>
            <Typography variant="body2">Cycle: {event.cycleId ?? 'Not associated with a cycle'}</Typography>
            <Typography variant="body2" color="text.secondary" component="time" dateTime={event.createdAt}>{formatDateTime(event.createdAt)}</Typography>
            <Box sx={{ mt: 1 }}><Button onClick={() => setSelectedId(event.id)} aria-label={`View details: ${auditLabel(event.action)}`}>View details</Button></Box>
          </Paper>
        ))}
      </Box>
      <Dialog open={Boolean(selected)} onClose={() => setSelectedId(null)} fullWidth maxWidth="sm" aria-labelledby="audit-details-title">
        <DialogTitle id="audit-details-title">Audit event details</DialogTitle>
        <DialogContent sx={{ overflowWrap: 'anywhere' }}>
          {selected && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>Action: {auditLabel(selected.action)} ({selected.action})</Typography>
            <Typography>Performed by: {actor(selected)}</Typography>
            <Typography>When: {formatDateTime(selected.createdAt)}</Typography>
            <Typography>Committee: {committeeName} ({selected.committeeId})</Typography>
            <Typography>Cycle: {selected.cycleId ?? 'Not associated with a cycle'}</Typography>
            <Typography>Entity type: {selected.entityType}</Typography>
            <Typography>Entity ID: {selected.entityId}</Typography>
            <Typography>Event ID: {selected.id}</Typography>
          </Box>}
        </DialogContent>
        <DialogActions><Button onClick={() => setSelectedId(null)}>Close</Button></DialogActions>
      </Dialog>
    </>
  );
}
