'use client'

import { useTranslations } from 'next-intl'
import { PaymentRecord } from '@/features/profile/api'
import { PaymentsTableRow } from './PaymentsTableRow'
import s from './PaymentsTable.module.scss'

type PaymentsTableProps = {
  payments: PaymentRecord[]
}

export const PaymentsTable = ({ payments }: PaymentsTableProps) => {
  const t = useTranslations('paymentsTable.headers')

  const TABLE_HEADERS = [
    t('dateOfPayment'),
    t('endDateOfSubscription'),
    t('price'),
    t('subscriptionType'),
    t('paymentType'),
  ] as const

  return (
    <div className={s.tableContainer}>
      <table className={s.table}>
        <thead>
          <tr>
            {TABLE_HEADERS.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <PaymentsTableRow key={`${payment.subscriptionId}-${index}`} payment={payment} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
