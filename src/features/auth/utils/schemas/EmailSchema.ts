import { z } from 'zod'

export const EmailSchema = z.string().email('Email must match format example@example.com')
