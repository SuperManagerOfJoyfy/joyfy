import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { clsx } from 'clsx'

import s from './Typography.module.scss'

export type TypographyVariant =
  | 'large'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'caption2'
  | 'link1'
  | 'link2'

export type FontWeight = 'regular' | 'medium' | 'bold'

export interface TypographyProps<T extends ElementType = 'p'> {
  as?: T
  children?: ReactNode
  className?: string
  variant?: TypographyVariant
  fontWeight?: FontWeight
}

export function Typography<T extends ElementType = 'p'>({
  as,
  className,
  variant = 'body1',
  fontWeight,
  children,
  ...restProps
}: Omit<ComponentPropsWithoutRef<T>, keyof TypographyProps<T>> &
  TypographyProps<T>) {
  const Component = as || 'p'

  const classNames = clsx(
    s.text,
    s[variant],
    fontWeight && variant.startsWith('body') && s[`fw-${fontWeight}`],
    className
  )

  return (
    <Component className={classNames} {...restProps}>
      {children}
    </Component>
  )
}
