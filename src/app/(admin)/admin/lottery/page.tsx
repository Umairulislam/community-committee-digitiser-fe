import { LotteryAdmin } from '@/features/admin/lottery';

/**
 * Admin → Lottery landing route (/admin/lottery).
 *
 * Protected by the (admin) layout (AdminGuard + AdminShell). Lists the
 * admin's committees and links each to its lottery management view.
 * All data fetching and interaction live in the LotteryAdmin client component.
 */
export default function AdminLotteryPage() {
  return <LotteryAdmin />;
}
