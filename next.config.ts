import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path' // Импортируем path

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Добавляем этот блок:
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'staging-it-incubator.s3.eu-central-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'storage.yandexcloud.net',
        pathname: '**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
