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
      <a className="underline" href={`mailto:${row.email}`}>
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
        component:
          "Data table with sorting, single/multiple row selection, loading & empty states. Keyboard-accessible sorting.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<DataTableProps<User>>;

export const Default: Story = {
  args: { data: sampleData, columns },
};

export const Sortable: Story = {
  args: { data: sampleData, columns },
};

export const SelectableMultiple: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
    selectionMode: "multiple",
  },
};

export const SelectableSingle: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
    selectionMode: "single",
  },
};

export const Loading: Story = {
  args: { data: [], columns, loading: true },
};

export const Empty: Story = {
  args: { data: [], columns },
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
};
