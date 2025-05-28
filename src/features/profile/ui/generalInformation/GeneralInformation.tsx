import { CreateProfileForm } from './createProfileForm'

import { ProfilePhoto } from '@/features/profile/ui/profilePhoto/ui/ProfilePhoto'

type GeneralInformationProps = {
  userId: number
}

export const GeneralInformation = ({ userId }: GeneralInformationProps) => {
  return (
    <div>
      <ProfilePhoto />
      <CreateProfileForm />
    </div>
  )
}
