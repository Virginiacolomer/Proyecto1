import { CircleDollarSign, Info, Pencil, Trash } from "lucide-react";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";
import { ConsultarProveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";

type Props = {
  proveedor: ConsultarProveedor;
  onEditar: () => void;
  onMovimientos: () => void;
  onAuditoria: () => void;
  onEliminar: () => void;
};

export function ProveedorCard({
  proveedor,
  onEditar,
  onMovimientos,
  onAuditoria,
  onEliminar,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {proveedor.denominacion}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Código: {proveedor.codigo}
        </p>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Condición IVA</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-900 dark:text-white font-medium">{proveedor.condicionIva}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-gray-900 dark:text-white">Saldo</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(proveedor.saldo || 0)}</span>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={onEditar}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Pencil size={16} />
          </button>
          
          <button
            onClick={onMovimientos}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <CircleDollarSign size={16} />
          </button>
          
          <button
            onClick={onAuditoria}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Info size={16} />
          </button>

          <button
            onClick={onEliminar}
            disabled
            className="flex-1 bg-gray-300 text-gray-500 cursor-not-allowed py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}