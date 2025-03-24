import { FieldValues, UseControllerProps, useController } from 'react-hook-form'
import { Checkbox, CheckboxProps } from '../checkbox'

type Props<T extends FieldValues> = Omit<
  CheckboxProps,
  'checked' | 'disabled' | 'name' | 'onBlur' | 'onCheckedChange'
> &
  UseControllerProps<T>

export const ControlledCheckbox = <T extends FieldValues>({
  control,
  defaultValue,
  disabled,
  name,
  ...checkboxProps
}: Props<T>) => {
  const {
    field: { onChange, value, ...field },
  } = useController({ control, defaultValue, disabled, name })

  return (
    <Checkbox
      checked={value}
      onCheckedChange={onChange}
      {...checkboxProps}
      {...field}
    />
  )
}
