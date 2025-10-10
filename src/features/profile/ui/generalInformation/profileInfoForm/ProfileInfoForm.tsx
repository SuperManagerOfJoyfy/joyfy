'use client'

import { UserProfile } from '@/features/profile/api/profileApi.types'
import { createProfileInfoSchema, ProfileInfo } from '@/features/profile/utils/schema/ProfileInfoSchema'
import { Button, ControlledDatePicker, ControlledTextArea, ControlledTextField, Loader, Separator } from '@/shared/ui'
import { formatDateToString } from '@/shared/utils/dateFunctions'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { CitySelect, CountrySelect } from './components'
import s from './ProfileInfoForm.module.scss'
import { useEffect, useMemo } from 'react'
import { useFormHasChanges } from './hooks/useFormHasChanges'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type Props = {
  userInfo?: UserProfile
  onSubmit: (data: ProfileInfo) => void
  isSubmitting: boolean
}

export const ProfileInfoForm = ({ userInfo, onSubmit, isSubmitting }: Props) => {
  const t = useTranslations('profileInfoForm')
  const tv = useTranslations('profileInfoForm.validation')

  const { aboutMe, userName, firstName, lastName, dateOfBirth, country, city } = userInfo || {}

  const initialValues = useMemo<ProfileInfo>(
    () => ({
      userName: userName || '',
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: formatDateToString(dateOfBirth ? new Date(dateOfBirth) : null),
      country: country || '',
      city: city || undefined,
      aboutMe: aboutMe || '',
    }),
    [userName, firstName, lastName, dateOfBirth, country, city, aboutMe]
  )

  const profileInfoSchema = useMemo(
    () =>
      createProfileInfoSchema({
        required: tv('required'),
        userName: {
          min: tv('userName.min'),
          max: tv('userName.max'),
          invalid: tv('userName.invalid'),
        },
        name: {
          max: tv('name.max'),
          invalid: tv('name.invalid'),
        },
        dateOfBirth: {
          format: tv('dateOfBirth.format'),
          age13: tv('dateOfBirth.age13'),
        },
        aboutMe: {
          maxLength: tv('aboutMe.maxLength'),
        },
      }),
    [tv]
  )

  const methods = useForm<ProfileInfo>({
    resolver: zodResolver(profileInfoSchema),
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

  const labelContent = (
    <>
      {t('labels.dateOfBirth')} <span className={s.asterisk}>*</span>
    </>
  )

  return (
    <FormProvider {...methods}>
      <div className={s.container}>
        <div className={s.contentWrapper}>
          <form className={s.formArea} id="profileForm" onSubmit={formSubmitHandler}>
            <ControlledTextField
              label={t('labels.username')}
              name="userName"
              control={control}
              disabled={isSubmitting}
              required
            />
            <ControlledTextField
              label={t('labels.firstName')}
              name="firstName"
              control={control}
              disabled={isSubmitting}
              required
            />
            <ControlledTextField
              label={t('labels.lastName')}
              name="lastName"
              control={control}
              disabled={isSubmitting}
              required
            />

            <div>
              <ControlledDatePicker label={labelContent} name="dateOfBirth" control={control} disabled={isSubmitting} />
              {errors.dateOfBirth && (
                <p className={s.error}>
                  {t.rich('errors.age13', {
                    privacyPolicy: (chunks) => <Link href="/auth/privacy-policy">{chunks}</Link>,
                  })}
                </p>
              )}
            </div>

            <div className={s.selectGroup}>
              <span>
                <label className={s.label}>{t('labels.country')}</label>
                <CountrySelect />
              </span>

              <span>
                <label className={s.label}>{t('labels.city')}</label>
                <CitySelect />
              </span>
            </div>

            <ControlledTextArea label={t('labels.aboutMe')} name="aboutMe" control={control} disabled={isSubmitting} />
          </form>
        </div>

        <div className={s.separator}>
          <Separator />
        </div>

        <Button type="submit" className={s.submitButton} form="profileForm" disabled={isSubmitDisabled}>
          {isSubmitting ? <Loader /> : t('buttons.save')}
        </Button>
      </div>
    </FormProvider>
  )
}
