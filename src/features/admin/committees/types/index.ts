import type { Committee, CommitteeStatus } from '@/types';

/**
 * Admin committee-management types.
 *
 * Field names and shapes come straight from docs/api-documentation.md
 * (Committees section) — nothing is inferred or invented. `AdminCommittee`
 * extends the shared `Committee` with the nested `creator` that the admin
 * committee endpoints return.
 */

/** The committee creator, nested in admin committee responses. */
export interface CommitteeCreator {
  id: string;
  name: string;
  email: string;
}

/** A committee as returned by the admin endpoints (includes its creator). */
export type AdminCommittee = Committee & {
  creator?: CommitteeCreator;
};

/** Request body for POST /committees — documented create fields only. */
export interface CreateCommitteeInput {
  name: string;
  description?: string;
  contributionAmount: number;
  memberLimit: number;
  totalCycles: number;
  startDate: string;
  dueDay: number;
}

/** Args for PATCH /committees/:id — id plus a partial of the create body. */
export interface UpdateCommitteeInput extends Partial<CreateCommitteeInput> {
  id: string;
}

/** Args for PATCH /committees/:id/status. */
export interface UpdateCommitteeStatusInput {
  id: string;
  status: CommitteeStatus;
}

/** Query params for GET /committees. */
export interface ListCommitteesParams {
  status?: CommitteeStatus;
  page?: number;
  limit?: number;
}
