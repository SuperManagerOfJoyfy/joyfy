import { TextField } from './TextField';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof TextField> = {
	title: 'Components/TextField',
	component: TextField,
	tags: ["autodocs"],
	argTypes: {
    search: {
      control: 'boolean',
      description: 'Enable search icon on the left side',
    },
    label: {
      control: 'text',
      description: 'Label for the input field',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to be displayed under the input field',
    },
    onKeyDown: {
      action: 'onKeyDown',
      description: 'Callback for the onKeyDown event of the input',
    },
    onEnter: {
      action: 'onEnter',
      description: 'Callback for the Enter key press event',
    },
    onShowPasswordClick: {
      action: 'onShowPasswordClick',
      description: 'Callback for the password visibility toggle',
    },
    type: {
      control: 'select',
      options: ['text', 'password'],
      description: 'Type of the input field (text or password)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
		label: "Email",
		placeholder: 'Enter your text',
		onEnter: action('Enter!'),
		onKeyDown: action('Key Pressed'),
		onShowPasswordClick: action('Toggle password')
  },
};


export const Invalid: Story = {
  args: {
		...Default.args,
		errorMessage: 'Error text'
	}
};

export const Disabled: Story = {
  args: {
		...Default.args,
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
		placeholder: 'Enter your password',
		type: 'password'
	}
};