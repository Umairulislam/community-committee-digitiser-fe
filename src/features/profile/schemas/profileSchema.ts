import { z } from 'zod';
import type { User } from '@/types';
import type { UpdateProfileRequest } from '@/features/auth/types';

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
  phone: z.string().trim().max(32, 'Phone must be 32 characters or fewer'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function getProfileValues(user: User): ProfileFormData {
  return { name: user.name, phone: user.phone ?? '' };
}

/** Send only changed, supported fields; an empty phone explicitly clears it. */
export function getProfileChanges(values: ProfileFormData, user: User): UpdateProfileRequest {
  const body: UpdateProfileRequest = {};
  if (values.name !== user.name) body.name = values.name;
  const phone = values.phone || null;
  if (phone !== (user.phone ?? null)) body.phone = phone;
  return body;
}
