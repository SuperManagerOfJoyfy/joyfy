import flag from './flag-russia.svg'

// import {
// 	SelectBox,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/shared/ui/select/SelectBox';
// import type { Meta, StoryObj } from '@storybook/react';


// const meta: Meta<typeof SelectBox> = {
// 	title: 'Components/Select',
// 	component: SelectBox,
// 	argTypes: {

// 	}
// };

// export default meta;
// type Story = StoryObj<typeof SelectBox>;

// export const Primary: Story = {
// 	args: {
// 		placeholder: 'Choose language',
// 		// options: [{ value: 'english' }, { value: 'french' }]
//   // args: {
// 		children: (
// 			<>
// 	    <SelectItem value="light">Light</SelectItem>
// 	    <SelectItem value="dark">Dark</SelectItem>
// 	    <SelectItem value="system">System</SelectItem>
// 			</>
// 		),
// 		}
//   // },
// };



import { SelectBox } from "@/shared/ui/select/SelectBox";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SelectBox> = {
	title: 'Components/SelectBox',
	component: SelectBox,
	argTypes: {
		// disabled: {
		// 	control: "boolean",
		// 	description: "Disables select",
		// },
	}
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

export const Primary: Story = {
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

