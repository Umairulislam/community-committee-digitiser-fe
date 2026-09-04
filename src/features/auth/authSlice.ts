import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';
import type { AuthState } from './types';

/**
 * Client-side auth state, synced with the RTK Query `getMe` response.
 * Keeps the user object accessible without re-querying the API cache.
 */
const initialState: AuthState = {
  user: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    clearUser(state) {
      state.user = null;
      state.status = 'unauthenticated';
    },
    setAuthLoading(state) {
      state.status = 'loading';
    },
  },
});

export const { setUser, clearUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
