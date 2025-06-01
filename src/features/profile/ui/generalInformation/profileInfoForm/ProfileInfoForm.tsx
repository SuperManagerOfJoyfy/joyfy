import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { UserProfile } from '@/features/profile/api/profileApi.types'
import { ProfileInfo, ProfileInfoSchema } from '@/features/profile/utils/schema/ProfileInfoSchema'
import { Avatar, Button, ControlledDatePicker, ControlledTextArea, ControlledTextField, Separator } from '@/shared/ui'
import { CitySelect, CountrySelect } from './components'
import { formatDateOfBirth } from '@/shared/utils/dateFunctions'
import s from './ProfileInfoForm.module.scss'
import Link from 'next/link'

type Props = {
  userInfo?: UserProfile
  onSubmit: (data: ProfileInfo) => void
  isSubmitting: boolean
}

export const ProfileInfoForm = ({ userInfo, onSubmit, isSubmitting }: Props) => {
  const { aboutMe, userName, firstName, lastName, dateOfBirth, country, city } = userInfo || {}

  const methods = useForm<ProfileInfo>({
    resolver: zodResolver(ProfileInfoSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      userName,
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: formatDateOfBirth(dateOfBirth) || '',
      country: country || '',
      city: city || '',
      aboutMe: aboutMe || '',
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods
  const formSubmitHandler = handleSubmit(onSubmit)

  return (
    <FormProvider {...methods}>
      <div className={s.container}>
        <div className={s.contentWrapper}>
          <div className={s.photoArea}>
            <Avatar size="large" />
            <Button>Add a Profile Photo</Button>
          </div>

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

        <Button type="submit" className={s.submitButton} form="profileForm" disabled={isSubmitting || !isValid}>
          Save changes
        </Button>
      </div>
    </FormProvider>
  )
}
