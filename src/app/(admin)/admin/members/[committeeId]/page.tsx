import { CommitteeMembersAdmin } from '@/features/admin/members';

/**
 * Admin → Member management route (`/admin/members/:committeeId`).
 *
 * Protected by the `(admin)` layout. The committee id is read from the router
 * inside the `CommitteeMembersAdmin` client component, which owns the Members
 * and Invitations tabs plus the loading / error / not-found states.
 */
export default function AdminCommitteeMembersPage() {
  return <CommitteeMembersAdmin />;
}
