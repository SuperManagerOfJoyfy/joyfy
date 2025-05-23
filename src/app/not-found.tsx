'use client'

import Link from 'next/link'
import { Button, Typography } from '@/shared/ui'
import { PATH } from '@/shared/config/routes'

import s from '../styles/notFound.module.scss'

export default function NotFound() {
  return (
    <div className={s.container}>
      <svg width="0" height="0" className={s.svg}>
        <defs>
          <linearGradient id="notFoundGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a2be2" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      <div className={s.content}>
        <div className={s.svgContainer}>
          <svg viewBox="0 0 200 100" className={s.svgText}>
            <text x="50%" y="80" className={s.svgNumber} textAnchor="middle">
              404
            </text>
          </svg>
        </div>

        <Typography variant="h2" className={s.subtitle}>
          Page Not Found
        </Typography>

        <Typography className={s.description}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button as={Link} href={PATH.ROOT} className={s.button}>
          Go to Homepage
        </Button>
      </div>
    </div>
  )
}
