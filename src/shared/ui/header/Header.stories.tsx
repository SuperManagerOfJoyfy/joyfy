import type {Meta, StoryObj} from '@storybook/react';
import {Header} from "@/shared/ui/header/Header";

const meta = {
    component: Header,
    tags: ['autodocs'],
    title: 'Components/Tabs',
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = (args) => {
    <Header {...args} />
}