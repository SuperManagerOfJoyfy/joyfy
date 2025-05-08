import { MotionProps } from 'framer-motion'

export const getOverlayAnimation = (opacity: number = 0.6): MotionProps => ({
  animate: 'open',
  exit: 'closed',
  initial: 'closed',
  transition: { duration: 0.3, ease: 'easeInOut' },
  variants: {
    closed: { opacity: 0 },
    open: { opacity },
  },
})

export const windowAnimation: MotionProps = {
  animate: 'open',
  exit: 'closed',
  initial: 'closed',
  transition: { duration: 0.3, ease: 'easeInOut' },
  variants: {
    closed: { opacity: 0, scale: 0.85, y: -20 },
    open: { opacity: 1, scale: 1, y: 0 },
  },
}
