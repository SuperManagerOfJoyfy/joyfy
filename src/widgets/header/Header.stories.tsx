import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Header>

// Состояние без авторизации (показаны кнопки Log in и Sign up)

export const Unauthenticated: Story = {
  render: () => <Header />,
}

// Состояние после авторизации (показан колокольчик)
export const Authenticated: Story = {
  render: () => <Header />,
}
