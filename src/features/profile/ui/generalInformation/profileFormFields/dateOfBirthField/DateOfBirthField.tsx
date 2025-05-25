import { Control, Controller, FieldError } from 'react-hook-form'
import { DatePicker } from '@/shared/ui'
import { ProfileFormData } from '@/features/profile/utils/ProfileSchema'
import s from '../ProfileFormFields.module.scss'

interface DateOfBirthFieldProps {
  control: Control<ProfileFormData>
  error?: FieldError
  disabled?: boolean
}

const DateOfBirthError = ({ error }: { error?: FieldError }) => {
  if (!error?.message) return null

  const isPrivacyError = error.message.includes('Privacy Policy')

  return (
    <span className={s.errorMessage}>
      {isPrivacyError ? (
        <>
          A user under 13 cannot create a profile.{' '}
          <a href="auth/privacy-policy" target="_blank" rel="noopener noreferrer" className={s.privacyLink}>
            Privacy Policy
          </a>
        </>
      ) : (
        error.message
      )}
    </span>
  )
}

export const DateOfBirthField = ({ control, error, disabled }: DateOfBirthFieldProps) => (
  <Controller
    control={control}
    name="dateOfBirth"
    render={({ field }) => (
      <div className={s.fieldWrapper}>
        <DatePicker
          startDate={field.value ? new Date(field.value) : null}
          onSetStartDate={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
          label="Date of birth"
          disabled={disabled}
          placeholder="DD/MM/YYYY"
          errorMessage={undefined}
        />
        <DateOfBirthError error={error} />
      </div>
    )}
  />
)
