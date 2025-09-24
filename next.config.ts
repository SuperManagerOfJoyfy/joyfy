import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    domains: ['staging-it-incubator.s3.eu-central-1.amazonaws.com', 'storage.yandexcloud.net'],
  },
}

export default withNextIntl(nextConfig)
