import { z } from 'zod'

export const EmailSchema = z.string().email('Email must match format example@example.com')

type EmailSchema = z.infer<typeof EmailSchema>

export const EmailFormSchema = z.object({
  email: EmailSchema,
})
