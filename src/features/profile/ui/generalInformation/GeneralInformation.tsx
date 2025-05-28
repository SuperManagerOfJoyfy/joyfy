import { ProfilePhoto } from '@/features/profile/ui/profilePhoto/ui/ProfilePhoto'
import { CreateProfileForm } from './createProfileForm'
import s from './GeneralInformation.module.scss'

type GeneralInformationProps = {
  userId: number
}

export const GeneralInformation = ({ userId }: GeneralInformationProps) => {
  return (
    <div className={s.generalContainer}>
      <ProfilePhoto />
      <CreateProfileForm />
    </div>
  )
}
