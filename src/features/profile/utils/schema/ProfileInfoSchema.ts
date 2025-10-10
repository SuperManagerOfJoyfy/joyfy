import { calculateAge, formatDateToString } from '@/shared/utils/dateFunctions'
import { z } from 'zod'

type ProfileInfoSchemaMessages = {
  required: string
  userName: {
    min: string
    max: string
    invalid: string
  }
  name: {
    max: string
    invalid: string
  }
  dateOfBirth: {
    format: string
    age13: string
  }
  aboutMe: {
    maxLength: string
  }
}

export const createProfileInfoSchema = (messages: ProfileInfoSchemaMessages) => {
  const NameSchema = z
    .string()
    .min(1, { message: messages.required })
    .max(50, { message: messages.name.max })
    .regex(/[A-Za-zА-Яа-я]/, { message: messages.name.invalid })

  return z.object({
    userName: z
      .string()
      .min(6, { message: messages.userName.min })
      .max(30, { message: messages.userName.max })
      .regex(/^[0-9A-Za-z_-]+$/, { message: messages.userName.invalid }),

    firstName: NameSchema,
    lastName: NameSchema,

    dateOfBirth: z
      .preprocess(
        (val) => {
          if (val instanceof Date) {
            // Convert Date object to "dd.mm.yyyy"
            return formatDateToString(val)
          }
          if (typeof val === 'string' && val.trim() === '') {
            return undefined
          }
          return val
        },
        z
          .string()
          .regex(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/, {
            message: messages.dateOfBirth.format,
          })
          .refine((value) => calculateAge(value), {
            message: messages.dateOfBirth.age13,
          })
      )
      .optional(),

    country: z.string().optional(),
    city: z.string().optional(),
    aboutMe: z
      .string()
      .transform((val) => (val.trim() === '' ? undefined : val))
      .optional()
      .refine((val) => val === undefined || val.length <= 200, {
        message: messages.aboutMe.maxLength,
      }),
  })
}

export type ProfileInfoSchema = ReturnType<typeof createProfileInfoSchema>
export type ProfileInfo = z.infer<ProfileInfoSchema>
