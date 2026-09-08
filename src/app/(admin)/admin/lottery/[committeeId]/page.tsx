import { CommitteeLotteryAdmin } from '@/features/admin/lottery';

/**
 * Admin → Committee lottery management route (/admin/lottery/:committeeId).
 *
 * Protected by the (admin) layout. The committee id is read from the router
 * inside the CommitteeLotteryAdmin client component, which owns lottery
 * history display, eligibility checking, and lottery execution.
 */
export default function AdminCommitteeLotteryPage() {
  return <CommitteeLotteryAdmin />;
}
