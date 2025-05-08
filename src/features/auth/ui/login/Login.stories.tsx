import { Login } from './Login'
import type { Meta } from '@storybook/react'

const meta = {
  component: Login,
  tags: ['autodocs'],
  title: 'Features/Login',
} satisfies Meta<typeof Login>

export default meta

export const Default = {
  render: () => {
    return <Login onSubmit={console.log} isLoading={true} />
  },
}
