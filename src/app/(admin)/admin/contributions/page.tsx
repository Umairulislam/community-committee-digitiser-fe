import { ContributionsAdmin } from '@/features/admin/contributions';

/**
 * Admin → Contributions & Payments landing route (`/admin/contributions`).
 *
 * Protected by the `(admin)` layout (AdminGuard + AdminShell). Contributions,
 * payments, and reminders are committee-scoped in the documented API, so this
 * page lists the admin's committees and links to each committee's contribution
 * & payment management view. All data fetching and interaction live in the
 * `ContributionsAdmin` client component.
 */
export default function AdminContributionsPage() {
  return <ContributionsAdmin />;
}
