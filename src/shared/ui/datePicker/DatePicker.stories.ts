import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { DatePicker } from "@/shared/ui/datePicker/DatePicker";

const meta: Meta<typeof DatePicker> = {
	title: 'Components/DatePicker',
	component: DatePicker,
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label text for the DatePicker',
			defaultValue: 'Date',
		},
		startDate: {
			control: 'date',
			description: 'Initial date selection',
		},
		endDate: {
			control: 'date',
			description: 'End date selection (for range mode)',
		},
		onSetStartDate: {
			action: 'start date picked',
			description: 'Callback function triggered when a start date is selected',
		},
		onSetEndDate: {
			action: 'end date picked',
			description: 'Callback function triggered when an end date is selected',
		},
		errorMessage: {
			control: 'text',
			description: 'Error message displayed when an invalid date is selected',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables date selection',
			defaultValue: false,
		}
	},
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
	args: {
		label: 'Date',
		startDate: null,
  	onSetStartDate: action("Date picked!"),
	}
}

export const Error: Story = {
	args: {...Default.args,
		errorMessage: 'Error! Select current month!'
	}
}

export const Disabled: Story = {
	args: {...Default.args,
		disabled: true
	}
}

export const Range: Story = {
	args: {
		label: 'Date range',
		startDate: null,
  	onSetStartDate: action("Start range"),
		endDate: null,
		onSetEndDate: action("End Range")
	}
}