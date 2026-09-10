import { baseApi } from '@/api/baseApi';
import type { AuditAction, AuditLog, PaginatedResponse } from '@/types';

export interface AuditLogsParams {
  committeeId: string;
  action?: AuditAction;
  entityType?: string;
  cycleId?: string;
  page?: number;
  limit?: number;
}

export const adminAuditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAuditLogs: builder.query<PaginatedResponse<AuditLog>, AuditLogsParams>({
      query: ({ committeeId, action, entityType, cycleId, page = 1, limit = 25 }) => ({
        url: `/committees/${committeeId}/audit-logs`,
        params: { action, entityType, cycleId, page, limit },
      }),
      providesTags: ['Audit'],
    }),
  }),
});

export const { useGetAdminAuditLogsQuery } = adminAuditApi;
