'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useRef, useMemo } from 'react'
import { UserProfile } from '@/features/profile/api/profileApi.types'
import { ProfileInfo, ProfileInfoSchema } from '@/features/profile/utils/schema/ProfileInfoSchema'

import { Button, ControlledDatePicker, ControlledTextArea, ControlledTextField, Separator, Loader } from '@/shared/ui'
import { CitySelect, CountrySelect } from './components'
import { formatDateOfBirth } from '@/shared/utils/dateFunctions'
import Link from 'next/link'
import s from './ProfileInfoForm.module.scss'
import { useFormHasChanges } from './hooks/useFormHasChanges'

type Props = {
  userInfo?: UserProfile
  onSubmit: (data: ProfileInfo) => void
  isSubmitting: boolean
}

export const ProfileInfoForm = ({ userInfo, onSubmit, isSubmitting }: Props) => {
  const { aboutMe, userName, firstName, lastName, dateOfBirth, country, city } = userInfo || {}

  const defaultValuesRef = useRef<ProfileInfo>({
    userName: userName || '',
    firstName: firstName || '',
    lastName: lastName || '',
    dateOfBirth: formatDateOfBirth(dateOfBirth) || '',
    country: country || '',
    city: city || '',
    aboutMe: aboutMe || '',
  })

  const methods = useForm<ProfileInfo>({
    resolver: zodResolver(ProfileInfoSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: defaultValuesRef.current,
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = methods

  useEffect(() => {
    reset(defaultValuesRef.current)
  }, [reset])

  const hasChanges = useFormHasChanges(control, defaultValuesRef.current)

  const formSubmitHandler = handleSubmit(onSubmit)

  return (
    <FormProvider {...methods}>
      <div className={s.container}>
        <div className={s.contentWrapper}>
          <form className={s.formArea} id="profileForm" onSubmit={formSubmitHandler}>
            <ControlledTextField label="Username" name="userName" control={control} disabled={isSubmitting} required />
            <ControlledTextField
              label="First Name"
              name="firstName"
              control={control}
              disabled={isSubmitting}
              required
            />
            <ControlledTextField label="Last Name" name="lastName" control={control} disabled={isSubmitting} required />
            <div>
              <ControlledDatePicker
                label="Date of Birth"
                name="dateOfBirth"
                control={control}
                disabled={isSubmitting}
              />
              {errors.dateOfBirth && (
                <p className={s.error}>
                  You must be at least 13 years old. See our <Link href="/auth/privacy-policy">Privacy Policy</Link>
                </p>
              )}
            </div>
            <div className={s.selectGroup}>
              <span>
                <label className={s.label}>Select your country</label>
                <CountrySelect />
              </span>
              <span>
                <label className={s.label}>Select your city</label>
                <CitySelect />
              </span>
            </div>
            <ControlledTextArea label="About Me" name="aboutMe" control={control} disabled={isSubmitting} />
          </form>
        </div>
        <div className={s.separator}>
          <Separator />
        </div>

        <Button
          type="submit"
          className={s.submitButton}
          form="profileForm"
          disabled={isSubmitting || !isValid || !hasChanges}
        >
          {isSubmitting ? <Loader /> : 'Save changes'}
        </Button>
      </div>
    </FormProvider>
  )
}
