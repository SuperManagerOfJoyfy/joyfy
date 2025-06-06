import { ComponentProps, useId } from 'react'
import clsx from 'clsx'
import s from './textArea.module.scss'

export type TextAreaProps = {
  label?: string
  error?: string
  textAreaClassName?: string
} & ComponentProps<'textarea'>

export const TextArea = (props: TextAreaProps) => {
  const { label, error, className, textAreaClassName, ...rest } = props

  const id = useId()

  return (
    <div className={clsx(s.textAreaContainer, className)}>
      <label className={s.label} htmlFor={id} aria-disabled={rest.disabled}>
        {label}
      </label>

      <div className={clsx(s.wrapper, error && s.error, textAreaClassName)}>
        <textarea className={s.textArea} data-value={rest.value && 'true'} id={id} {...rest} />
      </div>

      <span className={s.errorText}>{error}</span>
    </div>
  )
}
