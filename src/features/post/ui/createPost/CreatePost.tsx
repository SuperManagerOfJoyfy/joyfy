'use client'

import { usePathname, useSearchParams } from 'next/navigation'

import { CreatePostModal } from './createPostModal'
import { useGetUserProfileQuery } from '@/features/profile/api/profileApi'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { PATH } from '@/shared/config/routes'
import { useRouter } from '@/i18n/navigation'

export enum ECreatePostCloseModal {
  redirectToHome,
  redirectToProfile,
  default,
}

export const CreatePost = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const action = searchParams.get('action')
  const showCreateModal = action === 'create'

  const { data: me, isLoading: isMeLoading } = useGetMeQuery()

  const { data: userData, isLoading: isProfileLoading } = useGetUserProfileQuery(undefined, {
    skip: !me,
  })

  if (isMeLoading || (me && isProfileLoading)) return null
  if (!me || !showCreateModal || !userData) return null

  const handleCloseModal = (createPostCloseModal?: ECreatePostCloseModal) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('action')

    const updateCurrentUrl = () => {
      const newUrl = pathname + (newParams.toString() ? `?${newParams.toString()}` : '')
      window.history.replaceState(null, '', newUrl)
    }

    switch (createPostCloseModal) {
      case ECreatePostCloseModal.redirectToProfile:
        if (pathname === `${PATH.USER.PROFILE}/${userData.id}`) {
          updateCurrentUrl()
        } else {
          router.replace(`${PATH.USER.PROFILE}/${userData.id}`)
        }
        break
      case ECreatePostCloseModal.redirectToHome:
        router.push(PATH.ROOT, { scroll: false })
        break
      default:
        updateCurrentUrl()
        break
    }
  }

  return <CreatePostModal open={showCreateModal} onClose={handleCloseModal} user={userData} />
}
