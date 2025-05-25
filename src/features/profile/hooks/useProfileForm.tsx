import { useEffect, useState, useMemo } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

import { ProfileFormData, profileSchema } from '../utils/ProfileSchema'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../api/profileApi'
import { UserProfile } from '../api/profileApi.types'

interface UseProfileFormProps {
  userId: number
}

export const useProfileForm = ({ userId: id }: UseProfileFormProps) => {
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)

  const { data: userProfile, isLoading: profileLoading, error: profileError } = useGetUserProfileQuery()

  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation()

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      city: '',
      aboutMe: '',
    },
  })

  const {
    reset,
    watch,
    setValue,
    formState: { isValid },
  } = form

  useEffect(() => {
    if (userProfile && !profileLoading) {
      const formData: ProfileFormData = {
        userName: userProfile.userName || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        country: userProfile.country || '',
        city: userProfile.city || '',
        aboutMe: userProfile.aboutMe || '',
      }

      reset(formData)
    }
  }, [userProfile, profileLoading, reset])

  const requiredFields = ['userName', 'firstName', 'lastName'] as const
  const allRequiredFieldsFilled = requiredFields.every((field) => {
    const value = watch(field)
    return value !== undefined && value !== '' && value?.trim() !== ''
  })

  const hasChanges = useMemo(() => {
    if (!userProfile) return false

    const currentData = watch()
    return Object.entries(currentData).some(([key, value]) => {
      const originalValue = userProfile[key as keyof UserProfile] || ''
      return value !== originalValue
    })
  }, [watch(), userProfile])

  const canSave = allRequiredFieldsFilled && isValid && !isUpdating

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      const updateData: Partial<UserProfile> = {
        id,
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth || '',
        country: data.country || '',
        city: data.city || '',
        aboutMe: data.aboutMe || '',
      }

      await updateProfile(updateData).unwrap()
      toast.success('Your settings are saved!')
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Error! Server is not available!')
    }
  }

  return {
    form,
    userProfile,
    profilePhoto,
    setProfilePhoto,
    isLoading: profileLoading,
    isUpdating,
    allRequiredFieldsFilled,
    hasChanges,
    canSave,
    onSubmit,
    profileError,
  }
}
