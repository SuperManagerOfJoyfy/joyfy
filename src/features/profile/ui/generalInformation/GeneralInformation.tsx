'use client'

import { useEffect } from 'react'

import { Button, Loader } from '@/shared/ui'
import { useProfileForm } from '@/features/profile/hooks'
import { useProfileData } from '@/features/profile/hooks'
import { ProfileFormFields } from './profileFormFields'

import s from './GeneralInformation.module.scss'

interface GeneralInformationProps {
  userId: number
}

export const GeneralInformation = ({ userId }: GeneralInformationProps) => {
  const { form, userProfile, isLoading, isUpdating, canSave, onSubmit, profileError } = useProfileForm({
    userId,
  })

  const { countries, cities, loading: locationsLoading, setSelectedCountry } = useProfileData()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  const currentCountry = watch('country')

  const handleCountryChange = (countryValue: string | null) => {
    if (countryValue && countryValue !== currentCountry) {
      setSelectedCountry(countryValue)
      setValue('city', '')
    }
  }

  useEffect(() => {
    if (userProfile?.country && !currentCountry) {
      setSelectedCountry(userProfile.country)
    }
  }, [userProfile?.country, currentCountry, setSelectedCountry])

  if (profileError) {
    return (
      <div className={s.errorContainer}>
        <p>Failed to load profile data</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!isLoading && !userProfile) {
    return (
      <div className={s.errorContainer}>
        <p>Profile not found or access denied</p>
      </div>
    )
  }

  const isFormDisabled = isLoading || isUpdating || locationsLoading

  return (
    <div className={s.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <ProfileFormFields
            control={control}
            errors={errors}
            countries={countries}
            cities={cities}
            disabled={isFormDisabled}
            onCountryChange={handleCountryChange}
          />

          <div className={s.submitSection}>
            <Button type="submit" disabled={!canSave || isFormDisabled} className={s.saveButton}>
              {isUpdating ? <Loader /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
