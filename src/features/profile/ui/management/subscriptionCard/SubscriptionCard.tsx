'use client'

import { Card, Checkbox, Typography } from '@/shared/ui'
import s from './subscriptionCard.module.scss'
import {
  AccountType,
  CurrentSubscription,
  useCancelAutoRenewalMutation,
  useRenewAutoRenewalMutation,
} from '@/features/profile/api'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

type Props = {
  subscription: CurrentSubscription
  changeAccountType: (type: AccountType) => void
}

export const SubscriptionCard = ({ subscription, changeAccountType }: Props) => {
  const t = useTranslations('subscriptionCard')

  const [cancelAutoRenewal] = useCancelAutoRenewalMutation()
  const [renewAutoRenewal] = useRenewAutoRenewalMutation()

  const lastActive = subscription.data[subscription.data.length - 1]

  const onCheckedChangeHandler = async () => {
    if (subscription.hasAutoRenewal) {
      try {
        await cancelAutoRenewal()
        changeAccountType('Personal')
        toast.success(t('toast.cancel'))
      } catch (error: any) {
        toast.error(error)
      }
    } else {
      try {
        await renewAutoRenewal()
        changeAccountType('Business')
        toast.success(t('toast.renew'))
      } catch (error: any) {
        toast.error(error)
      }
    }
  }

  return (
    <div>
      <Typography className={s.title} variant="h3">
        {t('title')}
      </Typography>

      <Card className={s.card}>
        <div className={s.dateWrapper}>
          <div>
            <Typography className={s.label} variant="body2">
              {t('expire')}
            </Typography>

            <Typography className={s.value} variant="body2" fontWeight="bold">
              {new Date(lastActive.endDateOfSubscription).toLocaleDateString('pl-PL')}
            </Typography>
          </div>

          <div>
            <Typography className={s.label} variant="body2">
              {t('nextPayment')}
            </Typography>

            {subscription.hasAutoRenewal && (
              <Typography className={s.value} variant="body2" fontWeight="bold">
                {new Date(
                  new Date(lastActive.endDateOfSubscription).getTime() + 24 * 60 * 60 * 1000
                ).toLocaleDateString('pl-PL')}
              </Typography>
            )}
          </div>
        </div>
      </Card>

      <Checkbox
        className={s.checkbox}
        label={t('autoRenewal')}
        checked={subscription.hasAutoRenewal}
        onCheckedChange={onCheckedChangeHandler}
      />
    </div>
  )
}
