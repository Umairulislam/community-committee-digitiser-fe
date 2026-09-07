import type { Metadata } from 'next';
import { AdminGuard } from '@/components/layout/admin/AdminGuard';
import { AdminShell } from '@/components/layout/admin/AdminShell';

export const metadata: Metadata = {
  title: {
    default: 'Admin · Kameti',
    template: '%s · Kameti Admin',
  },
  description: 'Community Committee Digitiser — administration panel',
};

/**
 * Protected admin layout.
 *
 * `proxy.ts` blocks unauthenticated requests to `/admin*` at the edge.
 * `AdminGuard` then enforces the `ADMIN` role on the client and renders
 * loading / unauthorised states, while `AdminShell` provides the shared
 * responsive sidebar + app bar chrome for every admin page.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
