import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { DatePicker1 } from "@/shared/ui/datePicker/DatePicker";

const meta: Meta<typeof DatePicker1> = {
	title: 'Components/DatePicker1',
	component: DatePicker1,
	argTypes: {}
};

export default meta;
type Story = StoryObj<typeof DatePicker1>;

export const Primary: Story = {
	args: {
		placeholder: 'Choose the date',
		setStartDate: () => {new Date()}
	}
}