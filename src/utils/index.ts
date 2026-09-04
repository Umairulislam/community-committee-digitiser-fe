/**
 * Shared utility functions.
 * Keep business logic out of utils — only pure helpers belong here.
 */

/**
 * Format a numeric string (e.g. Prisma Decimal) as Pakistani Rupees.
 */
export function formatCurrency(amount: string | number): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format an ISO 8601 date string to a readable short date (e.g. "05 Sep 2026").
 */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));
}

/**
 * Format an ISO 8601 date string to include time (e.g. "05 Sep 2026, 2:30 PM").
 */
export function formatDateTime(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

/**
 * Derive initials (up to 2 characters) from a full name.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
