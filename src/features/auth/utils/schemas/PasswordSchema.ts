import { z } from 'zod'

export const createPasswordSchema = (messages: {
  required: string
  minLength: string
  maxLength: string
  uppercase: string
  number: string
  specialChar: string
}) =>
  z
    .string()
    .min(1, messages.required)
    .min(6, messages.minLength)
    .max(20, messages.maxLength)
    .refine((password) => /[A-Z]/.test(password), {
      message: messages.uppercase,
    })
    .refine((password) => /[0-9]/.test(password), {
      message: messages.number,
    })
    .refine((password) => /[!\"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/.test(password), {
      message: messages.specialChar,
    })
