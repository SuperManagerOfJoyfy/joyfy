import { z } from 'zod'

export const createEmailSchema = (messages: { required: string; email: string }) =>
  z.string().min(1, messages.required).email(messages.email)

export type EmailSchema = z.infer<ReturnType<typeof createEmailSchema>>
