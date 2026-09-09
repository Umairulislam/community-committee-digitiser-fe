import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base RTK Query API slice.
 * All feature-specific API slices should inject their endpoints into this base
 * using `baseApi.injectEndpoints({ endpoints: (builder) => ({ ... }) })`.
 *
 * The backend delivers auth via an HTTP-only cookie named `jwt`, so
 * `credentials: 'include'` is required on every request — no Authorization header needed.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
  }),
  tagTypes: [
    'User',
    'Committee',
    'Member',
    'Invitation',
    'Cycle',
    'Contribution',
    'Payment',
    'Lottery',
    'Payout',
    'Notification',
    'Audit',
    'Report',
  ],
  endpoints: () => ({}),
});
