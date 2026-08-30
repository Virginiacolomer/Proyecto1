import Select from "react-select";
import { PlusCircle } from "lucide-react";
import { Linea, SelectLinea } from "../../../../../interfaces/gestion-producto/linea/interfaces-linea";
import { SelectSublinea, SubLinea } from "../../../../../interfaces/gestion-producto/sublinea/interfaces-sublinea";
import { Button } from "../../../../ui/Button";

interface LineasSelectorProps {
  denominacionLinea: string;
  setDenominacionLinea: (value: string) => void;
  denominacionLineaRef: React.RefObject<HTMLInputElement>;
  selectLineaRef: React.RefObject<HTMLDivElement>;

  lineas: SelectLinea[];

  selectedLinea: SelectLinea | null;

  lineaId: number;

  disabled?: boolean;

  errors?: {
    lineaId?: { message?: string };
  };

  onEnterDenominacion: (e: React.KeyboardEvent) => void;
  onEnterLinea: (e: React.KeyboardEvent) => void;

  onLineaChange: (linea: SelectLinea | null) => void;

  onAgregarLinea: () => void;
}

export default function LineasSelector({
  denominacionLinea,
  setDenominacionLinea,
  denominacionLineaRef,
  selectLineaRef,
  lineas,
  selectedLinea,
  lineaId,
  disabled = false,
  errors,
  onEnterDenominacion,
  onEnterLinea,
  onLineaChange,
  onAgregarLinea,
}: LineasSelectorProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
      <label className="block text-sm font-medium text-gray-700 py-1">
        Líneas
      </label>

      <div className="flex gap-x-4">
        {/* Denominación */}
        <div className="w-80">
          <input
            ref={denominacionLineaRef}
            type="text"
            placeholder="Denominación"
            value={denominacionLinea}
            onChange={(e) => setDenominacionLinea(e.target.value.trimStart())}
            onKeyDown={onEnterLinea}
            disabled={disabled}
            className="w-full border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selects */}
        <div className="flex flex-col w-full gap-2">
          <div ref={selectLineaRef}>
            <Select
              value={
                lineas.find((l) => l.id === lineaId) ?? selectedLinea
              }
              options={lineas}
              getOptionLabel={(o) => o.denominacion}
              getOptionValue={(o) => String(o.id)}
              onChange={(opt) => onLineaChange(opt as Linea)}
              onKeyDown={onEnterDenominacion}
              isDisabled={disabled}
              placeholder="Seleccione"
              menuPortalTarget={document.body}
              styles={selectStyles}
            />

            {errors?.lineaId?.message && (
              <p className="text-sm text-red-600 mt-1">
                {errors.lineaId.message}
              </p>
            )}
          </div>

          
        </div>

        {/* Botón agregar */}
        <Button
          type="button"
          disabled={disabled}
          title="Agregar Línea"
          variant="outline"
          size="icon"
          className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
          onClick={onAgregarLinea}
        >
          <PlusCircle size={20} />
        </Button>
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
