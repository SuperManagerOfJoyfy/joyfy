import { Control, FieldErrors } from 'react-hook-form'

import { ProfileFormData } from '@/features/profile/utils/ProfileSchema'

import { RequiredFields } from './requiredFields/RequiredFields'
import { DateOfBirthField } from './dateOfBirthField/DateOfBirthField'
import { LocationFields } from './locationFields/LocationFields'
import { AboutMeField } from './aboutMeField/AboutMeField'

import s from './ProfileFormFields.module.scss'

interface ProfileFormFieldsProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  countries: Array<{ value: string; label: string }>
  cities: Array<{ value: string; label: string }>
  disabled?: boolean
  onCountryChange?: (countryValue: string | null) => void
}

export const ProfileFormFields = ({
  control,
  errors,
  countries,
  cities,
  disabled = false,
  onCountryChange,
}: ProfileFormFieldsProps) => (
  <div className={s.container}>
    <RequiredFields control={control} errors={errors} disabled={disabled} />

    <div className={s.optionalFields}>
      <DateOfBirthField control={control} error={errors.dateOfBirth} disabled={disabled} />

      <LocationFields
        control={control}
        errors={errors}
        countries={countries}
        cities={cities}
        disabled={disabled}
        onCountryChange={onCountryChange}
      />

      <AboutMeField control={control} error={errors.aboutMe} disabled={disabled} />
    </div>
  </div>
)
