import { Button, Card, RadioGroup, Typography } from '@/shared/ui'
import { PaypalIcon } from '@/shared/ui/icons/PaypalIcon'
import { StripeIcon } from '@/shared/ui/icons/StripeIcon'
import s from './businessSubscription.module.scss'
import { subscriptionOptions } from '@/features/profile/ui/management'

type Props = {
  subscription: string
  onChange: (val: string) => void
  current: boolean
}

export const BusinessSubscription = ({ subscription, onChange, current }: Props) => {
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
        <Button variant={'secondary'} className={s.button} aria-label="Pay with PayPal">
          <PaypalIcon />
        </Button>

        <span>Or</span>

        <Button variant={'secondary'} className={s.button} aria-label="Pay with Stripe">
          <StripeIcon />
        </Button>
      </div>
    </div>
  )
}
