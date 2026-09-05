import { baseApi } from '@/api/baseApi';
import type { AuditLog } from '@/types';

export const timelineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * The committee's full audit history in chronological order (oldest first).
     * Read-only — audit entries are immutable and created only by the backend.
     * GET /committees/:committeeId/audit-logs/timeline
     */
    getAuditTimeline: builder.query<
      { data: AuditLog[]; total: number },
      { committeeId: string }
    >({
      query: ({ committeeId }) => `/committees/${committeeId}/audit-logs/timeline`,
      providesTags: ['Audit'],
    }),
  }),
});

export const { useGetAuditTimelineQuery } = timelineApi;
