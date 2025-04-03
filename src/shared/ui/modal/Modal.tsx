'use client'

import {
  ComponentPropsWithoutRef,
  ReactNode,
  CSSProperties,
  ComponentRef,
  forwardRef,
} from 'react'
import { IoClose } from 'react-icons/io5'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import clsx from 'clsx'
import { motion, AnimatePresence, MotionProps } from 'framer-motion'

import { Card } from '../card'
import s from './Modal.module.scss'
import { Typography } from '../typography'
import { getOverlayAnimation, windowAnimation } from './ModalAnimations'

export type ModalSize = 'sm' | 'md' | 'lg' | 'auto'

export type ModalProps = {
  children?: ReactNode
  onOpenChange?: (open: boolean) => void
  open: boolean
  title?: string
  size?: ModalSize
  className?: string
  style?: CSSProperties
  overlayOpacity?: number
} & Omit<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
  'onOpenChange' | 'open'
>

export const Modal = forwardRef<ComponentRef<'div'>, ModalProps>(
  (
    {
      children,
      title,
      size = 'sm',
      className,
      style,
      onOpenChange,
      open,
      overlayOpacity,
      ...props
    },
    ref
  ) => {
    const contentClasses = clsx(s.content, s[`size${size}`], className)

    const overlayAnimation = getOverlayAnimation(overlayOpacity)

    return (
      <DialogPrimitive.Root
        {...props}
        onOpenChange={onOpenChange}
        open={open}
        modal={true}
      >
        <DialogPrimitive.Portal forceMount>
          <AnimatePresence mode="wait">
            {open && (
              <>
                <DialogPrimitive.Overlay asChild>
                  <motion.div {...overlayAnimation} className={s.overlay} />
                </DialogPrimitive.Overlay>

                <div className={s.modal} ref={ref}>
                  <DialogPrimitive.Content asChild forceMount>
                    <motion.div
                      {...windowAnimation}
                      className={contentClasses}
                      style={style}
                    >
                      <Card className={s.card}>
                        <header className={s.header}>
                          <DialogPrimitive.Title asChild>
                            {title ? (
                              <Typography variant="h1" className={s.title}>
                                {title}
                              </Typography>
                            ) : (
                              <VisuallyHidden>Modal dialog</VisuallyHidden>
                            )}
                          </DialogPrimitive.Title>
                          <DialogPrimitive.Close
                            className={s.closeButton}
                            aria-label="Close"
                          >
                            <IoClose size={24} />
                          </DialogPrimitive.Close>
                        </header>
                        {children}
                      </Card>
                    </motion.div>
                  </DialogPrimitive.Content>
                </div>
              </>
            )}
          </AnimatePresence>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    )
  }
)

Modal.displayName = 'Modal'
