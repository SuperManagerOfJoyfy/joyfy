import { ToastContainer } from 'react-toastify'
import { ReduxProvider } from '../providers/ReduxProvider'
import { ReactNode } from 'react'
import '@/styles/globals.css'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <ReduxProvider>
          {children}
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  )
}
