import { Avatar, Button } from '@/shared/ui'
import s from './ProfilePhoto.module.scss'
import { CreatePostModal } from '@/features/post/ui/createPost/createPostModal'
import { useGetUserProfileQuery } from '@/features/profile/api/profileApi'
import { useState } from 'react'

export const ProfilePhoto = () => {
  const [openAddPhotoModal, setOpenAddPhotoModal] = useState(false)
  const { data: userData, isLoading: isProfileLoading } = useGetUserProfileQuery()
  if (!userData) return null

  return (
    <div className={s.profilePhotoWrapper}>
      <Avatar size="large" />
      <Button
        variant="outline"
        onClick={() => {
          setOpenAddPhotoModal(true)
        }}
      >
        Add a Profile Photo
      </Button>
      <CreatePostModal flowType="avatar" open={openAddPhotoModal === true} onClose={() => {}} user={userData} />
    </div>
  )
}
