import { FieldValues, UseControllerProps, useController } from 'react-hook-form'
import { Checkbox, CheckboxProps } from '../checkbox'
import s from './controlledCheckbox.module.scss'

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
    fieldState: { error },
  } = useController({ control, defaultValue, disabled, name })

  return (
    <div>
      <Checkbox
        checked={!!value}
        onCheckedChange={onChange}
        {...checkboxProps}
        {...field}
      />
      {error && <span className={s.error}>{error.message}</span>}
    </div>
  )
}
