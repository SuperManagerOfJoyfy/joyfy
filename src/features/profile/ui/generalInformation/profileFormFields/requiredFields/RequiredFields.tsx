import { Control, FieldErrors } from 'react-hook-form'

import { ControlledTextField } from '@/shared/ui/controlledComponents'
import { ProfileFormData } from '@/features/profile/utils/ProfileSchema'

import s from '../ProfileFormFields.module.scss'

interface RequiredFieldsProps {
  control: Control<ProfileFormData>
  errors: Pick<FieldErrors<ProfileFormData>, 'userName' | 'firstName' | 'lastName'>
  disabled?: boolean
}

const REQUIRED_FIELDS = [
  { name: 'userName', label: 'Username', type: 'text' },
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
] as const

export const RequiredFields = ({ control, errors, disabled }: RequiredFieldsProps) => (
  <div className={s.requiredFields}>
    {REQUIRED_FIELDS.map(({ name, label, type }) => (
      <ControlledTextField
        key={name}
        control={control}
        name={name}
        label={label}
        type={type}
        disabled={disabled}
        required
      />
    ))}
  </div>
)
