'use client'
import { convertToISOString } from '@/shared/utils/dateFunctions'
import { toast } from 'react-toastify'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../api/profileApi'
import { ProfileInfo } from '../../utils/schema/ProfileInfoSchema'
import { ProfilePhoto } from '../profilePhoto/ui/ProfilePhoto'
import s from './GeneralInformation.module.scss'
import { ProfileInfoForm } from './profileInfoForm'

export const GeneralInformation = () => {
  const { data: userInfo } = useGetUserProfileQuery()
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation()

  const onSubmitProfileInfoForm = async (data: ProfileInfo) => {
    try {
      const isoDate = convertToISOString(data.dateOfBirth)
      await updateUserProfile({ ...data, dateOfBirth: isoDate }).unwrap()
      toast.success('Your settings are saved')
    } catch (error) {
      toast.error('Error! Server is not available')
    }
  }

  return (
    <div className={s.generalContainer}>
      <ProfilePhoto />
      <ProfileInfoForm userInfo={userInfo} onSubmit={onSubmitProfileInfoForm} isSubmitting={isLoading} />
    </div>
  )
}
