import { Card, Checkbox, Typography } from '@/shared/ui'
import s from './subscriptionCard.module.scss'
import { AccountType, CurrentSubscription, useCancelAutoRenewalMutation } from '@/features/profile/api'
import { toast } from 'react-toastify'

type Props = {
  subscription: CurrentSubscription
}

export const SubscriptionCard = ({ subscription }: Props) => {
  const [cancelSubscription] = useCancelAutoRenewalMutation()

  const onCheckedChangeHandler = async () => {
    try {
      await cancelSubscription()
      toast.success('Brawo!')
    } catch (error: any) {
      toast.error(error)
    }
  }

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

            {subscription.data.map(({ subscriptionId, endDateOfSubscription }) => (
              <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>
                {new Date(endDateOfSubscription).toLocaleDateString('pl-PL')}
              </Typography>
            ))}
          </div>

          <div>
            <Typography className={s.label} variant="body2">
              Next payment
            </Typography>

            {subscription.data.map(({ subscriptionId, dateOfPayment }) => (
              <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>
                {new Date(dateOfPayment).toLocaleDateString('pl-PL')}
              </Typography>
            ))}
          </div>
        </div>
      </Card>

      <Checkbox
        className={s.checkbox}
        label="Auto-Renewal"
        checked={subscription.hasAutoRenewal}
        onCheckedChange={onCheckedChangeHandler}
      />
    </div>
  )
}
