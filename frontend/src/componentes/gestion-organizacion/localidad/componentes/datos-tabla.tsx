import { Info, Pencil, Trash } from "lucide-react";
import { TablaAGGrid, type Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { denominacionNotScrollColumnProps } from "../../../herramientas/tablas/formateo-columnas-documentos";
import type { Localidad } from "../../../../interfaces/gestion-organizacion/localidad/interfaces-localidad";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { formatFechaHora } from "../../../herramientas/formateo-de-campos/fucion-formateo";

interface Props {
  localidades: Localidad[];
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DatosTabla({ localidades, onEditar, onInfo, onDelete }: Props) {
  const columns: Column<Localidad>[] = [
    {
      header: "Denominación",
      accessor: "denominacion",
      ...denominacionNotScrollColumnProps,
      formatFunction: ({ value, row }) => (
        <div className="flex flex-col">
          <span>{value}</span>
          {row.deletedAt && (
            <span className="text-xs text-red-500 font-medium">
              Eliminada el {formatFechaHora(row.deletedAt)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Provincia",
      accessor: "provincia",
      flex: 1,
      type: "text",
      editable: false,
      formatFunction: ({ value }) => <span>{value?.denominacion ?? ""}</span>,
    },
  ];

  return (
    <TablaAGGrid
      columns={columns}
      data={localidades}
      getRowClass={(params: any) =>
        params.data?.deletedAt ? "opacity-50 bg-gray-100 dark:bg-slate-800 pointer-events-none" : ""
      }
      actions={(row: Localidad) => {
        if (row.deletedAt) return <div className="w-full" />;

        return (
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
              disabled={row.sistema}
              onClick={() => onDelete(row.id)}
            >
              <Trash size={16} />
            </ActionButton>
          </div>
        );
      }}
      actionsFlex={0.5}
      rowHeight={60}
    />
  );
}
