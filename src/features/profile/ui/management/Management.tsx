'use client'

import s from './management.module.scss'
import { Button, Card, Checkbox, RadioGroup, Typography } from '@/shared/ui'
import { useState } from 'react'
import { PaypalIcon } from '../../../../../public/PaypalIcon'
import { StripeIcon } from '../../../../../public/StripeIcon'

export const Management = () => {
  const [type, setType] = useState('Personal')
  const [subscription, setSubscription] = useState('10')

  const typeOptions = [
    { label: 'Personal', value: 'Personal' },
    { label: 'Business', value: 'Business' },
  ]

  const subscriptionOptions = [
    { label: '$10 per 1 Day', value: '10' },
    { label: '$50 per 7 Day', value: '50' },
    { label: '$100 per month', value: '100' },
  ]

  const currentSubscription = true

  return (
    <div className={s.management}>
      {currentSubscription && (
        <>
          <Typography className={s.title} variant={'h3'}>
            Current Subscription:
          </Typography>

          <Card className={s.card}>
            <div className={s.dateWrapper}>
              <div>
                <Typography className={s.label} variant={'body2'}>
                  Expire at
                </Typography>

                <Typography className={s.value} variant={'body2'} fontWeight={'bold'}>
                  12.02.2022
                </Typography>
              </div>

              <div>
                <Typography className={s.label} variant={'body2'}>
                  Next payment
                </Typography>

                <Typography className={s.value} variant={'body2'} fontWeight={'bold'}>
                  13.02.2022
                </Typography>
              </div>
            </div>
          </Card>

          <Checkbox className={s.checkbox} label={'Auto-Renewal'} />
        </>
      )}

      <Typography className={s.title} variant={'h3'}>
        Account type:
      </Typography>

      <Card className={s.card}>
        <RadioGroup options={typeOptions} className={s.radioGroup} value={type} onValueChange={setType} />
      </Card>

      {type === 'Business' && (
        <>
          <Typography className={s.title} variant={'h3'}>
            {currentSubscription ? 'Change your subscription:' : 'Your subscription costs:'}
          </Typography>

          <Card className={s.card}>
            <RadioGroup
              options={subscriptionOptions}
              className={s.radioGroup}
              value={subscription}
              onValueChange={setSubscription}
            />
          </Card>

          <div className={s.buttons}>
            <Button className={s.button}>
              <PaypalIcon />
            </Button>

            <span>Or</span>

            <Button className={s.button}>
              <StripeIcon />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
