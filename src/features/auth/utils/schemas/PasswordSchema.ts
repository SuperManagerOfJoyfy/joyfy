import { z } from 'zod'

export const PasswordSchema = z
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
  })
