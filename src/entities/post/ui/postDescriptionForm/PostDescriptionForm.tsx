'use client'

import { ChangeEvent } from 'react'
import { Separator, TextArea, Typography, UserCard } from '@/shared/ui'
import { UserProfile } from '@/features/profile/api/profileApi.types'

import s from './PostDescriptionForm.module.scss'
import clsx from 'clsx'

type Props = {
  user: Pick<UserProfile, 'userName' | 'avatars' | 'id'>
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  className?: string
}

export const PostDescriptionForm = ({ user, value, onChange, disabled, className }: Props) => {
  return (
    <div className={clsx(s.formContainer, className)}>
      <UserCard user={user} className={s.userCard} />

      <TextArea
        label="Add publication description"
        placeholder="Your caption goes here..."
        value={value}
        onChange={onChange}
        maxLength={500}
        rows={4}
        disabled={disabled}
      />

      <div className={s.charCount}>
        <Typography variant="caption">{value.length}/500</Typography>
      </div>
    </div>
  )
}
