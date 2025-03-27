import { z } from 'zod'


export const SignupSchema = z
  .object({
    username: z
      .string()
      .min(6, 'Minimum number of characters 6')
      .max(30, 'Maximum number of characters 30')
      .regex(/^[0-9A-Za-z_-]+$/, { message: 'Invalid characters entered' }),

    email: z
      .string()
      .email('The email must match the format example@example.com'),

    password: z
      .string()
      .min(6, 'Minimum number of characters 6')
      .max(20, 'Maximum number of characters 20')
			.refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter.',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number.',
      })
      .refine((password) => /[!\"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/.test(password), {
        message: 'Password must contain at least one special character.',
      }),

    confirmPassword: z.string(),

    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms & Conditions' }),
    }),
  })
  .refine((arg) => arg.password === arg.confirmPassword, {
    message: 'Your passwords don’t match. Try again.',
    path: ['confirmPassword'],
  })

type SignupSchema = z.infer<typeof SignupSchema>
