import { calculateAge, formatDateToString } from '@/shared/utils/dateFunctions'

import { z } from 'zod'

const NameSchema = z
  .string()
  .min(1, 'This field is required')
  .max(50, 'Maximum number of characters 50')
  .regex(/[A-Za-zА-Яа-я]/, { message: 'Invalid characters entered' })

export const ProfileInfoSchema = z.object({
  userName: z
    .string()
    .min(6, 'Minimum number of characters 6')
    .max(30, 'Maximum number of characters 30')
    .regex(/^[0-9A-Za-z_-]+$/, { message: 'Invalid characters entered' }),

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
          message: 'Date must be in format dd.mm.yyyy',
        })
        .refine((value) => calculateAge(value), {
          message: 'A user under 13 cannot create a profile. Privacy Policy',
        })
    )
    .optional(),

  country: z.string().optional(),
  city: z.string().optional(),
  aboutMe: z
    .string()
    .transform((val) => (val.trim() === '' ? undefined : val))
    .optional()
    .refine((val) => val === undefined || val.length <= 200, { message: 'About Me must be 200 characters or fewer.' }),
})

export type ProfileInfo = z.infer<typeof ProfileInfoSchema>
