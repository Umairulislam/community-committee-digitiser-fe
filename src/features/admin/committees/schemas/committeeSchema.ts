import { z } from 'zod';

/**
 * Create/edit committee form values.
 *
 * Numeric fields are captured as strings from native number inputs and
 * validated against the documented POST /committees constraints, then converted
 * to numbers when the request payload is built. The backend re-validates every
 * field and remains the source of truth — this schema only gives fast, clear
 * client-side feedback for the documented rules.
 *
 * Documented constraints:
 *   name              non-empty
 *   contributionAmount ≥ 1, max 2 decimal places
 *   memberLimit       integer ≥ 2
 *   totalCycles       integer ≥ 1
 *   startDate         ISO 8601 date
 *   dueDay            integer 1–31
 *   description       optional
 */
export const committeeSchema = z.object({
  name: z.string().trim().min(1, 'Committee name is required'),
  description: z.string().trim().optional(),
  contributionAmount: z
    .string()
    .trim()
    .min(1, 'Contribution amount is required')
    .refine(
      (value) => /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) >= 1,
      'Enter an amount of 1 or more, with at most 2 decimal places',
    ),
  memberLimit: z
    .string()
    .trim()
    .min(1, 'Member limit is required')
    .refine(
      (value) => /^\d+$/.test(value) && parseInt(value, 10) >= 2,
      'Enter a whole number of 2 or more',
    ),
  totalCycles: z
    .string()
    .trim()
    .min(1, 'Total cycles is required')
    .refine(
      (value) => /^\d+$/.test(value) && parseInt(value, 10) >= 1,
      'Enter a whole number of 1 or more',
    ),
  startDate: z.string().min(1, 'Start date is required'),
  dueDay: z
    .string()
    .trim()
    .min(1, 'Due day is required')
    .refine(
      (value) => /^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 31,
      'Enter a day between 1 and 31',
    ),
});

export type CommitteeFormData = z.infer<typeof committeeSchema>;
