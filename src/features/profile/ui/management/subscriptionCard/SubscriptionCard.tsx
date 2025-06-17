import { Card, Checkbox, Typography } from '@/shared/ui'
import s from './subscriptionCard.module.scss'
import { PaymentRecord } from '@/features/profile/api'
import { getNextPaymentDate } from './dateUtils'

type Props = {
  subscription: PaymentRecord[]
}

export const SubscriptionCard = ({ subscription }: Props) => {
  return (
    <div>
      <Typography className={s.title} variant="h3">
        Current Subscription:
      </Typography>

      <Card className={s.card}>
        <div className={s.dateWrapper}>
          <div>
            <Typography className={s.label} variant="body2">
              Expire at
            </Typography>

            {subscription.map(({ subscriptionId, endDateOfSubscription }) => (
              <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>
                {new Date(endDateOfSubscription).toLocaleDateString('pl-PL')}
              </Typography>
            ))}
          </div>

          <div>
            <Typography className={s.label} variant="body2">
              Next payment
            </Typography>

            {subscription.map(({ subscriptionId, dateOfPayment, subscriptionType }) => {
              const nextPayment = getNextPaymentDate(dateOfPayment, subscriptionType)

              return (
                <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>
                  {nextPayment.toLocaleDateString('pl-PL')}
                </Typography>
              )
            })}
          </div>
        </div>
      </Card>

      <Checkbox className={s.checkbox} label="Auto-Renewal" />
    </div>
  )
}
