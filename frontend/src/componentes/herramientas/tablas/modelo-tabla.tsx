import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string;
  Cell?: (props: { value: React.ReactNode; row: T }) => React.ReactNode;
}
interface ModeloTablaProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyRowCount?: number; // NUEVA PROP
}

export function ModeloTabla<T>({ data, columns, onRowClick, emptyRowCount = 0 }: ModeloTablaProps<T>) {
  const totalRows = Math.max(data.length, emptyRowCount);

  return (
    <div className="overflow-x-auto rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-900 border-gray-200 shadow-md">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-300 dark:bg-gray-900">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:border-gray-900 dark:text-white ${
                  column.width ? `w-${column.width}` : ""
                }`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(totalRows)].map((_, rowIndex) => {
            const item = data[rowIndex];
            const isEmpty = !item;

            return (
              <TableRow
                key={rowIndex}
                className={`border-b border-gray-200 dark:border-gray-900 ${
                  !isEmpty && onRowClick ? "cursor-pointer hover:bg-gray-500" : ""
                }`}
                onClick={() => !isEmpty && onRowClick?.(item)}
              >
                {columns.map((column, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-3 text-sm dark:text-white">
                    {isEmpty ? (
                      <span className="text-transparent select-none">-</span>
                    ) : column.Cell ? (
                      column.Cell({
                        value:
                          typeof column.accessor === "function"
                            ? column.accessor(item)
                            : (item[column.accessor] as React.ReactNode),
                        row: item,
                      })
                    ) : typeof column.accessor === "function" ? (
                      column.accessor(item)
                    ) : (
                      (item[column.accessor] as React.ReactNode)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
