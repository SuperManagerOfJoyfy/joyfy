import infoImg from '@/features/auth/assets/images/EmailVerification/confirm.png'
import { EmailVerification } from '@/features/auth/ui/emailVerification'
import { Link } from '@/i18n/navigation'
import { PATH } from '@/shared/config/routes'
import { Button } from '@/shared/ui'
import { getTranslations } from 'next-intl/server'

import s from './EmailConfirmation.module.scss'

export const EmailConfirmationSuccess = async () => {
  const t = await getTranslations('emailConfirmation')

  return (
    <EmailVerification title={t('successTitle')} description={t('successDescription')} imageSrc={infoImg}>
      <div className={s.confirmWrapper}>
        <Button as={Link} fullWidth href={PATH.AUTH.LOGIN}>
          {t('signInButton')}
        </Button>
      </div>
    </EmailVerification>
  )
}
