import React, { useState } from 'react';

// NOTE: Generic column typing, could be expanded later
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
}

function DataTable<T>({ data, columns, loading = false, selectable = false, onRowSelect }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // TODO: Replace with more robust sorting if dataset grows
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const toggleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleRow = (index: number) => {
    const newSelection = new Set(selectedRows);
    newSelection.has(index) ? newSelection.delete(index) : newSelection.add(index);
    setSelectedRows(newSelection);
    if (onRowSelect) {
      onRowSelect(Array.from(newSelection).map((i) => sortedData[i]));
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }

  return (
    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr>
          {selectable && <th className="p-2 border border-gray-300 dark:border-gray-700"></th>}
          {columns.map((col, i) => (
            <th
              key={i}
              className="p-2 border border-gray-300 dark:border-gray-700 cursor-pointer select-none"
              onClick={() => col.sortable && toggleSort(col.accessor as keyof T)}
            >
              {col.header}
              {col.sortable && sortConfig.key === col.accessor && (
                <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            {selectable && (
              <td className="p-2 border border-gray-300 dark:border-gray-700 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.has(rowIndex)}
                  onChange={() => toggleRow(rowIndex)}
                />
              </td>
            )}
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="p-2 border border-gray-300 dark:border-gray-700">
                {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
