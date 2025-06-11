'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useAppDispatch } from '@/app/store/store'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { MeResponse } from '@/features/auth/api/authApi.types'
import { postsApi, useGetPostByIdQuery } from '@/features/post/api'
import { Post } from '@/features/post/types/postTypes'
import { usePostDropdownMenuActions } from '../hooks'

export type ConfirmAction = 'delete' | 'cancelEdit' | null

type PostModalContextValue = {
  // State
  confirmAction: ConfirmAction
  setConfirmAction: (action: ConfirmAction) => void
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  isInitPost: boolean
  setIsInitPost: (value: boolean) => void
  hasFormChanges: boolean
  setHasFormChanges: (value: boolean) => void

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
  handleEditSave: () => Promise<void>
  handleModalClose: () => void
  handleCancelEdit: () => void
  handleConfirmAction: () => Promise<void>

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
  const [isInitPost, setIsInitPost] = useState(true)
  const [hasFormChanges, setHasFormChanges] = useState(false)

  // Data fetching
  const { data: user } = useGetMeQuery()
  const { data: post, refetch } = useGetPostByIdQuery(postId)

  // Initialize post data in cache
  useEffect(() => {
    if (initialPost) {
      dispatch(postsApi.util.upsertQueryData('getPostById', initialPost.id, initialPost))
    }
  }, [dispatch, initialPost])

  // Derived state
  const currentPost = isInitPost ? initialPost : (post ?? initialPost)
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
    ownerId: post?.ownerId ?? 0,
    isFollowing,
    setIsEditing,
  })

  // Modal-specific actions
  const handleDeletePost = async () => {
    await handleDelete()
    dismissModal()
  }

  const handleEditSave = async () => {
    await refetch()
    setIsInitPost(false)
    setIsEditing(false)
    setHasFormChanges(false)
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
    isInitPost,
    setIsInitPost,
    hasFormChanges,
    setHasFormChanges,

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
    handleEditSave,
    handleModalClose,
    handleCancelEdit,
    handleConfirmAction,

    // Basic actions
    dismissModal,
  }

  return <PostModalContext.Provider value={contextValue}>{children}</PostModalContext.Provider>
}
