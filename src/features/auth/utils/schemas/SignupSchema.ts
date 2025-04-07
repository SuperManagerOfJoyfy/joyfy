import { EmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import { PasswordSchema } from '@/features/auth/utils/schemas/PasswordSchema'
import { z } from 'zod'


export const SignupSchema = z
  .object({
    username: z
      .string()
      .min(6, 'Minimum number of characters 6')
      .max(30, 'Maximum number of characters 30')
      .regex(/^[0-9A-Za-z_-]+$/, { message: 'Invalid characters entered' }),

    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,

    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms & Conditions' }),
    }),
  })

  .refine((arg) => arg.password === arg.confirmPassword, {
    message: 'Your passwords don’t match. Try again.',
    path: ['confirmPassword'],
  })

type SignupSchema = z.infer<typeof SignupSchema>
