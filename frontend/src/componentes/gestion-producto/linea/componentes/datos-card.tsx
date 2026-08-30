import type { Linea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import { Info, Pencil, Trash } from "lucide-react";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { formatFechaHora } from "../../../herramientas/formateo-de-campos/fucion-formateo";

interface Props {
  linea: Linea;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DatosCards({ linea, onEditar, onInfo, onDelete }: Props) {
  const eliminada = !!linea.deletedAt;

  return (
    <div
      className={`border rounded-md px-3 py-3 ${
        eliminada
          ? "border-gray-200 bg-gray-100 dark:bg-slate-800 opacity-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="mb-2">
        <p className="text-xs text-gray-500">Denominación</p>
        <p className="text-sm font-medium text-gray-800 line-clamp-2">{linea.denominacion}</p>
        {eliminada && (
          <p className="text-xs text-red-500 font-medium mt-0.5">
            Eliminada el {formatFechaHora(linea.deletedAt)}
          </p>
        )}
      </div>

      {linea.observacion && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Observación</p>
          <p className="text-sm text-gray-700 line-clamp-2">{linea.observacion}</p>
        </div>
      )}

      {!eliminada && (
        <div className="flex justify-end gap-1 pt-2 border-t border-gray-100">
          <ActionButton variant="info" onClick={() => onInfo(linea.id)} title="Ver información">
            <Info size={16} />
          </ActionButton>
          <ActionButton variant="edit" onClick={() => onEditar(linea.id)} title="Editar">
            <Pencil size={16} />
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => onDelete(linea.id)}
            disabled={linea.sistema}
            title="Eliminar"
          >
            <Trash size={16} />
          </ActionButton>
        </div>
      )}
    </div>
  );
}
