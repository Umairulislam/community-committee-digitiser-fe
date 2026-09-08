import { CommitteeCyclesAdmin } from '@/features/admin/cycles';

/**
 * Admin → Committee cycles management route (/admin/cycles/:committeeId).
 *
 * Protected by the (admin) layout. The committee id is read from the router
 * inside the CommitteeCyclesAdmin client component, which owns the cycle
 * list, status transitions, generate-cycles, and lottery management.
 */
export default function AdminCommitteeCyclesPage() {
  return <CommitteeCyclesAdmin />;
}
