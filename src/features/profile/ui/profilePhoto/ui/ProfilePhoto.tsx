import { Avatar, Button } from '@/shared/ui'
import s from './ProfilePhoto.module.scss'
import { CreatePostModal } from '@/features/post/ui/createPost/createPostModal'
import { useGetUserProfileQuery } from '@/features/profile/api/profileApi'
import { useState } from 'react'

export const ProfilePhoto = () => {
  const [openAddPhotoModal, setOpenAddPhotoModal] = useState(false)
  const { data: userData, isLoading: isProfileLoading } = useGetUserProfileQuery()
  if (!userData) return null
  const userAvatar = userData.avatars[0].url
  console.log(userData.avatars)

  return (
    <div className={s.profilePhotoWrapper}>
      <Avatar size="large" avatar={userAvatar} />
      <Button
        variant="outline"
        onClick={() => {
          setOpenAddPhotoModal(true)
        }}
      >
        Add a Profile Photo
      </Button>
      <CreatePostModal
        flowType="avatar"
        open={openAddPhotoModal === true}
        onClose={() => setOpenAddPhotoModal(false)}
        user={userData}
      />
    </div>
  )
}
