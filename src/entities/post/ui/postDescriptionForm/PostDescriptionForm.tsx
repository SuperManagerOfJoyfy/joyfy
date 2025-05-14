'use client'

import { ChangeEvent } from 'react'
import { Separator, TextArea, Typography, UserCard } from '@/shared/ui'
import { UserProfileProps } from '@/features/profile/ui/userProfile'

import s from './PostDescriptionForm.module.scss'

type Props = {
  user: Pick<UserProfileProps, 'userName' | 'avatars' | 'id'>
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
}

export const PostDescriptionForm = ({ user, value, onChange, disabled }: Props) => {
  return (
    <div className={s.formContainer}>
      <div className={s.descriptionWrapper}>
        <UserCard user={user} />
        <div className={s.typographyContainer}>
          <Typography variant="body2" fontWeight="regular" className={s.font}>
            Add publication descriptions
          </Typography>
          <TextArea
            placeholder="Text-area"
            value={value}
            onChange={onChange}
            maxLength={500}
            rows={4}
            disabled={disabled}
          />
        </div>
        <div className={s.charCount}>
          <Typography variant="caption">{value.length}/500</Typography>
        </div>
      </div>
      <Separator />
    </div>
  )
}
