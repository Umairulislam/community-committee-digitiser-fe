import { baseApi } from '@/api/baseApi';
import { clearUser } from '../authSlice';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

/**
 * Authentication API — login, register, logout, and session check.
 * Injected into the shared baseApi slice so it shares the same cache/store.
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Cached responses belong to the previous session, regardless of tag.
          dispatch(baseApi.util.resetApiState());
        } catch {
          // A failed login does not establish a new session.
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Registration also starts an authenticated session.
          dispatch(baseApi.util.resetApiState());
        } catch {
          // Preserve the current state when registration fails.
        }
      },
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearUser());
          dispatch(baseApi.util.resetApiState());
        } catch {
          // Do not assume the HTTP-only session cookie was cleared on failure.
        }
      },
    }),

    getMe: builder.query<import('@/types').User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
