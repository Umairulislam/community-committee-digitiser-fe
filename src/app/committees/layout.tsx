'use client';

import { AppShell } from '@/components/layout/AppShell';

/**
 * Committees layout with app bar and navigation.
 * Wraps all committee pages.
 */
export default function CommitteesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
