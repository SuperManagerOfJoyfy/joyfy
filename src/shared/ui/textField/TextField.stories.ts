import { TextField } from './TextField';
import type { Meta, StoryObj } from '@storybook/react';


const meta: Meta<typeof TextField> = {
	title: 'Components/TextField',
	component: TextField,
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Primary: Story = {
  args: {
		label: "email",
		placeholder: 'Enter your text',
  },
};

export const Invalid: Story = {
  args: {
		...Primary.args,
		errorMessage: 'Error text'
	}
};

export const Disabled: Story = {
  args: {
		...Primary.args,
		disabled: true
	}
};

export const Search: Story = {
  args: {
		placeholder: 'input search',
		search: true
	}
};

export const Password: Story = {
  args: {
		label: "Password",
		type: 'password'
	}
};