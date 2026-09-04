'use client';

import { useEffect } from 'react';
import { useGetMeQuery } from '../api/authApi';
import { setUser, clearUser, setAuthLoading } from '../authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

/**
 * Central authentication hook.
 *
 * On mount, calls `GET /auth/me` to check the session cookie.
 * Syncs the response into the Redux auth slice so the user object
 * is available synchronously throughout the app via `useAppSelector`.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);
  const { data, isLoading, isSuccess, isError, refetch } = useGetMeQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(setAuthLoading());
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearUser());
    }
  }, [isError, dispatch]);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    refetch,
  };
}
