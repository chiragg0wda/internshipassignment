import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

export interface Column<T> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  widthClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  selectionMode?: "single" | "multiple";
  onRowSelect?: (selectedRows: T[]) => void;
  rowKey?: keyof T; // new: allow custom row key (default "id")
}

function DataTable<T extends { id?: number | string }>({
  data,
  columns,
  loading = false,
  selectable = false,
  selectionMode = "single",
  onRowSelect,
  rowKey = "id",
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortConfig]);

  // Sorting handler
  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === col.accessor && sortConfig.direction === "asc") {
      direction = "desc";
    }

    if (typeof col.accessor === "string") {
      setSortConfig({ key: col.accessor, direction });
    }
  };

  // Row selection
  const handleRowSelect = (row: T) => {
    if (!selectable) return;

    const key = row[rowKey];
    if (!key) return;

    let newSelected: T[] = [];
    const alreadySelected = selectedRows.some((r) => r[rowKey] === key);

    if (selectionMode === "single") {
      newSelected = alreadySelected ? [] : [row];
    } else {
      newSelected = alreadySelected
        ? selectedRows.filter((r) => r[rowKey] !== key)
        : [...selectedRows, row];
    }

    setSelectedRows(newSelected);
    onRowSelect?.(newSelected);
  };

  // Select all (multiple mode)
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(sortedData);
      onRowSelect?.(sortedData);
    } else {
      setSelectedRows([]);
      onRowSelect?.([]);
    }
  };

  const isRowSelected = (row: T) => {
    const key = row[rowKey];
    return selectedRows.some((r) => r[rowKey] === key);
  };

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-4 text-center flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : sortedData.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No data available</div>
      ) : (
        <table
          role="table"
          className="min-w-full border-collapse border border-gray-300"
        >
          <thead>
            <tr role="row" className="bg-gray-100">
              {selectable && (
                <th role="columnheader" className="p-2 border border-gray-300">
                  {selectionMode === "multiple" && (
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                      aria-label="Select all rows"
                    />
                  )}
                </th>
              )}
              {columns.map((col, index) => (
                <th
                  key={index}
                  role="columnheader"
                  scope="col"
                  className={`p-2 text-left border border-gray-300 cursor-pointer select-none ${
                    col.widthClassName || ""
                  }`}
                  onClick={() => handleSort(col)}
                  tabIndex={col.sortable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (col.sortable && (e.key === "Enter" || e.key === " ")) {
                      handleSort(col);
                    }
                  }}
                  aria-sort={
                    sortConfig?.key === col.accessor
                      ? sortConfig.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span aria-hidden="true">
                        {sortConfig?.key === col.accessor
                          ? sortConfig.direction === "asc"
                            ? " ▲"
                            : " ▼"
                          : " ⇵"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={String(row[rowKey] ?? idx)}
                role="row"
                className={`border border-gray-300 hover:bg-gray-50 ${
                  isRowSelected(row) ? "bg-blue-100" : ""
                } cursor-pointer`}
                onClick={() => handleRowSelect(row)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRowSelect(row);
                  }
                }}
                aria-selected={isRowSelected(row)}
              >
                {selectable && (
                  <td role="cell" className="p-2 border border-gray-300">
                    <input
                      type="checkbox"
                      checked={isRowSelected(row)}
                      onChange={() => handleRowSelect(row)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select row with key ${row[rowKey]}`}
                    />
                  </td>
                )}
                {columns.map((col, i) => (
                  <td
                    key={i}
                    role="cell"
                    className={`p-2 border border-gray-300 ${col.widthClassName || ""}`}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row as any)[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataTable;
