import { useEffect } from "react";
import { useCabeceraDocumento } from "../../../../context/cabecera-documentos-context";

const LETRAS = ["A", "B", "C", "E", "M", "X"];

interface Props {
  disabled?: boolean;
  letraForzada?: string;
}

export default function SelectorLetraGasto({ disabled = false, letraForzada }: Props) {
  const { cabecera, updateCabecera } = useCabeceraDocumento();

  // Setear letra del documento por defecto si no hay ninguna
  useEffect(() => {
    if (!cabecera.letraDocumento) {
      updateCabecera({ letraDocumento: "A" });
    }
  }, []);

  // Si hay letra forzada, aplicarla automáticamente
  useEffect(() => {
    if (letraForzada) {
      updateCabecera({ letraDocumento: letraForzada });
    }
  }, [letraForzada]);

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Letra doc.</label>
      <select
        value={letraForzada ?? cabecera.letraDocumento ?? "A"}
        onChange={(e) => updateCabecera({ letraDocumento: e.target.value })}
        disabled={disabled || !!letraForzada}
        className="p-2 border bg-white text-black border-gray-300 rounded-md text-sm w-20 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {LETRAS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
