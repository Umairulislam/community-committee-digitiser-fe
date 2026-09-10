'use client';

import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { AdminPageContainer } from '@/components/layout/admin';
import { AdminCommitteePicker } from '@/features/admin/shared/components/AdminCommitteePicker';
import { AdminNotificationHistory } from './AdminNotificationHistory';

export function NotificationsAdmin() {
  const [tab, setTab] = useState(0);
  return (
    <AdminPageContainer title="Notifications" breadcrumbs={[{ label: 'Notifications' }]}>
      <Tabs value={tab} onChange={(_, value: number) => setTab(value)} aria-label="Notification views" sx={{ mb: 3 }}>
        <Tab id="notification-send-tab" aria-controls="notification-send-panel" label="Send notification" />
        <Tab id="notification-history-tab" aria-controls="notification-history-panel" label="Your history" />
      </Tabs>
      {tab === 0 ? <Box role="tabpanel" id="notification-send-panel" aria-labelledby="notification-send-tab">
        <AdminCommitteePicker title="Choose a committee" path="/admin/notifications" description="Select a committee to send a notification to its supported audience." />
      </Box> : <Box role="tabpanel" id="notification-history-panel" aria-labelledby="notification-history-tab"><AdminNotificationHistory /></Box>}
    </AdminPageContainer>
  );
}
