import { FiltrosEntidad, FiltrosEntidadValues, OpcionSelect } from "../../../herramientas/reutilizables/filtros-entidad";
import ProveedorService from "../services/proveedor-service";

// Re-exportamos el tipo con el nombre semántico del módulo
export type FiltrosProveedorValues = FiltrosEntidadValues;

interface FiltrosProveedorProps {
  onBuscar: (filtros: FiltrosProveedorValues) => void;
}

const fetchCondicionesIva = async (): Promise<OpcionSelect[]> => {
  const res = await ProveedorService.obtenerTotales({ denominacion: "" }, "condiciones-iva");
  return res?.data ?? [];
};

export function FiltrosProveedor({ onBuscar }: FiltrosProveedorProps) {
  return (
    <FiltrosEntidad
      config={{
        placeholderDenominacion: "Buscar por denominación...",
        mostrarSelect: true,
        labelSelect: "IVA",
        placeholderSelect: "Condición IVA...",
        fetchOpciones: fetchCondicionesIva,
        mostrarConSaldo: true,
        mostrarIncluirEliminados: true,
      }}
      onBuscar={onBuscar}
    />
  );
}
