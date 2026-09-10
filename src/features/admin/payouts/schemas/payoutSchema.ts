import { z } from 'zod';

export const payoutReferenceSchema = z.object({
  reference: z.string().max(255, 'Reference must be 255 characters or fewer.'),
});

export type PayoutReferenceValues = z.infer<typeof payoutReferenceSchema>;
