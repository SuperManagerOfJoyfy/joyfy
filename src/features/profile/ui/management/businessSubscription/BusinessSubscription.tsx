'use client'

import { Button, Card, RadioGroup, Typography } from '@/shared/ui'
import { PaypalIcon } from '@/shared/ui/icons/PaypalIcon'
import { StripeIcon } from '@/shared/ui/icons/StripeIcon'
import s from './businessSubscription.module.scss'
import { PaymentType, SubscriptionType } from '@/features/profile/api'
import { useTranslations } from 'next-intl'

type Props = {
  subscription: string
  onChange: (val: SubscriptionType) => void
  current: boolean
  onOpenModal: () => void
  setPaymentType: (type: PaymentType) => void
}

export const BusinessSubscription = ({ subscription, onChange, current, onOpenModal, setPaymentType }: Props) => {
  const t = useTranslations('businessSubscription')
  const tSub = useTranslations('settings.subscription')

  const subscriptionOptions = [
    { label: tSub('day'), value: 'DAY' },
    { label: tSub('weekly'), value: 'WEEKLY' },
    { label: tSub('monthly'), value: 'MONTHLY' },
  ]

  const onOpenChange = (type: PaymentType) => {
    setPaymentType(type)
    onOpenModal()
  }

  return (
    <div>
      <Typography className={s.title} variant="h3">
        {current ? t('change') : t('costs')}
      </Typography>

      <Card className={s.card}>
        <RadioGroup
          name="business-subscription"
          options={subscriptionOptions}
          className={s.radioGroup}
          value={subscription}
          onValueChange={onChange}
        />
      </Card>

      <div className={s.buttons}>
        <Button
          variant={'secondary'}
          className={s.button}
          aria-label={t('ariaPaypal')}
          onClick={() => onOpenChange(PaymentType.PAYPAL)}
        >
          <PaypalIcon />
        </Button>

        <span>{t('or')}</span>

        <Button
          variant={'secondary'}
          className={s.button}
          aria-label={t('ariaStripe')}
          onClick={() => onOpenChange(PaymentType.STRIPE)}
        >
          <StripeIcon />
        </Button>
      </div>
    </div>
  )
}
