import { MembersAdmin } from '@/features/admin/members';

/**
 * Admin → Members landing route (`/admin/members`).
 *
 * Protected by the `(admin)` layout (AdminGuard + AdminShell). Members are
 * committee-scoped in the documented API, so this page lists the admin's
 * committees and links to each committee's member management view. All data
 * fetching and interaction live in the `MembersAdmin` client component.
 */
export default function AdminMembersPage() {
  return <MembersAdmin />;
}
