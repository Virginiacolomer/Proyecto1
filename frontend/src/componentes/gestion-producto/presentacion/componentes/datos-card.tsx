import type { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";
import { Info, Pencil, Trash } from "lucide-react";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { formatFechaHora } from "../../../herramientas/formateo-de-campos/fucion-formateo";


interface Props {
  presentacion: Presentacion;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DatosCards({ presentacion, onEditar, onInfo, onDelete }: Props) {
  const eliminada = !!presentacion.deletedAt;

  return (
    <div
      className={`border rounded-md px-3 py-3 ${
        eliminada
          ? "border-gray-200 bg-gray-100 dark:bg-slate-800 opacity-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Denominación */}
      <div className="mb-2">
        <p className="text-xs text-gray-500">Denominación</p>
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          {presentacion.denominacion}
        </p>
        {eliminada && (
          <p className="text-xs text-red-500 font-medium mt-0.5">
            Eliminada el {formatFechaHora(presentacion.deletedAt)}
          </p>
        )}
      </div>

      {/* Observación */}
      {presentacion.observacion && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Observación</p>
          <p className="text-sm text-gray-700 line-clamp-2">{presentacion.observacion}</p>
        </div>
      )}

      {/* Acciones — solo si no está eliminada */}
      {!eliminada && (
        <div className="flex justify-end gap-1 pt-2 border-t border-gray-100">
          <ActionButton variant="info" onClick={() => onInfo(presentacion.id)} title="Ver información">
            <Info size={16} />
          </ActionButton>
          <ActionButton variant="edit" onClick={() => onEditar(presentacion.id)} title="Editar">
            <Pencil size={16} />
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => onDelete(presentacion.id)}
            disabled={presentacion.sistema}
            title="Eliminar"
          >
            <Trash size={16} />
          </ActionButton>
        </div>
      )}
    </div>
  );
}
