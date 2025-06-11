import { Button, Card, RadioGroup, Typography } from '@/shared/ui'
import { PaypalIcon } from '@/shared/ui/icons/PaypalIcon'
import { StripeIcon } from '@/shared/ui/icons/StripeIcon'
import s from './businessSubscription.module.scss'
import { subscriptionOptions } from '@/features/profile/ui/management'
import { SubscriptionType } from '@/features/profile/api'

type Props = {
  subscription: string
  onChange: (val: SubscriptionType) => void
  current: boolean
  onOpenModal: () => void
  setPaymentType: (type: 'STRIPE' | 'PAYPAL') => void
}

export const BusinessSubscription = ({ subscription, onChange, current, onOpenModal, setPaymentType }: Props) => {
  const onOpenChange = (type: 'STRIPE' | 'PAYPAL') => {
    setPaymentType(type)
    onOpenModal()
  }

  return (
    <div>
      <Typography className={s.title} variant="h3">
        {current ? 'Change your subscription:' : 'Your subscription costs:'}
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
          aria-label="Pay with PayPal"
          onClick={() => onOpenChange('PAYPAL')}
        >
          <PaypalIcon />
        </Button>

        <span>Or</span>

        <Button
          variant={'secondary'}
          className={s.button}
          aria-label="Pay with Stripe"
          onClick={() => onOpenChange('STRIPE')}
        >
          <StripeIcon />
        </Button>
      </div>
    </div>
  )
}
