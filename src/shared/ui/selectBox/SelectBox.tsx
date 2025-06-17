import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import s from './SelectBox.module.scss'
import { FiChevronDown } from 'react-icons/fi'
import clsx from 'clsx'

type SelectBoxProps = React.ComponentPropsWithoutRef<typeof Select.Root> & {
  placeholder?: string
  width?: string
  className?: string
}

const SelectBox = ({
  placeholder,
  disabled,
  width = 'auto',
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: SelectBoxProps) => (
  <Select.Root defaultValue={defaultValue} onValueChange={onValueChange} {...props}>
    <Select.Trigger
      style={{ width }}
      className={clsx(s.trigger, className)}
      aria-label={placeholder}
      disabled={disabled}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon className={s.icon}>
        <FiChevronDown />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className={s.content} position="popper" avoidCollisions>
        <Select.Viewport>{children}</Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
)

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className={clsx(s.item, className)} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
})
SelectItem.displayName = 'SelectItem'

export { SelectBox, SelectItem }
