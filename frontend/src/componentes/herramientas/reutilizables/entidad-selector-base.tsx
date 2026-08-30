import Select from "react-select";
import { PlusCircle } from "lucide-react";
import { Button } from "../../ui/Button";

export interface EntidadBase {
  id: number;
  denominacion: string;
}

interface EntidadSelectorBaseProps<T extends EntidadBase> {
  titulo: string;

  denominacion: string;
  setDenominacion: (value: string) => void;
  denominacionRef: React.RefObject<HTMLInputElement>;

  opciones: T[];
  selected: T | null;
  selectedId: number;

  selectRef: React.RefObject<HTMLDivElement>;

  disabled?: boolean;

  error?: string;

  onEnterInput: (e: React.KeyboardEvent) => void;
  onEnterSelect?: (e: React.KeyboardEvent) => void;

  onChange?: (entidad: T | null) => void;
  onAgregar: () => void;
  ocultarAgregar?: boolean;
}

export default function EntidadSelectorBase<T extends EntidadBase>({
  titulo,
  denominacion,
  setDenominacion,
  denominacionRef,
  opciones,
  selected,
  selectedId,
  selectRef,
  disabled = false,
  error,
  onEnterInput,
  onEnterSelect,
  onChange,
  onAgregar,
  ocultarAgregar = false,
}: EntidadSelectorBaseProps<T>) {
  return (
    <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
      <label className="block text-sm font-medium text-gray-700 py-1">
        {titulo}
      </label>

      <div className="flex gap-x-4">
        {/* Input */}
        <div className="w-80">
          <input
            ref={denominacionRef}
            type="text"
            placeholder="Denominación"
            value={denominacion}
            onChange={(e) =>
              setDenominacion(e.target.value.trimStart())
            }
            onKeyDown={onEnterInput}
            disabled={disabled}
            className="w-full border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Select */}
        <div ref={selectRef} className="w-full">
          <Select
            value={
              opciones.find((o) => o.id === selectedId) ??
              selected
            }
            options={opciones}
            getOptionLabel={(o) => o.denominacion}
            getOptionValue={(o) => String(o.id)}
            onChange={(opt) => {
                if (!onChange) return;
                onChange(opt as T | null);
            }}
            onKeyDown={onEnterSelect}
            placeholder="Seleccione"
            isDisabled={disabled}
            menuPortalTarget={document.body}
            styles={selectStyles}
          />

          {error && (
            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>

        {/* Botón */}
        {!ocultarAgregar && (
          <Button
            type="button"
            disabled={disabled}
            title={`Agregar ${titulo}`}
            variant="outline"
            size="icon"
            className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
            onClick={onAgregar}
          >
            <PlusCircle size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}

const selectStyles = {
  control: (base: any) => ({ ...base, color: "black" }),
  singleValue: (base: any) => ({ ...base, color: "black" }),
  option: (base: any, state: any) => ({
    ...base,
    color: state.isSelected ? "white" : "black",
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#93c5fd"
      : "white",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};
