import { z } from 'zod'

const calculateAge = (birthDate: string): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

export const profileSchema = z.object({
  userName: z
    .string()
    .min(6, 'Username must be at least 6 characters')
    .max(30, 'Username must be no more than 30 characters')
    .regex(/^[0-9A-Za-z_-]+$/, 'Username can only contain letters, numbers, underscore and dash'),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be no more than 50 characters')
    .regex(/^[A-Za-zА-Яа-я]+$/, 'First name can only contain letters'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be no more than 50 characters')
    .regex(/^[A-Za-zА-Яа-я]+$/, 'Last name can only contain letters'),

  dateOfBirth: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true
        const age = calculateAge(date)
        return age >= 13
      },
      {
        message: 'A user under 13 cannot create a profile. Privacy Policy',
      }
    ),

  country: z.string().optional(),
  city: z.string().optional(),

  aboutMe: z.string().max(200, 'About me must be no more than 200 characters').optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
