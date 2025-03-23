import * as CheckboxRadix from '@radix-ui/react-checkbox'
import { IoCheckmarkSharp } from 'react-icons/io5'
import s from './checkBox.module.scss'
import { ComponentProps, useId } from 'react'
import { clsx } from 'clsx'

type Props = {
  label?: string
  labelClassName?: string
} & ComponentProps<typeof CheckboxRadix.Root>

export const Checkbox = ({
  label,
  className,
  labelClassName,
  disabled,
  ...rest
}: Props) => {
  const id = useId()

  return (
    <div className={clsx(s.main, className)} aria-disabled={disabled}>
      <CheckboxRadix.Root
        className={s.root}
        id={id}
        disabled={disabled}
        {...rest}
      >
        <CheckboxRadix.Indicator className={s.indicator}>
          <IoCheckmarkSharp />
        </CheckboxRadix.Indicator>
      </CheckboxRadix.Root>

      {label && (
        <label className={clsx(s.label, labelClassName)} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  )
}
