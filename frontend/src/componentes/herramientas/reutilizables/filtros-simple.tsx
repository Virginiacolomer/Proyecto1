import { useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export interface FiltrosSimpleValues {
  denominacion: string;
  incluirEliminados?: boolean;
}

interface FiltrosSimpleProps {
  onBuscar: (filtros: FiltrosSimpleValues) => void;
  mostrarIncluirEliminados?: boolean;
}

export const FiltrosSimple = ({
  onBuscar,
  mostrarIncluirEliminados = false,
}: FiltrosSimpleProps) => {
  const [abierto, setAbierto] = useState(false);
  const [denominacion, setDenominacion] = useState("");
  const [incluirEliminados, setIncluirEliminados] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("");

  const handleBuscar = () => {
    setFiltroActivo(denominacion);
    onBuscar({
      denominacion,
      ...(mostrarIncluirEliminados ? { incluirEliminados: incluirEliminados || undefined } : {}),
    });
  };

  const handleLimpiar = () => {
    setDenominacion("");
    setFiltroActivo("");
    setIncluirEliminados(false);
    onBuscar({ denominacion: "" });
  };

  return (
    <div className="px-4 pt-2 pb-1 w-full">
      {/* Trigger + badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setAbierto((prev) => !prev)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filtros
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
          />
        </button>

        {filtroActivo && (
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-0.5">
            <Search size={12} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300 max-w-[140px] truncate">
              {filtroActivo}
            </span>
            <button onClick={handleLimpiar} className="text-blue-400 hover:text-blue-600 ml-0.5">
              <X size={12} />
            </button>
          </div>
        )}

        {mostrarIncluirEliminados && incluirEliminados && (
          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full px-3 py-0.5">
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              Incluye eliminados
            </span>
          </div>
        )}
      </div>

      {/* Panel desplegable */}
      {abierto && (
        <div className="mt-3 w-full flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <Input
                type="text"
                placeholder="Buscar por denominación..."
                value={denominacion}
                onChange={(e) => setDenominacion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                className="pl-10 w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
              />
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white shrink-0"
              onClick={handleBuscar}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {mostrarIncluirEliminados && (
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={incluirEliminados}
                onChange={(e) => setIncluirEliminados(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Incluir eliminados</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
};
