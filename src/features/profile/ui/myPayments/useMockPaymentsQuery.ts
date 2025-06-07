import { useState, useEffect } from 'react'

export const useMockPaymentsQuery = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const mockPayments = [
    {
      userId: 1,
      subscriptionId: 'sub_1',
      dateOfPayment: '2024-12-12T10:00:00.000Z',
      endDateOfSubscription: '2025-01-12T10:00:00.000Z',
      price: 10,
      subscriptionType: 'DAILY' as const,
      paymentType: 'STRIPE' as const,
    },
    {
      userId: 1,
      subscriptionId: 'sub_2',
      dateOfPayment: '2024-12-11T10:00:00.000Z',
      endDateOfSubscription: '2024-12-18T10:00:00.000Z',
      price: 50,
      subscriptionType: 'WEEKLY' as const,
      paymentType: 'STRIPE' as const,
    },
    {
      userId: 1,
      subscriptionId: 'sub_3',
      dateOfPayment: '2024-12-10T10:00:00.000Z',
      endDateOfSubscription: '2025-01-10T10:00:00.000Z',
      price: 100,
      subscriptionType: 'MONTHLY' as const,
      paymentType: 'PAYPAL' as const,
    },
    ...Array.from({ length: 15 }, (_, i) => ({
      userId: 1,
      subscriptionId: `sub_${i + 4}`,
      dateOfPayment: `2024-11-${String(30 - i).padStart(2, '0')}T10:00:00.000Z`,
      endDateOfSubscription: `2024-12-${String(30 - i).padStart(2, '0')}T10:00:00.000Z`,
      price: [10, 50, 100][i % 3],
      subscriptionType: (['DAILY', 'WEEKLY', 'MONTHLY'] as const)[i % 3],
      paymentType: (['STRIPE', 'PAYPAL'] as const)[i % 2],
    })),
  ]

  return {
    data: mockPayments,
    isLoading,
    error: null,
  }
}
