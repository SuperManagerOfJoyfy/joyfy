'use client'

import { ComponentPropsWithoutRef, ComponentRef, CSSProperties, forwardRef, ReactElement, ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { IoClose } from 'react-icons/io5'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

import { getOverlayAnimation, windowAnimation } from './ModalAnimations'
import { Card } from '../card'
import { Typography } from '../typography'
import s from './Modal.module.scss'

type ModalSize = 'sm' | 'md' | 'lg' | 'auto'

type Props = {
  children?: ReactNode
  onOpenChange?: (open: boolean) => void
  open: boolean
  title?: string
  size?: ModalSize
  className?: string
  style?: CSSProperties
  overlayOpacity?: number
  preventClose?: boolean
  leftButton?: ReactElement | null
  rightButton?: ReactElement | null
} & Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Root>, 'onOpenChange' | 'open'>

export const Modal = forwardRef<ComponentRef<'div'>, Props>(
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
      preventClose = false,
      leftButton = null,
      rightButton = null,
      ...props
    },
    ref
  ) => {
    const contentClasses = clsx(s.content, s[`size${size}`], className)
    const overlayAnimation = getOverlayAnimation(overlayOpacity)

    const handleOpenChange = (newOpen: boolean) => {
      if (!newOpen && preventClose) return
      onOpenChange?.(newOpen)
    }

    const shouldCenterTitle = !!leftButton

    return (
      <DialogPrimitive.Root {...props} onOpenChange={handleOpenChange} open={open} modal>
        <DialogPrimitive.Portal forceMount>
          <AnimatePresence mode="wait">
            {open && (
              <>
                <DialogPrimitive.Overlay asChild>
                  <motion.div {...overlayAnimation} className={s.overlay} />
                </DialogPrimitive.Overlay>

                <div className={s.modal} ref={ref}>
                  <DialogPrimitive.Content asChild forceMount>
                    <motion.div {...windowAnimation} className={contentClasses} style={style}>
                      <Card className={s.card}>
                        <header className={s.header}>
                          {leftButton && <div className={s.leftButton}>{leftButton}</div>}

                          <DialogPrimitive.Title asChild>
                            {title ? (
                              <Typography variant="h1" className={clsx(s.title, shouldCenterTitle && s.centered)}>
                                {title}
                              </Typography>
                            ) : (
                              <VisuallyHidden>Modal dialog</VisuallyHidden>
                            )}
                          </DialogPrimitive.Title>

                          {rightButton ? (
                            <div className={s.rightButton}>{rightButton}</div>
                          ) : (
                            <DialogPrimitive.Close className={s.closeButton} aria-label="Close">
                              <IoClose size={24} />
                            </DialogPrimitive.Close>
                          )}
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
