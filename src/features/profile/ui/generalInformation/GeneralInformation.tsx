import { CreateProfileForm } from './createProfileForm'

type GeneralInformationProps = {
  userId: number
}

export const GeneralInformation = ({ userId }: GeneralInformationProps) => {
  return (
    <div>
      <CreateProfileForm />
    </div>
  )
}
