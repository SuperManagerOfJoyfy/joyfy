import type { Meta } from "@storybook/react";

import { useState } from "react";
import { TextArea } from "./TextArea";

const meta = {
  component: TextArea,
  tags: ["autodocs"],
  title: "UI/Text Area",
} satisfies Meta<typeof TextArea>;

export default meta;

export const Default = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <TextArea
        label="Text Area"
        placeholder="Text-area"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const WithError = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <TextArea
        label="Text Area"
        placeholder="Text-area"
        error="Error message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Disabled = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <TextArea
        label="Text Area"
        placeholder="Text-area"
        disabled
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};
