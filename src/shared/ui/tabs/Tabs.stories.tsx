import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'

const meta = {
  component: Tabs,
  tags: ['autodocs'],
  title: 'Components/Tabs',
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 'tab1',

    tabs: [
      { title: 'Tab', value: 'tab1' },
      { title: 'Tab', value: 'tab2' },
      { title: 'Tab', value: 'tab3', disabled: true },
    ],
  },
}
