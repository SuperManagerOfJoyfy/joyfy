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

export interface TextProps<T extends ElementType = 'p'> {
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
  ...restProps
}: Omit<ComponentPropsWithoutRef<T>, keyof TextProps<T>> & TextProps<T>) {
  const isBody = variant === 'body1' || variant === 'body2'

  const classNames = clsx(
    s.text,
    s[variant],
    isBody && fontWeight && s[`fw-${fontWeight}`],
    className
  )

  const Component = as || 'p'

  return <Component className={classNames} {...restProps} />
}
