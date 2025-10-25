'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/app/store/store'
import { toast } from 'react-toastify'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { MeResponse } from '@/features/auth/api/authApi.types'
import { useGetUserProfileWithFollowersQuery } from '@/features/profile/api/profileApi'
import { UserProfileWithFollowers } from '@/features/profile/api/profileApi.types'
import { Post } from '@/features/post/types/postTypes'
import { UserProfileType } from '../ui'
import { postsApi, useDeletePostMutation, useEditPostMutation, useGetPostByIdQuery } from '@/features/post/api'
import { extractMessage, isFetchBaseQueryError } from '@/shared/utils/handleErrors/handleErrors'

export type ConfirmAction = 'delete' | 'cancelEdit' | null

type PostModalContextValue = {
  // State
  confirmAction: ConfirmAction
  setConfirmAction: (action: ConfirmAction) => void
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  hasFormChanges: boolean
  setHasFormChanges: (value: boolean) => void
  isUpdating: boolean

  // Data
  me: MeResponse | undefined
  currentPost: Post
  initialPost: Post
  postId: number
  isOwnPost: boolean
  isFollowing: boolean

  // Modal-specific actions
  handleEdit: () => void
  handleConfirmDelete: () => void
  handleDelete: () => Promise<void>
  handleModalClose: () => void
  handleCancelEdit: () => void
  handleConfirmAction: () => Promise<void>
  savePostChanges: (postId: number, description: string) => Promise<void>

  // Basic actions
  dismissModal: () => void
}

type PostModalProviderProps = {
  children: ReactNode
  initialPost: Post
  userProfile: UserProfileType
  manageUrl?: boolean
  onClose?: () => void
}

const PostModalContext = createContext<PostModalContextValue | null>(null)

export const usePostModalContext = () => {
  const context = useContext(PostModalContext)
  if (!context) throw new Error('PostModalContext must be used within PostModalProvider')
  return context
}

export const PostModalContextProvider = ({
  initialPost,
  userProfile,
  children,
  manageUrl = true,
  onClose,
}: PostModalProviderProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = manageUrl && searchParams.get('postId') ? Number(searchParams.get('postId')) : undefined
  const t = useTranslations('postEditForm')

  // State
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [hasFormChanges, setHasFormChanges] = useState(false)

  // Data fetching
  const { data: me } = useGetMeQuery()
  const { data: fetchedPost } = useGetPostByIdQuery(postId!, { skip: !postId, refetchOnMountOrArgChange: false })
  const [editPost, { isLoading: isUpdating }] = useEditPostMutation()
  const [deletePostMutation] = useDeletePostMutation()
  const { data: userWithFollowers = {} as UserProfileWithFollowers } = useGetUserProfileWithFollowersQuery(
    userProfile.userName
  )

  // Initialize post data in cache
  useEffect(() => {
    if (initialPost && !manageUrl) {
      dispatch(postsApi.util.upsertQueryData('getPostById', initialPost.id, initialPost))
    }
  }, [dispatch, initialPost, manageUrl])

  // Derived state
  const currentPost = fetchedPost || initialPost
  const currentPostId = currentPost.id
  const isOwnPost = currentPost?.ownerId === me?.userId
  const isFollowing = userWithFollowers.isFollowing

  // Basic actions
  const dismissModal = () => {
    if (manageUrl) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete('postId')
      router.push(`?${newParams.toString()}`, { scroll: false })
    } else if (onClose) {
      onClose()
    }
  }

  // Modal-specific actions
  const handleEdit = () => {
    setIsEditing(true)
  }

  const savePostChanges = async (postId: number, description: string) => {
    try {
      await editPost({ postId, description }).unwrap()

      toast.success(t('updateSuccess'))

      setIsEditing(false)
      setHasFormChanges(false)
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const message = extractMessage(error.data, 'Failed to update the post.')
        toast.error(message)
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred.')
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deletePostMutation({ postId: currentPostId || 0, userId: me?.userId || 0 })
      toast.success(t('deleteSuccess'))
      dismissModal() // Close modal after successful delete
    } catch (error) {
      toast.error(t('deleteError'))
    }
  }

  const handleConfirmDelete = () => {
    setConfirmAction('delete')
  }

  const handleModalClose = () => {
    if (isEditing && hasFormChanges) {
      setConfirmAction('cancelEdit')
    } else {
      dismissModal()
    }
  }

  const handleCancelEdit = () => {
    if (hasFormChanges) {
      setConfirmAction('cancelEdit')
    } else {
      setIsEditing(false)
    }
  }

  const handleConfirmAction = async () => {
    if (confirmAction === 'delete') {
      await handleDelete()
    } else if (confirmAction === 'cancelEdit') {
      setIsEditing(false)
      setHasFormChanges(false)
    }
    setConfirmAction(null)
  }

  const contextValue: PostModalContextValue = {
    // State
    confirmAction,
    setConfirmAction,
    isEditing,
    setIsEditing,
    hasFormChanges,
    setHasFormChanges,
    isUpdating,

    // Data
    me,
    currentPost,
    postId: currentPostId,
    isOwnPost,
    isFollowing,
    initialPost,

    // Modal-specific actions
    handleEdit,
    handleConfirmDelete,
    handleDelete,
    handleModalClose,
    handleCancelEdit,
    handleConfirmAction,
    savePostChanges,

    // Basic actions
    dismissModal,
  }

  return <PostModalContext.Provider value={contextValue}>{children}</PostModalContext.Provider>
}
