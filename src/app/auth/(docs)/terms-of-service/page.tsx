import { InfoPage } from '@/entities/auth/InfoPage'
import { TermsAndServices } from '@/entities/auth/TermsAndServices'

const Page = () => {
  return (
    <InfoPage title="Terms of Service">
      <TermsAndServices />
    </InfoPage>
  )
}

export default Page
