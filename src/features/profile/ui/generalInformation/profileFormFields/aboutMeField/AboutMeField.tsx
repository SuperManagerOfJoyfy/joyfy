import { Control, Controller, FieldError } from 'react-hook-form'

import { TextArea } from '@/shared/ui'
import { ProfileFormData } from '@/features/profile/utils/ProfileSchema'

import s from '../ProfileFormFields.module.scss'

interface AboutMeFieldProps {
  control: Control<ProfileFormData>
  error?: FieldError
  disabled?: boolean
}

export const AboutMeField = ({ control, error, disabled }: AboutMeFieldProps) => (
  <Controller
    control={control}
    name="aboutMe"
    render={({ field }) => (
      <div className={s.fieldWrapper}>
        <TextArea
          {...field}
          label="About Me"
          placeholder="Tell us about yourself"
          rows={4}
          maxLength={200}
          disabled={disabled}
          value={field.value || ''}
        />
        <div className={s.charCount}>{(field.value || '').length}/200</div>
        {error && <span className={s.errorMessage}>{error.message}</span>}
      </div>
    )}
  />
)
