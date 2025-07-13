import { Button, Card, Typography } from '@/shared/ui'
import s from './Devices.module.scss'

export const Devices = () => {
  return (
    <div>
      <div>
        <Typography className={s.title} variant="h3">
          Current device
        </Typography>

        <Card className={s.card}>
          <div className={s.dateWrapper}>
            <div>
              <Typography className={s.label} variant="body2">
                Device Name
              </Typography>

              {/*{subscription.data.map(({ subscriptionId, endDateOfSubscription }) => (*/}
              {/*  <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>*/}
              {/*    {new Date(endDateOfSubscription).toLocaleDateString('pl-PL')}*/}
              {/*  </Typography>*/}
              {/*))}*/}
            </div>

            <div>
              <Typography className={s.label} variant="body2">
                IP
              </Typography>

              {/*{subscription.data.map(({ subscriptionId, dateOfPayment }) => (*/}
              {/*  <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>*/}
              {/*    {new Date(dateOfPayment).toLocaleDateString('pl-PL')}*/}
              {/*  </Typography>*/}
              {/*))}*/}
            </div>
          </div>
        </Card>
      </div>
      <div className={s.terminateButtonContainer}>
        <Button variant="outline">Terminate all other session</Button>
      </div>
      <div>
        <Typography className={s.title} variant="h3">
          Active sessions
        </Typography>

        <Card className={s.card}>
          <div className={s.dateWrapper}>
            <div>
              <Typography className={s.label} variant="body2">
                Device Name
              </Typography>

              {/*{subscription.data.map(({ subscriptionId, endDateOfSubscription }) => (*/}
              {/*  <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>*/}
              {/*    {new Date(endDateOfSubscription).toLocaleDateString('pl-PL')}*/}
              {/*  </Typography>*/}
              {/*))}*/}
            </div>

            <div>
              <Typography className={s.label} variant="caption2">
                IP: 22.345.345.12
              </Typography>

              {/*{subscription.data.map(({ subscriptionId, dateOfPayment }) => (*/}
              {/*  <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>*/}
              {/*    {new Date(dateOfPayment).toLocaleDateString('pl-PL')}*/}
              {/*  </Typography>*/}
              {/*))}*/}
            </div>
            <div>
              <Typography className={s.label} variant="caption">
                Last visit: 22.09.2022
              </Typography>

              {/*{subscription.data.map(({ subscriptionId, dateOfPayment }) => (*/}
              {/*  <Typography className={s.value} variant="body2" fontWeight="bold" key={subscriptionId}>*/}
              {/*    {new Date(dateOfPayment).toLocaleDateString('pl-PL')}*/}
              {/*  </Typography>*/}
              {/*))}*/}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
