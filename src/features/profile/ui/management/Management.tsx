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
import {
  AccountType,
  CurrentSubscription,
  paymentsApi,
  PaymentType,
  SubscriptionType,
  useCreatePaymentMutation,
  useGetCurrentSubscriptionQuery,
} from '@/features/profile/api'
import { useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/app/store/store'
import { useLocale } from 'next-intl'

export const Management = () => {
  const [typeSubscription, setTypeSubscription] = useState<SubscriptionType>(SubscriptionType.DAY)
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.STRIPE)
  const [showModal, setShowModal] = useState(false)
  const [initialStep, setInitialStep] = useState<'success' | 'error' | undefined>()

  const searchParams = useSearchParams()
  const { data: currentSubscription } = useGetCurrentSubscriptionQuery()
  const [pay] = useCreatePaymentMutation()
  const dispatch = useAppDispatch()

  const locale = useLocale()

  const updateAccountType = (newType: AccountType) => {
    dispatch(
      paymentsApi.util.updateQueryData('getCurrentSubscription', undefined, (draft: CurrentSubscription) => {
        draft.accountType = newType
      })
    )
  }

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

  if (!currentSubscription) return null

  const areSubscriptions = !!currentSubscription.data.length

  const handlePay = async () => {
    try {
      const response = await pay({
        typeSubscription,
        paymentType,
        amount: price[typeSubscription],
        baseUrl: `http://localhost:3000/${locale}/settings?part=management`,
        // baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}//${locale}/settings?part=management&`,
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
        {areSubscriptions && (
          <SubscriptionCard subscription={currentSubscription} changeAccountType={updateAccountType} />
        )}
        <AccountTypeSelector value={currentSubscription.accountType} onChange={updateAccountType} />
        {currentSubscription.accountType === 'Business' && (
          <BusinessSubscription
            subscription={typeSubscription}
            onChange={setTypeSubscription}
            current={areSubscriptions}
            onOpenModal={() => setShowModal(true)}
            setPaymentType={setPaymentType}
          />
        )}
      </div>
    </>
  )
}
