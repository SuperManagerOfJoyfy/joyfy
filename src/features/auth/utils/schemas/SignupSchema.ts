import { z } from 'zod'
import { createEmailSchema } from './EmailSchema'
import { createPasswordSchema } from './PasswordSchema'

export const createSignupSchema = (messages: {
  required: string
  email: string
  password: {
    minLength: string
    maxLength: string
    uppercase: string
    number: string
    specialChar: string
  }
  userName: {
    min: string
    max: string
    invalid: string
  }
  agreeToTerms: string
  passwordsDoNotMatch: string
}) =>
  z
    .object({
      userName: z
        .string()
        .min(1, messages.required)
        .min(6, messages.userName.min)
        .max(30, messages.userName.max)
        .regex(/^[0-9A-Za-z_-]+$/, { message: messages.userName.invalid }),

      email: createEmailSchema({
        required: messages.required,
        email: messages.email,
      }),

      password: createPasswordSchema({
        required: messages.required,
        ...messages.password,
      }),

      passwordConfirmation: z.string({ required_error: messages.required }).min(1, { message: messages.required }),

      agreeToTerms: z.literal(true, {
        errorMap: () => ({ message: messages.agreeToTerms }),
      }),
    })
    .superRefine((data, ctx) => {
      if (!data.passwordConfirmation) {
        return
      }

      if (data.password !== data.passwordConfirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.passwordsDoNotMatch,
          path: ['passwordConfirmation'],
        })
      }
    })

export type SignupSchema = z.infer<ReturnType<typeof createSignupSchema>>
