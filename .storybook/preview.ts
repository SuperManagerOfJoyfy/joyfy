import type { Preview } from '@storybook/react'
import '../src/app/globals.css'
import { themes } from '@storybook/theming'

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
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
                { name: 'light', value: '#ffffff' },
                { name: 'dark', value: '#171717' },
                { name: 'gray', value: '#333333' },
            ],
        },
    },
}

export default preview
