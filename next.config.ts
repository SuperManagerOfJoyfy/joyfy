import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['staging-it-incubator.s3.eu-central-1.amazonaws.com', 'storage.yandexcloud.net'],
  },
}

export default nextConfig
