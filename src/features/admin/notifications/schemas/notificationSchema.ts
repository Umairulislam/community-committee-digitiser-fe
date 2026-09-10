import { z } from 'zod';
import { reminderSchema } from '@/features/admin/contributions/schemas/reminderSchema';
import type { NotificationType } from '@/types';

export const NOTIFICATION_TYPES = [
  'COMMITTEE_INVITATION', 'COMMITTEE_STATUS_CHANGED', 'CYCLE_STARTED', 'CYCLE_COMPLETED',
  'CONTRIBUTION_REMINDER', 'CONTRIBUTION_OVERDUE', 'PAYMENT_VERIFIED', 'PAYMENT_REJECTED',
  'LOTTERY_COMPLETED', 'PAYOUT_COMPLETED', 'GENERAL',
] as const satisfies readonly NotificationType[];

export const notificationSchema = reminderSchema.extend({ type: z.enum(NOTIFICATION_TYPES) });
export type NotificationFormData = z.infer<typeof notificationSchema>;
