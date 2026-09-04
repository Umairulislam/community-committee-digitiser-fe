import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be 100 characters or fewer'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    phone: z
      .string()
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
