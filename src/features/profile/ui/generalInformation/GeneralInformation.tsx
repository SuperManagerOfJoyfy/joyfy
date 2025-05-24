import { ProfilePhoto } from '@/features/profile/ui/profilePhoto/ui/ProfilePhoto'

type GeneralInformationProps = {
  userId: number
}

export const GeneralInformation = ({ userId }: GeneralInformationProps) => {
  return (
    <div style={{ padding: '24px' }}>
      <ProfilePhoto />
    </div>
  )
}
