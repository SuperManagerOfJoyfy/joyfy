import type { Preview } from '@storybook/nextjs'
import '@/styles/globals.css'
import { themes } from 'storybook/theming'

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
      options: {
        light: { name: 'light', value: 'var(--color-light-100)' },
        dark: { name: 'dark', value: 'var(--color-dark-700)' },
        gray: { name: 'gray', value: 'var(--color-dark-100)' },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'dark',
    },
  },
}

export default preview
