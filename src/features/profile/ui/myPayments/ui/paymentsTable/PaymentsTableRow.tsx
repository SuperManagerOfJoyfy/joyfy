import { PaymentRecord } from '@/features/profile/api'
import { formatters } from '../../utils'

type PaymentsTableRowProps = {
  payment: PaymentRecord
}

export const PaymentsTableRow = ({ payment }: PaymentsTableRowProps) => (
  <tr>
    <td>{formatters.date(payment.dateOfPayment)}</td>
    <td>{formatters.date(payment.endDateOfSubscription)}</td>
    <td>{formatters.currency(payment.price)}</td>
    <td>{formatters.subscriptionType(payment.subscriptionType)}</td>
    <td>{formatters.paymentType(payment.paymentType)}</td>
  </tr>
)
