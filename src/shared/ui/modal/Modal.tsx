'use client'

import { ComponentPropsWithoutRef, ComponentRef, CSSProperties, forwardRef, ReactElement, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

import { getOverlayAnimation, windowAnimation } from './ModalAnimations'
import { Card } from '../card'
import { Typography } from '@/shared/ui'
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
} & Omit<ComponentPropsWithoutRef<typeof Dialog.Root>, 'open' | 'onOpenChange'>

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
    leftButton,
    rightButton,
    cardPadding = 'default',
    ...rest
  } = props

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && preventClose) return
    onOpenChange?.(newOpen)
  }

  const hasTitle = Boolean(title)
  const hasLeft = Boolean(leftButton)
  const hasRight = Boolean(rightButton)
  const hasHeader = hasTitle || hasLeft || hasRight

  const wrapperClass = clsx(s.wrapper, hasHeader && s.withHeader)
  const contentClass = clsx(s.content, s[`size${size}`], className)
  const cardClass = clsx(s.card, s[`padding-${cardPadding}`])

  const titleClass = clsx(s.title, !hasLeft && hasRight && s.centered)

  return (
    <Dialog.Root {...rest} open={open} onOpenChange={handleOpenChange} modal>
      <Dialog.Portal forceMount>
        <AnimatePresence mode="wait">
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div {...getOverlayAnimation(overlayOpacity)} className={s.overlay} />
              </Dialog.Overlay>

              <div className={s.modal} ref={ref}>
                <Dialog.Content asChild forceMount>
                  <motion.div {...windowAnimation} className={contentClass} style={style}>
                    <div className={wrapperClass}>
                      <Card className={cardClass}>
                        {hasHeader ? (
                          <header className={s.header}>
                            {hasLeft && <div className={s.leftButton}>{leftButton}</div>}

                            <Dialog.Title asChild>
                              {hasTitle ? (
                                <Typography variant="h1" className={titleClass}>
                                  {title}
                                </Typography>
                              ) : (
                                <VisuallyHidden>Modal</VisuallyHidden>
                              )}
                            </Dialog.Title>

                            <div className={s.rightButton}>
                              {rightButton || (
                                <Dialog.Close className={s.closeButton} aria-label="Close">
                                  <IoClose size={24} />
                                </Dialog.Close>
                              )}
                            </div>
                          </header>
                        ) : (
                          <>
                            <Dialog.Title asChild>
                              <VisuallyHidden>Modal</VisuallyHidden>
                            </Dialog.Title>
                            <div className={s.noHeaderCloseButton}>
                              <Dialog.Close className={s.closeButton} aria-label="Close">
                                <IoClose size={24} />
                              </Dialog.Close>
                            </div>
                          </>
                        )}

                        {children}
                      </Card>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </div>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

Modal.displayName = 'Modal'
