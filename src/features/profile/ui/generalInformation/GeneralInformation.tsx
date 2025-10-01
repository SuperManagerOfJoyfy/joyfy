'use client'
import { toast } from 'react-toastify'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/features/profile/api'
import { ProfileInfoForm } from './profileInfoForm'
import { ProfilePhoto } from '../profilePhoto/ui/ProfilePhoto'
import { ProfileInfo } from '@/features/profile/utils/schema'
import { toISOString } from '@/shared/utils/dateFunctions'
import { useTranslations } from 'next-intl'
import s from './GeneralInformation.module.scss'

export const GeneralInformation = () => {
  const t = useTranslations('messages.profile')
  const { data: userInfo } = useGetUserProfileQuery()
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation()

  const onSubmitProfileInfoForm = async (data: ProfileInfo) => {
    try {
      const isoDate = toISOString(data.dateOfBirth)
      await updateUserProfile({ ...data, dateOfBirth: isoDate }).unwrap()
      toast.success(t('settingsSuccess'))
    } catch (error) {
      toast.error(t('settingsError'))
    }
  }

  return (
    <div className={s.generalContainer}>
      <ProfilePhoto />
      <ProfileInfoForm userInfo={userInfo} onSubmit={onSubmitProfileInfoForm} isSubmitting={isLoading} />
    </div>
  )
}
