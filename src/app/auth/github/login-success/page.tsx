'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const GithubCallback = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return <p>Loading..</p>
}

export default GithubCallback
