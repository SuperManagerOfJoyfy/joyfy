'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useAppDispatch } from '@/app/store/store'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { MeResponse } from '@/features/auth/api/authApi.types'
import { postsApi, useEditPostMutation, useGetPostByIdQuery } from '@/features/post/api'
import { Post } from '@/features/post/types/postTypes'
import { usePostDropdownMenuActions } from '../hooks'
import { toast } from 'react-toastify'
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
  user: MeResponse | undefined
  currentPost: Post
  initialPost: Post
  postId: number
  isOwnPost: boolean
  isFollowing: boolean

  // Actions from dropdown
  handleEdit: () => void
  handleDelete: () => Promise<void>
  handleFollowToggle: () => void
  handleCopyLink: () => void

  // Modal-specific actions
  handleDeletePost: () => Promise<void>
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
  userId: number
}

const PostModalContext = createContext<PostModalContextValue | null>(null)

export const usePostModalContext = () => {
  const context = useContext(PostModalContext)
  if (!context) throw new Error('PostModalContext must be used within PostModalProvider')
  return context
}

export const PostModalContextProvider = ({ initialPost, userId, children }: PostModalProviderProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = Number(searchParams.get('postId'))

  // State
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [hasFormChanges, setHasFormChanges] = useState(false)
  const [skipQuery, setSkipQuery] = useState(true)

  // Data fetching
  const { data: user } = useGetMeQuery()
  const { data: post } = useGetPostByIdQuery(postId, { skip: skipQuery })
  const [editPost, { isLoading: isUpdating }] = useEditPostMutation()

  // Initialize post data in cache
  useEffect(() => {
    if (initialPost) {
      dispatch(postsApi.util.upsertQueryData('getPostById', initialPost.id, initialPost))
      setSkipQuery(false)
    }
  }, [dispatch, initialPost])

  // Derived state
  const currentPost = post || initialPost
  const isOwnPost = currentPost?.ownerId === user?.userId
  const isFollowing = false // TODO: Add condition

  // Basic actions
  const dismissModal = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('postId')
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

  // Dropdown actions
  const { handleEdit, handleDelete, handleFollowToggle, handleCopyLink } = usePostDropdownMenuActions({
    userId,
    postId: postId || 0,
    ownerId: currentPost?.ownerId ?? 0,
    isFollowing,
    setIsEditing,
  })

  // Modal-specific actions
  const handleDeletePost = async () => {
    await handleDelete()
    dismissModal()
  }

  const savePostChanges = async (postId: number, description: string) => {
    try {
      await editPost({ postId, description }).unwrap()

      toast.success('Post updated successfully!')

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
      await handleDeletePost()
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
    user,
    currentPost,
    postId,
    isOwnPost,
    isFollowing,
    initialPost,

    // Dropdown-menu actions
    handleEdit,
    handleDelete,
    handleFollowToggle,
    handleCopyLink,

    // Modal-specific actions
    handleDeletePost,
    handleModalClose,
    handleCancelEdit,
    handleConfirmAction,
    savePostChanges,

    // Basic actions
    dismissModal,
  }

  return <PostModalContext.Provider value={contextValue}>{children}</PostModalContext.Provider>
}
