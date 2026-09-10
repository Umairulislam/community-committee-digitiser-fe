'use client';

import { useParams } from 'next/navigation';
import { Alert, Button, CircularProgress } from '@mui/material';
import { AdminPageContainer } from '@/components/layout/admin';
import { useGetCommitteeQuery } from '@/features/admin/committees';
import { SendNotificationForm } from './SendNotificationForm';

export function CommitteeNotificationsAdmin() {
  const { committeeId } = useParams<{ committeeId: string }>();
  const { currentData: committee, isFetching, isError, refetch } = useGetCommitteeQuery({ id: committeeId }, { refetchOnMountOrArgChange: true });
  return (
    <AdminPageContainer title="Send notification" breadcrumbs={[{ label: 'Notifications', href: '/admin/notifications' }, { label: committee?.name ?? 'Committee' }]}>
      {isFetching ? <CircularProgress aria-label="Loading committee" /> : isError || !committee ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>Unable to load this committee.</Alert>
      ) : <SendNotificationForm key={committeeId} committeeId={committeeId} committeeName={committee.name} />}
    </AdminPageContainer>
  );
}
