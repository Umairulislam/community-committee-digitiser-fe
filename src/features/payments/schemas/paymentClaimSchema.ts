import { z } from 'zod';

/**
 * Form values for recording a payment claim.
 * The amount is fixed by the contribution (the backend only accepts an amount
 * matching the contribution amount), so the user only enters the transaction
 * reference from their payment receipt.
 */
export const paymentClaimSchema = z.object({
  transactionReference: z
    .string()
    .trim()
    .min(1, 'Transaction reference is required'),
});

export type PaymentClaimFormData = z.infer<typeof paymentClaimSchema>;
