import { formatters } from '../utils/formatters'
import { PaymentRecord } from '@/features/profile/api'

import s from '../MyPayments.module.scss'

type PaymentsTableProps = {
  payments: PaymentRecord[]
}

export const PaymentsTable = ({ payments }: PaymentsTableProps) => (
  <div className={s.tableContainer}>
    <table className={s.table}>
      <thead>
        <tr>
          <th>Date of Payment</th>
          <th>End date of subscription</th>
          <th>Price</th>
          <th>Subscription Type</th>
          <th>Payment Type</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((payment, index) => (
          <tr key={`${payment.subscriptionId}-${index}`}>
            <td>{formatters.date(payment.dateOfPayment)}</td>
            <td>{formatters.date(payment.endDateOfSubscription)}</td>
            <td>{formatters.currency(payment.price)}</td>
            <td>{formatters.subscriptionType(payment.subscriptionType)}</td>
            <td>{formatters.paymentType(payment.paymentType)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
