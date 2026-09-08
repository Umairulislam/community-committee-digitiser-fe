import { CyclesAdmin } from '@/features/admin/cycles';

/**
 * Admin → Cycles landing route (/admin/cycles).
 *
 * Protected by the (admin) layout (AdminGuard + AdminShell). Lists the
 * admin's committees and links each to its cycle & lottery management view.
 * All data fetching and interaction live in the CyclesAdmin client component.
 */
export default function AdminCyclesPage() {
  return <CyclesAdmin />;
}
