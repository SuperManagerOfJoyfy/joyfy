export const getNextPaymentDate = (dateOfPayment: string, type: 'DAILY' | 'WEEKLY' | 'MONTHLY') => {
  const date = new Date(dateOfPayment)

  switch (type) {
    case 'DAILY':
      date.setDate(date.getDate() + 1)
      break
    case 'WEEKLY':
      date.setDate(date.getDate() + 7)
      break
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1)
      break
  }

  return date
}
