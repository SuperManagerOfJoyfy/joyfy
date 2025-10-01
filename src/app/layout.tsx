import type { ReactNode } from 'react'

export const metadata = {
  title: 'Joyfy',
  description: 'Platform for sharing and discovering visual stories',
  icons: { icon: '/fav.svg' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
