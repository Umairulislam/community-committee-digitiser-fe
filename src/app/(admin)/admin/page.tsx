import { AdminDashboard } from '@/features/admin/dashboard';

/**
 * Admin Dashboard route.
 *
 * The dashboard is client-composed from documented committee-scoped APIs
 * (there is no backend admin-dashboard aggregate endpoint). All data
 * fetching, composition, and loading / error / empty / success states live
 * in the `AdminDashboard` feature component; this route stays a thin server
 * boundary inside the protected admin shell.
 */
export default function AdminHomePage() {
  return <AdminDashboard />;
}
