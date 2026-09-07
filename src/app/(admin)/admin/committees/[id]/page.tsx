import { AdminCommitteeDetail } from '@/features/admin/committees';

/**
 * Admin → Committee detail route (`/admin/committees/:id`).
 *
 * Protected by the `(admin)` layout. The committee id is read from the router
 * inside the `AdminCommitteeDetail` client component, which owns the overview,
 * management actions, and loading / error / not-found states.
 */
export default function AdminCommitteeDetailPage() {
  return <AdminCommitteeDetail />;
}
