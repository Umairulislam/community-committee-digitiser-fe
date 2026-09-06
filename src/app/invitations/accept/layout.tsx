'use client';

import { AppShell } from '@/components/layout/AppShell';

/**
 * Invitation route layout with app bar and navigation.
 */
export default function InvitationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
