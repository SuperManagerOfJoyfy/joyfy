import { SelectBox } from "@/shared/ui/selectBox/SelectBox";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof SelectBox> = {
	title: 'Components/SelectBox',
	component: SelectBox,
	tags: ["autodocs"],
	argTypes: {
		placeholder: {
			control: "text",
			description: "Text displayed when no value is selected",
			defaultValue: "Select an option",
		},
		defaultValue: {
			control: "text",
			description: "The default value",
		},
		disabled: {
			control: "boolean",
			description: "Indicates if the select is disabled",
		},
		width: {
			control: "text",
			description: "Change the width of the select box",
		},
		options: {
			control: "object",
			description: "Array of options to choose from",
		},
		onValueChange: {
			action: "value changed",
			description: "Called when the value is changed",
		},
	},
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

export const Primary: Story = {
	args: {
		placeholder: 'Choose language',
		onValueChange: action("value changed"),
		options: [
			{
				value: "french",
				children: (
					<div>
						<span>🇫🇷</span> French
					</div>
				),
			},
			{
				value: "german",
				children: (
					<div>
						<span>🇩🇪</span> German
					</div>
				),
			},
			{
				value: "russian",
				children: (
					<div>
						<span>🇷🇺</span> Russian
					</div>
				),
			},
			{
				value: "english",
				children: (
					<div>
						<span>🇺🇸</span> English
					</div>
				),
			},
		],
	}
}

export const WithDefaultValue: Story = {
	args: {
		placeholder: 'Choose language',
		defaultValue: 'german',
		options: [
			{
				value: "french",
				children: (
					<div>
						<span>🇫🇷</span> French
					</div>
				),
			},
			{
				value: "german",
				children: (
					<div>
						<span>🇩🇪</span> German
					</div>
				),
			}
		],
	}
}

export const Disabled: Story = {
	args: {
		placeholder: 'Choose language',
		options: [
			{
				value: "french",
				children: (
					<div>
						<span>🇫🇷</span> French
					</div>
				),
			},
			{
				value: "german",
				children: (
					<div>
						<span>🇩🇪</span> German
					</div>
				),
			}
		],
		disabled: true
	}
}


export const WithAdjustableWidth: Story = {
	args: {
		width: '500px',
		placeholder: 'Choose language',
		options: [
			{
				value: "french",
				children: (
					<div>
						<span>🇫🇷</span> French
					</div>
				),
			},
			{
				value: "german",
				children: (
					<div>
						<span>🇩🇪</span> German
					</div>
				),
			}
		]
	}
}
