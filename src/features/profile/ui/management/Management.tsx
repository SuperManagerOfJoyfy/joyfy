'use client'

import s from './management.module.scss'
import { useEffect, useState } from 'react'
import {
  AccountTypeSelector,
  BusinessSubscription,
  PaymentModal,
  price,
  SubscriptionCard,
} from '@/features/profile/ui/management'
import { PaymentType, SubscriptionType, useCreatePaymentMutation, useGetMyPaymentsQuery } from '@/features/profile/api'
import { useSearchParams } from 'next/navigation'

export const Management = () => {
  const [type, setType] = useState('Personal')
  const [typeSubscription, setTypeSubscription] = useState<SubscriptionType>(SubscriptionType.DAY)
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.STRIPE)
  const [showModal, setShowModal] = useState(false)
  const [initialStep, setInitialStep] = useState<'success' | 'error' | undefined>()

  const searchParams = useSearchParams()

  const { data: currentSubscription } = useGetMyPaymentsQuery()
  const [pay] = useCreatePaymentMutation()

  useEffect(() => {
    const successParam = searchParams.get('success')

    if (successParam === 'true') {
      setInitialStep('success')
      setShowModal(true)
    } else if (successParam === 'false') {
      setInitialStep('error')
      setShowModal(true)
    }

    if (successParam !== null) {
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  useEffect(() => {
    if (Array.isArray(currentSubscription) && currentSubscription?.length) {
      setType('Business')
    }
  }, [currentSubscription])

  if (!currentSubscription) return null

  const subscriptions = !!currentSubscription.length

  const handlePay = async () => {
    try {
      const response = await pay({
        typeSubscription,
        paymentType,
        amount: price[typeSubscription],
        baseUrl: 'http://localhost:3000/settings?part=management',
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
