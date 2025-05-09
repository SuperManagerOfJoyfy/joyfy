'use client'

import { ComponentPropsWithoutRef, ComponentRef, CSSProperties, forwardRef, ReactElement, ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

import { getOverlayAnimation, windowAnimation } from './ModalAnimations'
import { Card } from '../card'
import { Typography } from '../typography'
import s from './Modal.module.scss'

type ModalSize = 'sm' | 'md' | 'lg' | 'auto'
type CardPadding = 'default' | 'top-only' | 'none'

type ModalProps = {
  children?: ReactNode
  open: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  size?: ModalSize
  className?: string
  style?: CSSProperties
  overlayOpacity?: number
  preventClose?: boolean
  leftButton?: ReactElement | null
  rightButton?: ReactElement | null
  cardPadding?: CardPadding
} & Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Root>, 'open' | 'onOpenChange'>

export const Modal = forwardRef<ComponentRef<'div'>, ModalProps>((props, ref) => {
  const {
    children,
    open,
    onOpenChange,
    title,
    size = 'sm',
    className,
    style,
    overlayOpacity,
    preventClose = false,
    leftButton = null,
    rightButton = null,
    cardPadding = 'default',
    ...rest
  } = props

  const contentClass = clsx(s.content, s[`size${size}`], className)
  const overlayAnimation = getOverlayAnimation(overlayOpacity)
  const shouldCenterTitle = Boolean(leftButton)
  const shouldShowHeader = Boolean(title || leftButton || rightButton)

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && preventClose) return
    onOpenChange?.(newOpen)
  }

  return (
    <DialogPrimitive.Root {...rest} open={open} onOpenChange={handleOpenChange} modal>
      <DialogPrimitive.Portal forceMount>
        <AnimatePresence mode="wait">
          {open && (
            <>
              <DialogPrimitive.Overlay asChild>
                <motion.div {...overlayAnimation} className={s.overlay} />
              </DialogPrimitive.Overlay>

              <div className={s.modal} ref={ref}>
                <DialogPrimitive.Content asChild forceMount>
                  <motion.div {...windowAnimation} className={contentClass} style={style}>
                    <Card className={clsx(s.card, s[`padding-${cardPadding}`])}>
                      {shouldShowHeader ? (
                        <header className={s.header}>
                          {leftButton && <div className={s.leftButton}>{leftButton}</div>}

                          {title && (
                            <DialogPrimitive.Title asChild>
                              <Typography variant="h1" className={clsx(s.title, shouldCenterTitle && s.centered)}>
                                {title}
                              </Typography>
                            </DialogPrimitive.Title>
                          )}

                          <div className={s.rightButton}>
                            {rightButton || (
                              <DialogPrimitive.Close className={s.closeButton} aria-label="Close">
                                <IoClose size={24} />
                              </DialogPrimitive.Close>
                            )}
                          </div>
                        </header>
                      ) : (
                        <div className={s.noHeaderCloseButton}>
                          <DialogPrimitive.Close className={s.closeButton} aria-label="Close">
                            <IoClose size={24} />
                          </DialogPrimitive.Close>
                        </div>
                      )}

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
})

Modal.displayName = 'Modal'
