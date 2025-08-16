import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import DataTable, { Column, DataTableProps } from "./DataTable";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const sampleData: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 24 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 29 },
  { id: 3, name: "Charlie", email: "charlie@example.com", age: 22 },
  { id: 4, name: "Deepak", email: "deepak@example.com", age: 32 },
];

const columns: Column<User>[] = [
  { header: "ID", accessor: "id", sortable: true, widthClassName: "w-16" },
  { header: "Name", accessor: "name", sortable: true },
  {
    header: "Email",
    accessor: (row) => (
      <a className="underline text-blue-600" href={`mailto:${row.email}`}>
        {row.email}
      </a>
    ),
  },
  { header: "Age", accessor: "age", sortable: true, widthClassName: "w-20" },
];

const meta: Meta<DataTableProps<User>> = {
  title: "Components/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**DataTable Component**

A flexible, accessible data table with:

- Column sorting (mouse + keyboard support)
- Row selection (single/multiple)
- Loading and empty states
- Responsive layout with customizable columns
- Keyboard navigation and ARIA roles for accessibility
        `,
      },
    },
  },
  argTypes: {
    onRowSelect: { action: "rowSelected" },
    selectionMode: {
      control: "radio",
      options: ["single", "multiple"],
    },
    loading: { control: "boolean" },
    selectable: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<DataTableProps<User>>;

export const Default: Story = {
  args: { data: sampleData, columns },
  parameters: {
    docs: { description: { story: "Basic table with sample data displayed." } },
  },
};

export const Sortable: Story = {
  args: { data: sampleData, columns },
  parameters: {
    docs: {
      description: {
        story:
          "Columns with `sortable: true` can be sorted by clicking the header or pressing Enter/Space when focused.",
      },
    },
  },
};

export const SelectableMultiple: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
    selectionMode: "multiple",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Table with checkboxes enabled. Multiple rows can be selected using mouse or keyboard.",
      },
    },
  },
};

export const SelectableSingle: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
    selectionMode: "single",
  },
  parameters: {
    docs: {
      description: {
        story: "Only one row can be selected at a time (radio-button style).",
      },
    },
  },
};

export const WithRowSelectCallback: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
    selectionMode: "multiple",
    onRowSelect: (rows) => console.log("Selected rows:", rows),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Example with `onRowSelect` callback. Selected rows are logged to console and Storybook Actions panel.",
      },
    },
  },
};

export const Loading: Story = {
  args: { data: [], columns, loading: true },
  parameters: {
    docs: { description: { story: "Displays a loading state instead of the table body." } },
  },
};

export const Empty: Story = {
  args: { data: [], columns },
  parameters: {
    docs: { description: { story: "Shows an empty state when no data is provided." } },
  },
};

export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 50 }).map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 18 + ((i * 3) % 40),
    })),
    columns,
    selectable: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates performance with 50 rows. Useful for testing scrolling and rendering.",
      },
    },
  },
};
