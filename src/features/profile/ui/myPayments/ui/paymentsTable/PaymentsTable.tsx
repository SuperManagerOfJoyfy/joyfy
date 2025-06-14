import { PaymentRecord } from '@/features/profile/api'
import { PaymentsTableRow } from './PaymentsTableRow'

import s from './PaymentsTable.module.scss'

type PaymentsTableProps = {
  payments: PaymentRecord[]
}

const TABLE_HEADERS = [
  'Date of Payment',
  'End date of subscription',
  'Price',
  'Subscription Type',
  'Payment Type',
] as const

export const PaymentsTable = ({ payments }: PaymentsTableProps) => (
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
