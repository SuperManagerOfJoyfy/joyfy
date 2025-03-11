import { SelectBox } from "@/shared/ui/selectBox/SelectBox";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof SelectBox> = {
	title: 'Components/SelectBox',
	component: SelectBox,
	argTypes: {
		placeholder: {
			control: "text",
			description: "Текст, который показывается, если значение не выбрано",
			defaultValue: "Выберите опцию",
		},
		defaultValue: {
			control: "text",
			description: "Значение по умолчанию",
		},
		disabled: {
			control: "boolean",
			description: "Селект неактивен",
		},
		width: {
			control: "text",
			description: "Изменение ширины селекта",
		},
		options: {
			control: "object",
			description: "Массив опций для выбора",
		},
		onValueChange: {
			action: "value changed",
			description: "Вызывается при изменении значения",
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
