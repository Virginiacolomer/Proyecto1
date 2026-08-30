import { FiltrosEntidad, FiltrosEntidadValues, OpcionSelect } from "../../../herramientas/reutilizables/filtros-entidad";
import ClienteService from "../services/cliente-service";

// Re-exportamos el tipo con el nombre semántico del módulo
export type FiltrosClienteValues = FiltrosEntidadValues;

interface FiltrosClienteProps {
  onBuscar: (filtros: FiltrosClienteValues) => void;
}

const fetchCondicionesIva = async (): Promise<OpcionSelect[]> => {
  const res = await ClienteService.obtenerTotales({ denominacion: "" }, "condiciones-iva");
  return res?.data ?? [];
};

export function FiltrosCliente({ onBuscar }: FiltrosClienteProps) {
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
