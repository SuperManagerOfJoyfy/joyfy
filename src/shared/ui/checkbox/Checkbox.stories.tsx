import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@/shared/ui/checkbox/Checkbox'
import { useEffect, useState } from 'react'

const meta = {
  component: Checkbox,
  tags: ['autodocs'],
  title: 'Components/Checkbox',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [isChecked, setIsChecked] = useState(args.checked ?? false);

    useEffect(() => {
      setIsChecked(args.checked ?? false);
    }, [args.checked]);

    return (
      <Checkbox
        {...args}
        checked={isChecked}
        onCheckedChange={(checked) => setIsChecked(!!checked)}
      />
    );
  },
  args: {
    label: 'Check-box',
    checked: false,
    disabled: false,
  },
};

