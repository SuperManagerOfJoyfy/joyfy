import { SelectBox, SelectItem } from "@/shared/ui/selectBox/SelectBox";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof SelectBox> = {
	title: 'Components/SelectBox',
	component: SelectBox,
	tags: ["autodocs"],
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text displayed when no option is selected.',
			defaultValue: 'Select an option',
		},
		defaultValue: {
			control: 'text',
			description: 'The default selected value when the component is first rendered.',
		},
		onValueChange: {
			action: 'value changed',
			description: 'Callback triggered when the selected value changes.',
		},
		children: {
			description: 'List of options displayed inside the SelectBox.',
			control: false, 
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the select box if set to `true`.',
			defaultValue: false,
		},
		width: {
			control: 'text',
			description: 'Sets the width of the SelectBox component. Accepts any valid CSS width value.',
			defaultValue: 'auto',
		}
	}
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

export const Primary: Story = {
	args: {
		placeholder: 'Choose language',
		onValueChange: action("value changed"),
		children: (
				<>
					<SelectItem value="french"><span>🇫🇷</span> French</SelectItem>
					<SelectItem value="german"><span>🇩🇪</span> German</SelectItem>
					<SelectItem value="russian"><span>🇷🇺</span> Russian</SelectItem>
					<SelectItem value="english"><span>🇺🇸</span> English</SelectItem>
				</>
		)
	}
}

export const WithDefaultValue: Story = {
	args: {
		placeholder: 'Choose language',
		defaultValue: 'german',
		children: (
			<>
				<SelectItem value="french"><span>🇫🇷</span> French</SelectItem>
				<SelectItem value="german"><span>🇩🇪</span> German</SelectItem>
			</>
		),
	}
}

export const Disabled: Story = {
	args: {
		placeholder: 'Choose language',
		children: (
			<>
				<SelectItem value="french"><span>🇫🇷</span> French</SelectItem>
				<SelectItem value="german"><span>🇩🇪</span> German</SelectItem>
			</>
		),
		disabled: true
	}
}


export const WithAdjustableWidth: Story = {
	args: {
		width: '500px',
		placeholder: 'Choose language',
		children: (
			<>
				<SelectItem value="french"><span>🇫🇷</span> French</SelectItem>
				<SelectItem value="german"><span>🇩🇪</span> German</SelectItem>
			</>
		)
	}
}

export const Pagination: Story = {
	args: {
		defaultValue:'100',
		children: (
			<>
				<SelectItem value="10">10</SelectItem>
				<SelectItem value="20">20</SelectItem>
				<SelectItem value="30">30</SelectItem>
				<SelectItem value="50">50</SelectItem>
				<SelectItem value="100">100</SelectItem>
			</>
		)
	},
}
