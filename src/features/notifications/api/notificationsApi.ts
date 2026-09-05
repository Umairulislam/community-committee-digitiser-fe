import { baseApi } from '@/api/baseApi';
import type { Notification, NotificationListResponse } from '@/types';

/** Query params for the notifications list endpoint. */
export interface NotificationQueryParams {
  type?: string;
  read?: boolean;
  page?: number;
  limit?: number;
}

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * List the authenticated user's notifications, newest first.
     * The response's unreadCount counts ALL unread notifications,
     * ignoring the filters.
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
     * Count the authenticated user's unread notifications.
     * GET /notifications/unread-count
     */
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),

    /**
     * Mark one of the authenticated user's notifications as read.
     * PATCH /notifications/:id/read
     */
    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    /**
     * Mark all of the authenticated user's notifications as read.
     * PATCH /notifications/read-all
     */
    markAllNotificationsRead: builder.mutation<{ count: number }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
