'use client'
import { toast } from 'react-toastify'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/features/profile/api'
import { ProfileInfoForm } from './profileInfoForm'
import { ProfilePhoto } from '../profilePhoto/ui/ProfilePhoto'
import { ProfileInfo } from '@/features/profile/utils/schema'
import { convertToISOString } from '@/shared/utils/dateFunctions'
import { MESSAGES } from '@/shared/config/messages'
import s from './GeneralInformation.module.scss'

export const GeneralInformation = () => {
  const { data: userInfo } = useGetUserProfileQuery()
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation()

  const onSubmitProfileInfoForm = async (data: ProfileInfo) => {
    try {
      const isoDate = convertToISOString(data.dateOfBirth)
      await updateUserProfile({ ...data, dateOfBirth: isoDate }).unwrap()
      toast.success(MESSAGES.PROFILE.SETTINGS_SUCCESS)
    } catch (error) {
      toast.error(MESSAGES.PROFILE.SETTINGS_ERROR)
    }
  }

  return (
    <div className={s.generalContainer}>
      <ProfilePhoto />
      <ProfileInfoForm userInfo={userInfo} onSubmit={onSubmitProfileInfoForm} isSubmitting={isLoading} />
    </div>
  )
}
