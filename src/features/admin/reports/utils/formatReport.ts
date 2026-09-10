import { formatCurrency, formatDateTime } from '@/utils';

const MONEY_FIELDS = new Set(['contributionAmount', 'totalExpected', 'totalCollected', 'totalPaid', 'amount', 'payoutAmount', 'totalAmountContributed', 'totalAmountPaid', 'totalPayoutReceived']);
const DATE_FIELDS = new Set(['startDate', 'endDate', 'createdAt', 'dueDate', 'lotteryExecutedAt', 'payoutPaidAt', 'joinedAt']);

export function reportFieldLabel(key: string): string {
  const labels: Record<string, string> = {
    totalPaid: 'Paid contributions (amount)',
    totalAmountPaid: 'Verified payments (amount)',
    totalAmountContributed: 'Paid contributions (amount)',
    createdBy: 'Created by',
    collectionRatePercent: 'Collection rate',
  };
  return labels[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
}

/** Presentation only; totals and percentages are returned by the backend. */
export function formatReportValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return 'Not available';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value !== 'string' && typeof value !== 'number') return 'Not available';
  if (MONEY_FIELDS.has(key)) return formatCurrency(value);
  if (DATE_FIELDS.has(key)) return Number.isNaN(Date.parse(String(value))) ? 'Not available' : formatDateTime(String(value));
  if (key === 'collectionRatePercent') return `${value}%`;
  return String(value);
}
