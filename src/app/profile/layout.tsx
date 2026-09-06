'use client';

import { AppShell } from '@/components/layout/AppShell';

/**
 * Profile layout with app bar and navigation.
 * Wraps the profile page.
 */
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
