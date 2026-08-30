import { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import Select from "react-select";

// ===========================
// Tipos genéricos
// ===========================

export interface OpcionSelect {
  id: number;
  denominacion: string;
}

export interface FiltrosEntidadValues {
  denominacion: string;
  selectId?: number | null;       // ej: condicionIvaId, tipoId, etc.
  poseeSaldo?: boolean;
  incluirEliminados?: boolean;
}

export interface ConfigFiltrosEntidad {
  /** Placeholder del input de denominación */
  placeholderDenominacion?: string;
  /** Si se muestra el select (ej: condición IVA) */
  mostrarSelect?: boolean;
  /** Label del select */
  labelSelect?: string;
  /** Placeholder del select */
  placeholderSelect?: string;
  /** Opciones del select — si no se pasan, se cargan con fetchOpciones */
  opciones?: OpcionSelect[];
  /** Función para cargar opciones async (se llama al montar si opciones no está definido) */
  fetchOpciones?: () => Promise<OpcionSelect[]>;
  /** Si se muestra el check "Con saldo pendiente" */
  mostrarConSaldo?: boolean;
  /** Si se muestra el check "Incluir eliminados" */
  mostrarIncluirEliminados?: boolean;
}

interface FiltrosEntidadProps {
  config: ConfigFiltrosEntidad;
  onBuscar: (filtros: FiltrosEntidadValues) => void;
}

// ===========================
// Componente
// ===========================

export function FiltrosEntidad({ config, onBuscar }: FiltrosEntidadProps) {
  const {
    placeholderDenominacion = "Buscar por denominación...",
    mostrarSelect = false,
    labelSelect = "Filtro",
    placeholderSelect = "Todos...",
    opciones: opcionesIniciales,
    fetchOpciones,
    mostrarConSaldo = false,
    mostrarIncluirEliminados = false,
  } = config;

  const [abierto, setAbierto] = useState(false);
  const [denominacion, setDenominacion] = useState("");
  const [selectId, setSelectId] = useState<number | null>(null);
  const [selectedOpcion, setSelectedOpcion] = useState<OpcionSelect | null>(null);
  const [conSaldo, setConSaldo] = useState(false);
  const [incluirEliminados, setIncluirEliminados] = useState(false);
  const [opciones, setOpciones] = useState<OpcionSelect[]>(opcionesIniciales ?? []);

  // Badges activos
  const [filtroActivo, setFiltroActivo] = useState("");
  const [selectActivo, setSelectActivo] = useState<string | null>(null);

  // Cargar opciones async si hace falta
  useEffect(() => {
    if (mostrarSelect && !opcionesIniciales && fetchOpciones) {
      fetchOpciones()
        .then(setOpciones)
        .catch((err) => console.error("Error al cargar opciones del filtro:", err));
    }
  }, [mostrarSelect]);

  const handleBuscar = () => {
    setFiltroActivo(denominacion);
    setSelectActivo(selectedOpcion?.denominacion ?? null);

    onBuscar({
      denominacion,
      selectId: mostrarSelect ? selectId : undefined,
      poseeSaldo: mostrarConSaldo ? conSaldo || undefined : undefined,
      incluirEliminados: mostrarIncluirEliminados ? incluirEliminados || undefined : undefined,
    });
  };

  const handleLimpiar = () => {
    setDenominacion("");
    setSelectId(null);
    setSelectedOpcion(null);
    setConSaldo(false);
    setIncluirEliminados(false);
    setFiltroActivo("");
    setSelectActivo(null);
    onBuscar({ denominacion: "" });
  };

  const hayFiltrosActivos =
    filtroActivo ||
    selectActivo ||
    (mostrarConSaldo && conSaldo) ||
    (mostrarIncluirEliminados && incluirEliminados);

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
            <button
              onClick={() => {
                setDenominacion("");
                setFiltroActivo("");
                onBuscar({ denominacion: "", selectId, poseeSaldo: conSaldo || undefined, incluirEliminados: incluirEliminados || undefined });
              }}
              className="text-blue-400 hover:text-blue-600 ml-0.5"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {selectActivo && (
          <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-3 py-0.5">
            <span className="text-xs font-medium text-green-700 dark:text-green-300 max-w-[140px] truncate">
              {labelSelect}: {selectActivo}
            </span>
            <button
              onClick={() => {
                setSelectId(null);
                setSelectedOpcion(null);
                setSelectActivo(null);
                onBuscar({ denominacion, selectId: null, poseeSaldo: conSaldo || undefined, incluirEliminados: incluirEliminados || undefined });
              }}
              className="text-green-400 hover:text-green-600 ml-0.5"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {mostrarConSaldo && conSaldo && (
          <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-full px-3 py-0.5">
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
              Con saldo
            </span>
          </div>
        )}

        {mostrarIncluirEliminados && incluirEliminados && (
          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full px-3 py-0.5">
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              Incluye eliminados
            </span>
          </div>
        )}

        {hayFiltrosActivos && (
          <button
            onClick={handleLimpiar}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Panel desplegable */}
      {abierto && (
        <div className="mt-3 w-full flex flex-wrap items-end gap-3">
          {/* Denominación */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <Input
              type="text"
              placeholder={placeholderDenominacion}
              value={denominacion}
              onChange={(e) => setDenominacion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              className="pl-10 w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
            />
          </div>

          {/* Select opcional */}
          {mostrarSelect && (
            <div className="flex-1 min-w-[180px]">
              <Select
                value={selectedOpcion}
                options={opciones}
                getOptionLabel={(o) => o.denominacion}
                getOptionValue={(o) => String(o.id)}
                onChange={(selected) => {
                  setSelectedOpcion(selected);
                  setSelectId(selected?.id ?? null);
                }}
                isClearable
                placeholder={placeholderSelect}
                className="text-sm text-black"
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({ ...base, color: "black", minHeight: "36px", fontSize: "14px" }),
                  singleValue: (base) => ({ ...base, color: "black" }),
                  option: (base, { isSelected, isFocused }) => ({
                    ...base,
                    color: isSelected ? "white" : "black",
                    backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                    fontSize: "14px",
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>
          )}

          {/* Check: Con saldo pendiente */}
          {mostrarConSaldo && (
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={conSaldo}
                onChange={(e) => setConSaldo(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Con saldo</span>
            </label>
          )}

          {/* Check: Incluir eliminados */}
          {mostrarIncluirEliminados && (
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={incluirEliminados}
                onChange={(e) => setIncluirEliminados(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Incluir eliminados</span>
            </label>
          )}

          {/* Buscar */}
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white shrink-0"
            onClick={handleBuscar}
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      )}
    </div>
  );
}
