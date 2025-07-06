import { Card, Checkbox, Typography } from '@/shared/ui'
import s from './subscriptionCard.module.scss'
import {
  AccountType,
  CurrentSubscription,
  useCancelAutoRenewalMutation,
  useRenewAutoRenewalMutation,
} from '@/features/profile/api'
import { toast } from 'react-toastify'

type Props = {
  subscription: CurrentSubscription
  changeAccountType: (type: AccountType) => void
}

export const SubscriptionCard = ({ subscription, changeAccountType }: Props) => {
  const [cancelAutoRenewal] = useCancelAutoRenewalMutation()
  const [renewAutoRenewal] = useRenewAutoRenewalMutation()

  const onCheckedChangeHandler = async () => {
    if (subscription.hasAutoRenewal) {
      try {
        await cancelAutoRenewal()
        changeAccountType('Personal')
        toast.success('You successfully cancel auto renewal subscription!')
      } catch (error: any) {
        toast.error(error)
      }
    } else {
      try {
        await renewAutoRenewal()
        changeAccountType('Business')
        toast.success('You successfully renew auto renewal subscription!')
      } catch (error: any) {
        toast.error(error)
      }
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
