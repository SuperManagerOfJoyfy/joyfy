import { useWatch } from 'react-hook-form'
import { useMemo } from 'react'
import { Control } from 'react-hook-form'
import { ProfileInfo } from '@/features/profile/utils/schema/ProfileInfoSchema'

export const useFormHasChanges = (control: Control<ProfileInfo>, initial: ProfileInfo) => {
  const currentValues = useWatch({ control })

  return useMemo(() => {
    if (!currentValues) return false

    return Object.keys(initial).some((key) => {
      const typedKey = key as keyof ProfileInfo
      const currentValue = String(currentValues[typedKey] || '').trim()
      const initialValue = String(initial[typedKey] || '').trim()

      return currentValue !== initialValue
    })
  }, [currentValues, initial])
}
