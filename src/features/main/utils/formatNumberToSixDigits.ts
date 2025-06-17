export function formatNumberToSixDigits(num: number) {
  const formatted = num.toString().padStart(6, '0')
  return [...formatted]
}
