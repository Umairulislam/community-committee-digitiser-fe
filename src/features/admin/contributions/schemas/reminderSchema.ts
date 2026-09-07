import { z } from 'zod';

/**
 * Notification types offered for the payment-reminder broadcast.
 *
 * The documented endpoint accepts any `NotificationType`, but only these three
 * make sense for a payment reminder. CONTRIBUTION_REMINDER is the default and
 * matches the "send payment reminder" admin workflow.
 */
export const REMINDER_TYPES = [
  'CONTRIBUTION_REMINDER',
  'CONTRIBUTION_OVERDUE',
  'GENERAL',
] as const;

export type ReminderType = (typeof REMINDER_TYPES)[number];

/**
 * Reminder form schema for POST /committees/:committeeId/notifications.
 *
 * Documented body constraints: `title` non-empty ≤ 255 chars, `message`
 * non-empty ≤ 2000 chars, `type` optional enum (defaults to GENERAL). The
 * backend re-validates every field; this schema only drives inline UX.
 */
export const reminderSchema = z.object({
  type: z.enum(REMINDER_TYPES),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or fewer'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(2000, 'Message must be 2000 characters or fewer'),
});

export type ReminderFormData = z.infer<typeof reminderSchema>;
