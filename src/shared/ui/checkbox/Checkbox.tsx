import * as CheckboxRadix from '@radix-ui/react-checkbox'
import { IoCheckmarkSharp } from 'react-icons/io5'
import s from './checkBox.module.scss'
import { ComponentProps, useId } from 'react'

type Props = {
  label?: string
} & ComponentProps<typeof CheckboxRadix.Root>

export const Checkbox = ({ checked, onCheckedChange, label, disabled }: Props) => {
  const id = useId()

  return (
    <form>
      <div className={s.main} aria-disabled={disabled}>
        <CheckboxRadix.Root
          className={s.root}
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        >
          <CheckboxRadix.Indicator className={s.indicator}>
            <IoCheckmarkSharp />
          </CheckboxRadix.Indicator>
        </CheckboxRadix.Root>

        {label && (
          <label className={s.label} htmlFor={id}>
            {label}
          </label>
        )}
      </div>
    </form>
  )
}
