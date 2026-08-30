import { Info, Pencil, Trash } from "lucide-react";
import { TablaAGGrid, type Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import {
  denominacionNotScrollColumnProps,
  observacionesColumnProps,
} from "../../../herramientas/tablas/formateo-columnas-documentos";
import type { IConsultarPersonal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";

interface Props {
  personales: IConsultarPersonal[];
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DatosTabla({ personales, onEditar, onInfo, onDelete }: Props) {
  const columns: Column<IConsultarPersonal>[] = [
    {
      header: "Denominación",
      accessor: "denominacion",
      ...denominacionNotScrollColumnProps,
    },
    {
      header: "Observación",
      accessor: "observacion",
      ...observacionesColumnProps,
    },
  ];

  return (
    <TablaAGGrid
      columns={columns}
      data={personales}
      actions={(row: IConsultarPersonal) => (
        <div className="flex justify-end gap-1">
          <ActionButton variant="info" title="Ver información" onClick={() => onInfo(row.id)}>
            <Info size={16} />
          </ActionButton>
          <ActionButton variant="edit" title="Editar" onClick={() => onEditar(row.id)}>
            <Pencil size={16} />
          </ActionButton>
          <ActionButton
            variant="delete"
            title="Eliminar"
            disabled={(row as any).sistema}
            onClick={() => onDelete(row.id)}
          >
            <Trash size={16} />
          </ActionButton>
        </div>
      )}
      actionsFlex={0.5}
      rowHeight={60}
    />
  );
}
