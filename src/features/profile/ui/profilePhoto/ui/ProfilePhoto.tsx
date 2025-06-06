import { Button, ConfirmModal } from '@/shared/ui'
import s from './ProfilePhoto.module.scss'
import { useDeleteProfileAvatarMutation, useGetUserProfileQuery } from '@/features/profile/api/profileApi'
import { useState } from 'react'
import { IoImageOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { AvatarModal } from './avatarModal'

export const ProfilePhoto = () => {
  const [openAddPhotoModal, setOpenAddPhotoModal] = useState(false)
  const [confirmRemoveModalOpen, setConfirmRemoveModalOpen] = useState(false)
  const { data: userData, isLoading: isProfileLoading } = useGetUserProfileQuery()
  const [deleteProfileAvatar, { isLoading: isDeleteLoading }] = useDeleteProfileAvatarMutation()

  if (!userData) return null

  const userAvatar = userData.avatars[0]?.url

  const confirmRemoveAvatar = async () => {
    try {
      await deleteProfileAvatar().unwrap()
      toast.success('Avatar is successfully deleted')
    } catch (error) {}
  }

  return (
    <>
      <div className={s.profilePhotoWrapper}>
        <div className={s.avatarGroup}>
          {userAvatar ? (
            <>
              <Image src={userAvatar} width={204} height={204} className={s.avatar} alt="avatar" />
              <div className={s.removeButton}>
                <button disabled={isDeleteLoading} onClick={() => setConfirmRemoveModalOpen(true)}>
                  ✕
                </button>
              </div>
            </>
          ) : (
            <div className={s.avatarFallback} onClick={() => setOpenAddPhotoModal(true)}>
              <IoImageOutline size={48} />
            </div>
          )}
        </div>
        <Button disabled={isDeleteLoading} variant="outline" onClick={() => setOpenAddPhotoModal(true)}>
          Add a Profile Photo
        </Button>

        <AvatarModal open={openAddPhotoModal} onClose={() => setOpenAddPhotoModal(false)} />
      </div>

      <ConfirmModal
        title={'Delete Photo'}
        description={'Are you sure you want to delete the photo?'}
        isOpen={confirmRemoveModalOpen}
        setIsOpen={() => setConfirmRemoveModalOpen(false)}
        onConfirm={confirmRemoveAvatar}
      />
    </>
  )
}
