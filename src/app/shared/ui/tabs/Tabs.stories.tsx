import type { Meta, StoryObj } from '@storybook/react';
import Tabs from './Tabs';

const meta = {
  component: Tabs,
  tags: ['autodocs'],
  title: 'Components/Tabs',
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'tab1',

    tabs: [
      { title: 'SignIn', value: 'tab1' },
      { title: 'Register', value: 'tab2' },
      { title: 'Contact', value: 'tab3' },
    ],
  },
};

export const DisabledTab: Story = {
  args: {
    defaultValue: 'tab1',

    tabs: [
      { title: 'SignIn', value: 'tab1' },
      { title: 'Register', value: 'tab2' },
      { disabled: true, title: 'Contact', value: 'tab3' },
    ],
  },
};
