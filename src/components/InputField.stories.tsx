import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import InputField, { type InputFieldProps } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible input with variants, sizes, helper/error text, loading, clear & password toggle. Fully keyboard and screen-reader friendly.",
      },
    },
  },
  argTypes: {
    onChange: { action: "change" },
    type: { control: "select", options: ["text", "password", "email", "number"] },
    variant: { control: "inline-radio", options: ["filled", "outlined", "ghost"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof InputField>;

const Controlled = (args: InputFieldProps) => {
  const [val, setVal] = React.useState(args.value ?? "");
  return (
    <div className="w-80">
      <InputField {...args} value={val} onChange={(e) => setVal(e.target.value)} />
    </div>
  );
};

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Username",
    placeholder: "Enter username",
    helperText: "Use 4–20 characters",
    variant: "outlined",
    size: "md",
    type: "text",
  },
};

export const Password: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "Search", loading: true, placeholder: "Loading…", variant: "ghost" },
};

export const ErrorState: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    label: "Email",
    type: "email",
    invalid: true,
    errorMessage: "Please enter a valid email",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Controlled label="Small" size="sm" placeholder="Small" />
      <Controlled label="Medium" size="md" placeholder="Medium" />
      <Controlled label="Large" size="lg" placeholder="Large" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Controlled label="Filled" variant="filled" placeholder="Filled" />
      <Controlled label="Outlined" variant="outlined" placeholder="Outlined" />
      <Controlled label="Ghost" variant="ghost" placeholder="Ghost" />
    </div>
  ),
};
