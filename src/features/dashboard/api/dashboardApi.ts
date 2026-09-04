import { baseApi } from '@/api/baseApi';
import type {
  MyCommitteeMembership,
  NotificationListResponse,
  PaginatedResponse,
  Payout,
  Cycle,
} from '@/types';

/** Query params for paginated list endpoints. */
interface PaginationParams {
  page?: number;
  limit?: number;
}

interface NotificationQueryParams extends PaginationParams {
  type?: string;
  read?: boolean;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List the authenticated user's committee memberships.
     * GET /committees/my-committees
     */
    getMyCommittees: builder.query<MyCommitteeMembership[], void>({
      query: () => '/committees/my-committees',
      providesTags: ['Committee'],
    }),

    /**
     * List the authenticated user's notifications.
     * GET /notifications
     */
    getNotifications: builder.query<NotificationListResponse, NotificationQueryParams>({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      providesTags: ['Notification'],
    }),

    /**
     * Get unread notification count.
     * GET /notifications/unread-count
     */
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),

    /**
     * List the authenticated user's payouts across all committees.
     * GET /my-payouts
     */
    getMyPayouts: builder.query<{ data: Payout[]; total: number }, PaginationParams>({
      query: (params) => ({
        url: '/my-payouts',
        params,
      }),
      providesTags: ['Payout'],
    }),

    /**
     * List cycles for a specific committee.
     * GET /committees/:committeeId/cycles
     */
    getCycles: builder.query<PaginatedResponse<Cycle>, { committeeId: string; status?: string }>({
      query: ({ committeeId, ...params }) => ({
        url: `/committees/${committeeId}/cycles`,
        params,
      }),
      providesTags: ['Cycle'],
    }),
  }),
});

export const {
  useGetMyCommitteesQuery,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useGetMyPayoutsQuery,
  useGetCyclesQuery,
} = dashboardApi;
