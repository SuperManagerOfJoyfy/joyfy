import { UserProfile } from '@/features/profile/api/profileApi.types'
import { ProfileInfo, ProfileInfoSchema } from '@/features/profile/utils/schema/ProfileInfoSchema'
import { Button, ControlledDatePicker, ControlledTextArea, ControlledTextField, Loader, Separator } from '@/shared/ui'
import { formatDateOfBirth } from '@/shared/utils/dateFunctions'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { CitySelect, CountrySelect } from './components'
import s from './ProfileInfoForm.module.scss'
import { useEffect, useMemo } from 'react'
import { useFormHasChanges } from './hooks/useFormHasChanges'

type Props = {
  userInfo?: UserProfile
  onSubmit: (data: ProfileInfo) => void
  isSubmitting: boolean
}

export const ProfileInfoForm = ({ userInfo, onSubmit, isSubmitting }: Props) => {
  const { aboutMe, userName, firstName, lastName, dateOfBirth, country, city } = userInfo || {}

  const initialValues = useMemo<ProfileInfo>(
    () => ({
      userName: userName || '',
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: formatDateOfBirth(dateOfBirth) || '',
      country: country || '',
      city: city || undefined,
      aboutMe: aboutMe || '',
    }),
    [userName, firstName, lastName, dateOfBirth, country, city, aboutMe]
  )

  const methods = useForm<ProfileInfo>({
    resolver: zodResolver(ProfileInfoSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues,
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = methods

  useEffect(() => {
    reset(initialValues)
  }, [reset, initialValues])

  const hasChanges = useFormHasChanges(control, initialValues)

  const formSubmitHandler = handleSubmit(onSubmit)

  const isSubmitDisabled = !isValid || !hasChanges || isSubmitting

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

        <Button type="submit" className={s.submitButton} form="profileForm" disabled={isSubmitDisabled}>
          {isSubmitting ? <Loader /> : 'Save changes'}
        </Button>
      </div>
    </FormProvider>
  )
}
