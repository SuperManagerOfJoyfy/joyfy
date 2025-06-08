'use client'

import s from './management.module.scss'
import { useState } from 'react'
import {
  AccountTypeSelector,
  BusinessSubscription,
  PaymentModal,
  SubscriptionCard,
} from '@/features/profile/ui/management'

export const Management = () => {
  const [type, setType] = useState('Personal')
  const [subscription, setSubscription] = useState('10')
  const [showModal, setShowModal] = useState(false)

  const currentSubscription = true

  return (
    <>
      <PaymentModal open={showModal} onOpenChange={setShowModal} handleSubmit={() => console.log('handleSubmit')} />
      <div className={s.management}>
        {currentSubscription && <SubscriptionCard />}
        <AccountTypeSelector value={type} onChange={setType} />
        {type === 'Business' && (
          <BusinessSubscription
            subscription={subscription}
            onChange={setSubscription}
            current={currentSubscription}
            onOpenModal={() => setShowModal(true)}
          />
        )}
      </div>
    </>
  )
}
