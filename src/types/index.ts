/**
 * Shared application types.
 * Feature-specific types belong inside their own feature folder.
 * Only put types here when they are used across multiple features.
 */

/** User roles as defined by the backend. */
export type UserRole = 'USER' | 'ADMIN';

/** User account statuses as defined by the backend. */
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

/** Committee lifecycle statuses. */
export type CommitteeStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

/** Cycle statuses. */
export type CycleStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';

/** Contribution / payment statuses. */
export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE';

/** Payout statuses. */
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

/** Membership statuses. */
export type MemberStatus = 'ACTIVE' | 'REMOVED' | 'PENDING';

/** Payout methods — only LOTTERY is supported in the current product scope. */
export type PayoutMethod = 'LOTTERY';

/** Paginated response envelope returned by all list endpoints. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Error shape returned by the backend for all non-2xx responses. */
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

/** Safe user object returned by auth endpoints (no passwordHash). */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
