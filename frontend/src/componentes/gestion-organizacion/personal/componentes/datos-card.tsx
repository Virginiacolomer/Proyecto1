import type { IConsultarPersonal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";
import { Info, Pencil, Trash } from "lucide-react";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";

interface Props {
  personal: IConsultarPersonal;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DatosCards({ personal, onEditar, onInfo, onDelete }: Props) {
  return (
    <div className="border border-gray-200 rounded-md bg-white px-3 py-3">
      <div className="mb-2">
        <p className="text-xs text-gray-500">Denominación</p>
        <p className="text-sm font-medium text-gray-800 line-clamp-2">{personal.denominacion}</p>
      </div>

      {personal.observacion && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Observación</p>
          <p className="text-sm text-gray-700 line-clamp-2">{personal.observacion}</p>
        </div>
      )}

      <div className="flex justify-end gap-1 pt-2 border-t border-gray-100">
        <ActionButton variant="info" onClick={() => onInfo(personal.id)} title="Ver información">
          <Info size={16} />
        </ActionButton>
        <ActionButton variant="edit" onClick={() => onEditar(personal.id)} title="Editar">
          <Pencil size={16} />
        </ActionButton>
        <ActionButton
          variant="delete"
          onClick={() => onDelete(personal.id)}
          disabled={(personal as any).sistema}
          title="Eliminar"
        >
          <Trash size={16} />
        </ActionButton>
      </div>
    </div>
  );
}
