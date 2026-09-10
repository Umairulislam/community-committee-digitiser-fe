import { baseApi } from '@/api/baseApi';
import type { PaginatedResponse } from '@/types';
import type { ContributionReport, OutstandingReport, CycleReport, LotteryPayoutReport, MemberReport } from '../types';
import { reportRequest, type ReportArgs } from '../utils/reportRequest';

export const adminReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContributionReport: builder.query<{ data: ContributionReport[] }, Omit<ReportArgs, 'report'>>({
      query: (args) => reportRequest({ ...args, report: 'contributions' }),
      providesTags: ['Report', 'Contribution', 'Cycle'],
    }),
    getOutstandingReport: builder.query<PaginatedResponse<OutstandingReport>, Omit<ReportArgs, 'report'>>({
      query: (args) => reportRequest({ ...args, report: 'outstanding' }),
      providesTags: ['Report', 'Contribution', 'Member', 'Cycle'],
    }),
    getCycleReport: builder.query<{ data: CycleReport[] }, Omit<ReportArgs, 'report'>>({
      query: (args) => reportRequest({ ...args, report: 'cycles' }),
      providesTags: ['Report', 'Cycle', 'Contribution'],
    }),
    getLotteryPayoutReport: builder.query<{ data: LotteryPayoutReport[] }, Omit<ReportArgs, 'report'>>({
      query: (args) => reportRequest({ ...args, report: 'lottery-payouts' }),
      providesTags: ['Report', 'Cycle', 'Lottery', 'Payout', 'Member'],
    }),
    getMemberReport: builder.query<{ data: MemberReport[] }, Omit<ReportArgs, 'report'>>({
      query: (args) => reportRequest({ ...args, report: 'members' }),
      providesTags: ['Report', 'Member', 'Contribution', 'Payment', 'Lottery', 'Payout'],
    }),
    getReportCsv: builder.query<string, ReportArgs>({
      query: (args) => ({ ...reportRequest(args, true), responseHandler: async (response) => {
        if (response.ok && !response.headers.get('content-type')?.includes('text/csv')) throw new Error('Unexpected report format');
        return response.text();
      } }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetContributionReportQuery, useGetOutstandingReportQuery, useGetCycleReportQuery, useGetLotteryPayoutReportQuery, useGetMemberReportQuery, useLazyGetReportCsvQuery } = adminReportsApi;
