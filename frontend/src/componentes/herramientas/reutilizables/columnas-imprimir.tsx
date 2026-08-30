import { useState } from "react";
import { ChevronDown, Printer } from "lucide-react";
import { Button } from "../../ui/Button";
import { Column } from "../tablas/tabla-flexible-ag-grid";

interface ColumnasImprimirProps<T> {
  columns: Column<T>[];
  columnasSeleccionadas: string[];
  onCambiarSeleccion: (seleccionadas: string[]) => void;
  onImprimir: () => void;
}

export function ColumnasImprimir<T>({
  columns,
  columnasSeleccionadas,
  onCambiarSeleccion,
  onImprimir,
}: ColumnasImprimirProps<T>) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="px-4 pt-2 pb-1 shrink-0">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors whitespace-nowrap"
      >
        <Printer className="h-4 w-4" />
        Columnas a imprimir
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
        />
      </button>

      {/* Panel desplegable */}
      {abierto && (
        <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50 min-w-[300px]">
          <div className="flex flex-wrap gap-3 mb-3">
            {columns.map((col) => {
              const seleccionada = columnasSeleccionadas.includes(col.accessor as string);
              return (
                <label
                  key={col.accessor as string}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                    seleccionada
                      ? "bg-blue-100 border-blue-400 text-blue-800"
                      : "bg-white border-gray-300 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={seleccionada}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onCambiarSeleccion([...columnasSeleccionadas, col.accessor as string]);
                      } else {
                        onCambiarSeleccion(columnasSeleccionadas.filter((c) => c !== col.accessor));
                      }
                    }}
                  />
                  {seleccionada && <span className="text-blue-600 text-xs">✓</span>}
                  {col.header}
                </label>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
              onClick={() => onCambiarSeleccion(columns.map((c) => c.accessor as string))}
            >
              Seleccionar todas
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-gray-700 underline"
              onClick={() => onCambiarSeleccion([])}
            >
              Limpiar
            </button>
            <Button
              onClick={onImprimir}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 h-auto"
            >
              Imprimir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
