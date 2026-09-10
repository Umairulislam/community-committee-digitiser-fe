import { baseApi } from '@/api/baseApi';
import { clearUser, setUser } from '../authSlice';
import type { RootState } from '@/store';
import type { User } from '@/types';
import type { AuthResponse, LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types';

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

    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: ({ name, phone }) => ({
        url: '/auth/me',
        method: 'PATCH',
        body: { name, phone },
      }),
      async onQueryStarted(_arg, { dispatch, getState, queryFulfilled }) {
        const currentUserId = (getState() as RootState).auth.user?.id;
        try {
          const { data } = await queryFulfilled;
          // Do not restore a session that ended while the update was in flight.
          if ((getState() as RootState).auth.user?.id !== currentUserId || data.id !== currentUserId) return;
          dispatch(authApi.util.upsertQueryEntries([
            { endpointName: 'getMe', arg: undefined, value: data },
          ]));
          dispatch(setUser(data));
        } catch {
          // Keep the existing profile on failure; recheck an expired session below.
        }
      },
      invalidatesTags: (_result, error) => error?.status === 401 ? ['User'] : [],
    }),

    getMe: builder.query<User, void>({
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
  useUpdateProfileMutation,
} = authApi;
