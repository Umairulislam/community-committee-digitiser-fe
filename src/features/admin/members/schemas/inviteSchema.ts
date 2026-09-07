import { z } from 'zod';

/**
 * Invitation form schema for POST /committees/:committeeId/invitations.
 *
 * Documented body: `email` (required, valid email) and `expiresAfterDays`
 * (optional integer >= 1, defaults to 7). The expiry is edited as text and
 * parsed on submit; leaving it blank omits the field so the backend applies its
 * 7-day default. Matches the project's existing `z.string().email()` idiom.
 */
export const inviteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  expiresAfterDays: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1),
      'Enter a whole number of days (1 or more), or leave blank for 7',
    ),
});

export type InviteFormData = z.infer<typeof inviteSchema>;
