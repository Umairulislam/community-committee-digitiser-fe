import { AdminPageContainer } from '@/components/layout/admin';
import { AdminCommitteePicker } from '@/features/admin/shared/components/AdminCommitteePicker';

export function ReportsAdmin() {
  return <AdminPageContainer title="Reports" breadcrumbs={[{ label: 'Reports' }]}>
    <AdminCommitteePicker title="Choose a committee" path="/admin/reports" description="View committee summaries and download reports." />
  </AdminPageContainer>;
}
