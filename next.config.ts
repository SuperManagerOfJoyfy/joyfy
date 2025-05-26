import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging-it-incubator.s3.eu-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.yandexcloud.net',
      },
    ],
  },
}

export default nextConfig
