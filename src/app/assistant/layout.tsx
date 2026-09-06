'use client';

import { AppShell } from '@/components/layout/AppShell';

/**
 * AI Assistant layout with app bar and navigation.
 */
export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
