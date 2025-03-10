import type { Meta, StoryObj } from "@storybook/react";

import { MdLanguage } from "react-icons/md";

import { Button } from "./Button";
import React from "react";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary", "outline", "text", "link"],
      description: "The visual style of the button",
    },
    size: {
      control: { type: "radio" },
      options: ["small", "medium", "large"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    fullWidth: {
      control: "boolean",
      description:
        "Whether the button should take up the full width of its container",
    },
    startIcon: {
      description: "Icon to display at the start of the button",
    },
    endIcon: {
      description: "Icon to display at the end of the button",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    disabled: false,
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    disabled: false,
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    disabled: false,
    variant: "outline",
  },
};

export const Text: Story = {
  args: {
    children: "Text Button",
    disabled: false,
    variant: "text",
  },
};

export const Link: Story = {
  args: {
    children: "Button that looks like a link",
    disabled: false,
    variant: "link",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    disabled: false,
    fullWidth: true,
    variant: "primary",
  },
};

export const Sizes: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    variant: "primary",
    children: "Button with Start Icon",
    startIcon: <MdLanguage size={24} />,
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: "primary",
    children: "Button with End Icon",
    endIcon: <span>→</span>,
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: "primary",
    children: "Button with Both Icons",
    startIcon: <span>🔍</span>,
    endIcon: <span>→</span>,
  },
};
