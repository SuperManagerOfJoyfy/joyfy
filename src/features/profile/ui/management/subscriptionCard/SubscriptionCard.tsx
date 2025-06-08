import { Card, Checkbox, Typography } from '@/shared/ui'
import s from './subscriptionCard.module.scss'

export const SubscriptionCard = () => {
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

            <Typography className={s.value} variant="body2" fontWeight="bold">
              12.02.2022
            </Typography>
          </div>

          <div>
            <Typography className={s.label} variant="body2">
              Next payment
            </Typography>

            <Typography className={s.value} variant="body2" fontWeight="bold">
              13.02.2022
            </Typography>
          </div>
        </div>
      </Card>

      <Checkbox className={s.checkbox} label="Auto-Renewal" />
    </div>
  )
}
