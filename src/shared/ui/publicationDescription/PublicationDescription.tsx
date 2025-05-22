import { ChangeEvent } from 'react'
import clsx from 'clsx'
import { TextArea, Typography } from '@/shared/ui'
import s from './PublicationDescription.module.scss'

type Props = {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  disabled?: boolean
  className?: string
}

export const PublicationDescription = ({ value, onChange, disabled, className }: Props) => {
  return (
    <div className={clsx(s.formContainer)}>
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
