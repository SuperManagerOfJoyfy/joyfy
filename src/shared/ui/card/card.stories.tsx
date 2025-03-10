import type { Meta, StoryObj } from "@storybook/react";

import { Card } from "./Card";

const meta = {
  component: Card,
  tags: ["autodocs"],
  title: "UI/Card",
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    style: { height: "100px", width: "120px" },
    children: <p>Test Card</p>,
  },
};
