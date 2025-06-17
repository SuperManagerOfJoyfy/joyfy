import { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu } from './DropdownMenu'
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'

import { HiDotsHorizontal } from 'react-icons/hi'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'The alignment of the dropdown menu relative to the trigger',
      defaultValue: 'end',
    },
    sideOffset: {
      control: { type: 'number' },
      description: 'The distance between the dropdown and the trigger',
      defaultValue: 8,
    },
    trigger: {
      description: 'The element that triggers the dropdown',
    },
    children: {
      description: 'The content of the dropdown menu',
    },
  },
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

// Helper components for stories
const MenuItems = () => (
  <>
    <RadixDropdownMenu.Item>Edit</RadixDropdownMenu.Item>
    <RadixDropdownMenu.Item disabled>Duplicate</RadixDropdownMenu.Item>
    <RadixDropdownMenu.Item>Delete</RadixDropdownMenu.Item>
  </>
)

export const Default: Story = {
  args: {
    trigger: 'Open Menu',
    children: <MenuItems />,
  },
}

export const WithIconButton: Story = {
  args: {
    trigger: <HiDotsHorizontal aria-label="Open menu" />,
    children: <MenuItems />,
  },
}

export const AlignStart: Story = {
  args: {
    align: 'start',
    trigger: 'Open Menu (Start Aligned)',
    children: <MenuItems />,
  },
}
