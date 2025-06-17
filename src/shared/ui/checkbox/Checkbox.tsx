import * as CheckboxRadix from '@radix-ui/react-checkbox'
import { clsx } from 'clsx'
import { ComponentProps, ReactNode, useId } from 'react'
import { IoCheckmarkSharp } from 'react-icons/io5'

import s from './CheckBox.module.scss'

export type CheckboxProps = {
  label?: ReactNode
  checked?: boolean
  errorMessage?: string
  onCheckedChange?: (checked: boolean) => void
} & ComponentProps<typeof CheckboxRadix.Root>

export const Checkbox = ({
  label,
  className,
  checked,
  onCheckedChange,
  disabled,
  errorMessage,
  ...rest
}: CheckboxProps) => {
  const id = useId()
  const showError = !!errorMessage && errorMessage.length > 0

  return (
    <div className={clsx(s.main, className)} aria-disabled={disabled}>
      <CheckboxRadix.Root
        className={s.root}
        id={id}
        disabled={disabled}
        checked={checked} // ✅ Ensure controlled behavior
        onCheckedChange={onCheckedChange}
        {...rest}
      >
        <CheckboxRadix.Indicator className={s.indicator}>
          <IoCheckmarkSharp />
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>

      {label && (
        <label className={clsx(s.label)} htmlFor={id}>
          {label}
        </label>
      )}
      {showError && <p className={s.error}>{errorMessage}</p>}
    </div>
  )
}
