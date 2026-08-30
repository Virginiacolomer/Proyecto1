import type { Marca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Info, Pencil, Trash } from "lucide-react";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { formatFechaHora } from "../../../herramientas/formateo-de-campos/fucion-formateo";


interface Props {
  marca: Marca;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DatosCards({ marca, onEditar, onInfo, onDelete }: Props) {
  const eliminada = !!marca.deletedAt;

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
          {marca.denominacion}
        </p>
        {eliminada && (
          <p className="text-xs text-red-500 font-medium mt-0.5">
            Eliminada el {formatFechaHora(marca.deletedAt)}
          </p>
        )}
      </div>

      {/* Observación */}
      {marca.observacion && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Observación</p>
          <p className="text-sm text-gray-700 line-clamp-2">{marca.observacion}</p>
        </div>
      )}

      {/* Acciones — solo si no está eliminada */}
      {!eliminada && (
        <div className="flex justify-end gap-1 pt-2 border-t border-gray-100">
          <ActionButton variant="info" onClick={() => onInfo(marca.id)} title="Ver información">
            <Info size={16} />
          </ActionButton>
          <ActionButton variant="edit" onClick={() => onEditar(marca.id)} title="Editar">
            <Pencil size={16} />
          </ActionButton>
          <ActionButton
            variant="delete"
            onClick={() => onDelete(marca.id)}
            disabled={marca.sistema}
            title="Eliminar"
          >
            <Trash size={16} />
          </ActionButton>
        </div>
      )}
    </div>
  );
}
