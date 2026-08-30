import { JSX, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/Table";
import { Button } from "../../ui/Button";
import { SelectUI, SelectContentUI, SelectItemUI, SelectTriggerUI, SelectValueUI } from "../../ui/Select";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  type?: "text" | "select";
  options?: string[];
  editable?: boolean;
  size?: "s" | "m" | "l" | "xl" | "xxl" | "xxxl"; // Tamaño de la columna
  spacing?: "s" | "m" | "l" | "xl" | "xxl" | "xxxl"; // espaciado entre columnas
  emptyColumnsAfter?: number; // Cantidad de columnas vacías después de esta
  formatFunction?: (value: any) => string; // 🆕 Función opcional de formato
}

interface TablaFlexibleProps<T> {
  columns: Column<T>[];
  data: T[];
  onUpdate?: (newData: T[]) => void;
  actionColumnSpacing?: "s" | "m" | "l" | "xl" | "xxl" | "xxxl";
  actions?: (row: T, rowIndex: number) => JSX.Element;
}

// Función para asignar el tamaño de la columna basado en `size`
const getColumnWidth = (size?: string) => {
  switch (size) {
    case "s":
      return "w-20"; // Pequeño
    case "m":
      return "w-32"; // Mediano
    case "l":
      return "w-48"; // Grande
    case "xl":
      return "w-64"; // Extra grande
    case "xxl":
      return "w-80"; // Extra extra grande
    case "xxxl":
      return "w-96"; // Extra extra extra grande
    default:
      return "w-auto"; // Automático si no se define
  }
};

const getColumnSpacing = (spacing?: string) => {
  switch (spacing) {
    case "s":
      return "px-2"; // Espaciado ajustado
    case "m":
      return "px-4"; // Espaciado por defecto
    case "l":
      return "px-6"; // Espaciado amplio
    case "xl":
      return "px-8"; // Espaciado extra
    case "xxl":
      return "px-10"; // Espaciado extra extra
    case "xxxl":
      return "px-12"; // Espaciado extra extra extra
    default:
      return "px-4"; // Espaciado por defecto si no se especifica
  }
};

export function TablaFlexible<T extends Record<string, any>>({
  columns,
  data,
  onUpdate,
  actionColumnSpacing,
  actions,
}: TablaFlexibleProps<T>) {
  const [tableData, setTableData] = useState<T[]>(data);

  // 🚀 Sincronizar datos cuando `data` cambia
  useEffect(() => {
    console.log("Tabla actualizada:", data); // Verifica si los datos están llegando correctamente
    setTableData(data);
  }, [data]);

  const handleInputChange = (rowIndex: number, accessor: keyof T, value: any) => {
    const updatedData = tableData.map((row, index) => (index === rowIndex ? { ...row, [accessor]: value } : row));
    setTableData(updatedData);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  return (
    <div className="overflow-y-auto max-h-96 rounded-lg border dark:bg-gray-700 dark:text-white border-gray-200 shadow-md relative">
      <Table className="w-full">
        <TableHeader className="sticky top-0 z-10 bg-gray-300 dark:bg-gray-900 shadow-md">
          <TableRow className="bg-gray-300 dark:bg-gray-900">
            {/* Nueva columna de índice */}
            <TableHead className="sticky top-0 z-20 px-4 py-3 text-left font-semibold text-gray-700 dark:text-white w-12">
              #
            </TableHead>

            {columns.map((column, index) => (
              <>
                <TableHead
                  key={index}
                  className={`sticky top-0 z-20 py-3 text-center font-semibold text-black dark:text-white ${getColumnWidth(column.size)} ${getColumnSpacing(column.spacing)}`}
                >
                  {column.header}
                </TableHead>

                {/* Agregar columnas vacías después de la columna si está definido */}
                {Array.from({ length: column.emptyColumnsAfter || 0 }).map((_, i) => (
                  <TableHead key={`empty-${index}-${i}`} className="py-3 w-8"></TableHead>
                ))}
              </>
            ))}

            <TableHead
              className={`sticky top-0 z-20 py-3 text-left text-black dark:text-white ${getColumnSpacing(actionColumnSpacing)}`}
            >
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="border-b border-gray-400 dark:border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500 "
            >
              {/* Columna de índice */}
              <TableCell className="px-4 py-3 text-sm font-bold ">{rowIndex + 1}</TableCell>

              {columns.map((column, cellIndex) => (
                <>
                  <TableCell
                    key={cellIndex}
                    className={`py-3 text-sm  ${getColumnWidth(column.size)} ${getColumnSpacing(column.spacing)}`}
                  >
                    {column.type === "select" && column.options ? (
                      <SelectUI
                        onValueChange={(value) => handleInputChange(rowIndex, column.accessor, value)}
                        value={row[column.accessor] as string}
                      >
                        <SelectTriggerUI>
                          <SelectValueUI placeholder="Seleccione" />
                        </SelectTriggerUI>
                        <SelectContentUI>
                          {column.options.map((option, optIndex) => (
                            <SelectItemUI key={optIndex} value={option}>
                              {option}
                            </SelectItemUI>
                          ))}
                        </SelectContentUI>
                      </SelectUI>
                    ) : (
                      <input
                        type="text"
                        className="border border-gray-400 dark:border-gray-200 px-2 py-1 w-full bg-transparent focus:outline-none"
                        value={
                          column.formatFunction
                            ? column.formatFunction(row[column.accessor]) // 🆕 Aplicar la función de formato si existe
                            : row[column.accessor]
                        }
                        title={String(row[column.accessor] ?? "")} // ← este es el tooltip
                        onChange={(e) => handleInputChange(rowIndex, column.accessor, e.target.value)}
                        disabled={!column.editable}
                      />
                    )}
                  </TableCell>

                  {/* Agregar columnas vacías después de la columna si está definido */}
                  {Array.from({ length: column.emptyColumnsAfter || 0 }).map((_, i) => (
                    <TableCell key={`empty-${cellIndex}-${i}`} className="py-3 w-8"></TableCell>
                  ))}
                </>
              ))}

              {/* Renderiza los botones personalizados si `actions` está definido */}
              <TableCell className={`py-3 flex-shrink-0 ${getColumnSpacing(actionColumnSpacing)}`}>
                {actions ? (
                  actions(row, rowIndex)
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                  >
                    Eliminar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
