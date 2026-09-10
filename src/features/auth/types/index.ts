import type { User } from '@/types';

/** Request body for POST /auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Request body for POST /auth/register */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

/** Supported fields for PATCH /auth/me. Null clears the phone. */
export interface UpdateProfileRequest {
  name?: string;
  phone?: string | null;
}

/** Response shape for login and register (201) */
export interface AuthResponse {
  message: string;
  user: User;
}

/** State shape for the auth slice */
export interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
}
