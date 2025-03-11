import { SelectBox } from '@/shared/ui/selectBox/SelectBox';
import type { Meta, StoryObj } from '@storybook/react';


const meta: Meta<typeof SelectBox> = {
	title: 'Components/SelectBox',
	component: SelectBox,
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

export const Primary: Story = {
  args: {

  },
};

