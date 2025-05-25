import { Control, Controller, FieldErrors } from 'react-hook-form'

import { SelectBox, SelectItem } from '@/shared/ui'
import { ProfileFormData } from '@/features/profile/utils/ProfileSchema'

import s from '../ProfileFormFields.module.scss'

interface LocationFieldsProps {
  control: Control<ProfileFormData>
  errors: Pick<FieldErrors<ProfileFormData>, 'country' | 'city'>
  countries: Array<{ value: string; label: string }>
  cities: Array<{ value: string; label: string }>
  disabled?: boolean
  onCountryChange?: (countryValue: string | null) => void
}

const SelectField = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  options,
  error,
  searchable = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  disabled?: boolean
  options: Array<{ value: string; label: string }>
  error?: { message?: string }
  searchable?: boolean
}) => (
  <div className={s.fieldWrapper}>
    <label className={s.label}>{label}</label>
    <SelectBox
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      searchable={searchable}
      maxHeight="200px"
    >
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectBox>
    {error && <span className={s.errorMessage}>{error.message}</span>}
  </div>
)

export const LocationFields = ({
  control,
  errors,
  countries,
  cities,
  disabled,
  onCountryChange,
}: LocationFieldsProps) => (
  <div className={s.locationFields}>
    <Controller
      control={control}
      name="country"
      render={({ field }) => (
        <SelectField
          label="Select your country"
          value={field.value || ''}
          onChange={(val) => {
            field.onChange(val)
            onCountryChange?.(val)
          }}
          placeholder="Country"
          disabled={disabled}
          options={countries}
          error={errors.country}
          searchable={true}
        />
      )}
    />

    <Controller
      control={control}
      name="city"
      render={({ field }) => (
        <SelectField
          label="Select your city"
          value={field.value || ''}
          onChange={field.onChange}
          placeholder="City"
          disabled={disabled || cities.length === 0}
          options={cities}
          error={errors.city}
          searchable={true}
        />
      )}
    />
  </div>
)
