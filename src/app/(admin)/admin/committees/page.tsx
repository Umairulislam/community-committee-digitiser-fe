import { CommitteesAdmin } from '@/features/admin/committees';

/**
 * Admin → Committees listing route.
 *
 * Protected by the `(admin)` layout (AdminGuard + AdminShell). All data
 * fetching and interaction live in the `CommitteesAdmin` client feature
 * component; this route stays a thin server boundary.
 */
export default function AdminCommitteesPage() {
  return <CommitteesAdmin />;
}
