'use client'
import { toast } from 'react-toastify'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../api/profileApi'
import { ProfileInfo } from '../../utils/schema/ProfileInfoSchema'
import { ProfileInfoForm } from './profileInfoForm'
import { convertToISOString } from '@/shared/utils/dateFunctions'

export const GeneralInformation = () => {
  const { data: userInfo } = useGetUserProfileQuery()
  const [updateUserProfile, { isSuccess, isError, isLoading }] = useUpdateUserProfileMutation()

  const onSubmitProfileInfoForm = async (data: ProfileInfo) => {
    try {
      const isoDate = convertToISOString(data.dateOfBirth)
      await updateUserProfile({ ...data, dateOfBirth: isoDate }).unwrap()
      isSuccess && toast.success('Your settings are saved')
    } catch (error) {
      isError && toast.error('Error! Server is not available')
    }
  }

  return (
    <div>
      <ProfileInfoForm userInfo={userInfo} onSubmit={onSubmitProfileInfoForm} isSubmitting={isLoading} />
    </div>
  )
}
