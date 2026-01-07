import type { Preview } from '@storybook/react'
import '@/styles/globals.css'
import { themes } from '@storybook/theming'

const preview: Preview = {
  parameters: {
    // actions: { argTypesRegex: '^on[A-Z].*' },
    docs: {
      theme: themes.dark,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: 'var(--color-light-100)' },
        { name: 'dark', value: 'var(--color-dark-700)' },
        { name: 'gray', value: 'var(--color-dark-100)' },
      ],
    },
  },
}

export default preview
