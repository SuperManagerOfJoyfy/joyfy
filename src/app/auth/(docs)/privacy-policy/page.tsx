import { InfoPage } from '@/entities/auth/InfoPage'
import { PrivacyPolicy } from '@/entities/auth/PrivacyPolicy'

const Page = () => {
  return (
    <InfoPage title="Privacy Policy">
      <PrivacyPolicy />
    </InfoPage>
  )
}

export default Page
