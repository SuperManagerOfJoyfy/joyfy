import { MotionProps } from 'framer-motion'

const overlay = {
  animate: 'open',
  exit: 'closed',
  initial: 'closed',
  transition: { duration: 0.3, ease: 'easeInOut' },
  variants: {
    closed: { opacity: 0 },
    open: { opacity: 0.6 },
  },
} satisfies MotionProps

const window = {
  animate: 'open',
  exit: 'closed',
  initial: 'closed',
  transition: { duration: 0.3, ease: 'easeInOut' },
  variants: {
    closed: { opacity: 0, scale: 0.85, y: -20 },
    open: { opacity: 1, scale: 1, y: 0 },
  },
} satisfies MotionProps

export const modalAnimations = { overlay, window }
