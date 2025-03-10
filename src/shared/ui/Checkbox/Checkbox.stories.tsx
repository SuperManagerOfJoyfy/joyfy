import type { Meta, StoryObj } from '@storybook/react'
import {Checkbox} from "@/shared/ui/Checkbox/Checkbox";



const meta = {
    component: Checkbox,
    tags: ['autodocs'],
    title: 'UI/Checkbox',
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { label: 'Check-box' },
}

export const WithoutText: Story = {
    args: { },
}

export const Disabled: Story = {
    args: {
        disabled: true,
        label: "Check-box"
    },
}