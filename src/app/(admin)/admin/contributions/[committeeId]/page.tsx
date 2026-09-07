import { CommitteeContributionsAdmin } from '@/features/admin/contributions';

/**
 * Admin → Contribution & payment management route
 * (`/admin/contributions/:committeeId`).
 *
 * Protected by the `(admin)` layout. The committee id is read from the router
 * inside the `CommitteeContributionsAdmin` client component, which owns the
 * Contributions and Payments tabs plus the loading / error / not-found states.
 */
export default function AdminCommitteeContributionsPage() {
  return <CommitteeContributionsAdmin />;
}
