import { baseApi } from '@/api/baseApi';
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
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
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
