'use client';

import { AppShell } from '@/components/layout/AppShell';

/**
 * Notifications layout with app bar and navigation.
 * Wraps the notifications page.
 */
export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
