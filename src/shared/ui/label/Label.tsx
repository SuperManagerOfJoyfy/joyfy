import * as LabelRadixUI from '@radix-ui/react-label'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import s from './Label.module.scss'

type Props = {
  label?: ReactNode
  disabled?: boolean
} & ComponentPropsWithoutRef<'label'>

export const Label = ({ children, label, className, disabled, ...rest }: Props) => {
  const classNames = {
    label: clsx(s.label, className, disabled && s.disabled),
  }

  return (
    <LabelRadixUI.Root {...rest}>
      {label && <div className={classNames.label}>{label}</div>}
      {children}
    </LabelRadixUI.Root>
  )
}
