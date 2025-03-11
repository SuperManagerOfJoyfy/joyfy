import {
	Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select/Select';
import type { Meta, StoryObj } from '@storybook/react';


const meta: Meta<typeof Select> = {
	title: 'Components/Select',
	component: Select,
	argTypes: {

	}
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  args: {
		children: (
			<>
		 <SelectTrigger >
	    <SelectValue placeholder="Theme" />
	  	</SelectTrigger>
	  	<SelectContent>
	    <SelectItem value="light">Light</SelectItem>
	    <SelectItem value="dark">Dark</SelectItem>
	    <SelectItem value="system">System</SelectItem>
	  	</SelectContent>
			</>
		),
	
  },
};

