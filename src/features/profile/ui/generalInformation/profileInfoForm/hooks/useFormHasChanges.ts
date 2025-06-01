import { useFormState } from 'react-hook-form'
import { useMemo } from 'react'
import { Control } from 'react-hook-form'
import { ProfileInfo } from '@/features/profile/utils/schema/ProfileInfoSchema'

export const useFormHasChanges = (control: Control<ProfileInfo>, initial: Partial<ProfileInfo>) => {
  const { dirtyFields } = useFormState({ control })

  return useMemo(() => {
    return Object.keys(dirtyFields).some((key) => {
      const typedKey = key as keyof ProfileInfo
      return dirtyFields[typedKey] && initial[typedKey] !== undefined
    })
  }, [dirtyFields, initial])
}
