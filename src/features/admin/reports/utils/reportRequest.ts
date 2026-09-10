export const REPORTS = {
  summary: { label: 'Committee summary', filename: 'committee-summary.csv' },
  contributions: { label: 'Contributions & collections', filename: 'contribution-summary.csv' },
  outstanding: { label: 'Outstanding contributions', filename: 'outstanding-payments.csv' },
  cycles: { label: 'Cycle summary', filename: 'cycle-completion-summary.csv' },
  'lottery-payouts': { label: 'Lottery & payouts', filename: 'lottery-payout-summary.csv' },
  members: { label: 'Member participation', filename: 'member-participation-summary.csv' },
} as const;

export type ReportKind = keyof typeof REPORTS;
export interface ReportArgs {
  committeeId: string;
  report: ReportKind;
  cycleId?: string;
  status?: 'PENDING' | 'OVERDUE';
  page?: number;
  limit?: number;
}

/** JSON and CSV must use the same documented filter scope. */
export function reportRequest({ committeeId, report, cycleId, status, page = 1, limit = 50 }: ReportArgs, csv = false) {
  return {
    url: `/committees/${committeeId}/reports/${report}${csv ? '/csv' : ''}`,
    params: report === 'summary' ? undefined : report === 'outstanding'
      ? { cycleId, status, page, limit }
      : { cycleId },
  };
}
