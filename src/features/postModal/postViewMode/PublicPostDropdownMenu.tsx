'use client'

import { useFollowUserByIdMutation, useUnfollowUserByIdMutation } from '@/features/profile/api'
import { DropdownMenu, DropdownMenuItem } from '@/shared/ui'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { BiCopy } from 'react-icons/bi'
import { HiDotsHorizontal } from 'react-icons/hi'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { toast } from 'react-toastify'

type PublicPostDropdownMenuProps = {
  postId: number
  ownerId: number
  isFollowing: boolean
}

export const PublicPostDropdownMenu = ({ postId, ownerId, isFollowing }: PublicPostDropdownMenuProps) => {
  const t = useTranslations('postEditForm.menu')

  const [open, setOpen] = useState(false)
  const [localFollowing, setLocalFollowing] = useState(isFollowing)

  useEffect(() => setLocalFollowing(isFollowing), [isFollowing])

  const [followById, { isLoading: isFollowingMut }] = useFollowUserByIdMutation()
  const [unfollow, { isLoading: isUnfollowingMut }] = useUnfollowUserByIdMutation()
  const isMutating = isFollowingMut || isUnfollowingMut

  const handleFollowToggle = async (e: Event) => {
    // keep menu open
    e.preventDefault()
    if (isMutating) return

    const next = !localFollowing
    setLocalFollowing(next) // optimistic UI

    try {
      if (next) await followById(ownerId).unwrap()
      else await unfollow(ownerId).unwrap()

      // let user see the new label briefly, then close
      //setTimeout(() => setOpen(false), 500)
    } catch (error) {
      setLocalFollowing(!next) // revert on error
      console.error('Follow action failed:', error)
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(url)
    toast.success(t('copySuccess'))
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} trigger={<HiDotsHorizontal />}>
      <DropdownMenuItem
        onSelect={handleFollowToggle}
        disabled={isMutating}
        aria-disabled={isMutating}
        style={{
          opacity: isMutating ? 0.6 : 1,
          pointerEvents: isMutating ? 'none' : 'auto',
        }}
      >
        {localFollowing ? (
          <span>
            <RiUserUnfollowLine /> {t('unfollow')}
          </span>
        ) : (
          <span>
            <RiUserFollowLine /> {t('follow')}
          </span>
        )}
      </DropdownMenuItem>

      <DropdownMenuItem onSelect={handleCopyLink}>
        <BiCopy /> {t('copyLink')}
      </DropdownMenuItem>
    </DropdownMenu>
  )
}
