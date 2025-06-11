'use client'

import s from './management.module.scss'
import { useEffect, useState } from 'react'
import {
  AccountTypeSelector,
  BusinessSubscription,
  PaymentModal,
  SubscriptionCard,
} from '@/features/profile/ui/management'
import { useCreatePaymentMutation, useGetMyPaymentsQuery } from '@/features/profile/api'
import { useSearchParams } from 'next/navigation'

export const Management = () => {
  const [type, setType] = useState('Personal')
  const [typeSubscription, setTypeSubscription] = useState<'MONTHLY' | 'DAY' | 'WEEKLY'>('DAY')
  const [paymentType, setPaymentType] = useState<'STRIPE' | 'PAYPAL'>('STRIPE')
  const [showModal, setShowModal] = useState(false)
  const [initialStep, setInitialStep] = useState<'success' | 'error' | undefined>()

  const searchParams = useSearchParams()
  const successParam = searchParams.get('?success')

  const { data: currentSubscription } = useGetMyPaymentsQuery()
  const [pay] = useCreatePaymentMutation()

  useEffect(() => {
    if (successParam === 'true') {
      setInitialStep('success')
      setShowModal(true)
    } else if (successParam === 'false') {
      setInitialStep('error')
      setShowModal(true)
    }
  }, [successParam])

  useEffect(() => {
    if (Array.isArray(currentSubscription) && currentSubscription?.length > 0) {
      setType('Business')
    }
  }, [currentSubscription])

  if (!currentSubscription) return null

  const subscriptions = currentSubscription.length > 0

  const handlePay = async () => {
    try {
      const response = await pay({
        typeSubscription,
        paymentType,
        amount: 0,
        baseUrl: 'http://localhost:3000/settings?part=management&',
        // baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings?part=management&`,
      }).unwrap()

      if (response?.url) {
        window.location.href = response.url
      } else {
        setInitialStep('error')
        setShowModal(true)
      }
    } catch (error) {
      setInitialStep('error')
      setShowModal(true)
    }
  }

  return (
    <>
      <PaymentModal open={showModal} onOpenChange={setShowModal} handleSubmit={handlePay} initialStep={initialStep} />
      <div className={s.management}>
        {subscriptions && <SubscriptionCard subscription={currentSubscription} />}
        <AccountTypeSelector value={type} onChange={setType} />
        {type === 'Business' && (
          <BusinessSubscription
            subscription={typeSubscription}
            onChange={setTypeSubscription}
            current={subscriptions}
            onOpenModal={() => setShowModal(true)}
            setPaymentType={setPaymentType}
          />
        )}
      </div>
    </>
  )
}
