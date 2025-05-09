import { ComponentProps, useId } from 'react'
import clsx from 'clsx'
import s from './textArea.module.scss'

type Props = {
  label?: string
  error?: string
  className?: string
} & ComponentProps<'textarea'>

export const TextArea = ({ label, error, className, ...props }: Props) => {
  const id = useId()

  return (
    <div className={clsx(s.textAreaContainer, className)}>
      <label className={s.label} htmlFor={id} aria-disabled={props.disabled}>
        {label}
      </label>

      <div className={clsx(s.wrapper, error && s.error, className)}>
        <textarea className={clsx(s.textArea, className)} data-value={props.value && 'true'} id={id} {...props} />
      </div>

      <span className={s.errorText}>{error}</span>
    </div>
  )
}
