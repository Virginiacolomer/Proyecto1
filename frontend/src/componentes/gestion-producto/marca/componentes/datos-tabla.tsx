import { Info, Pencil, Trash } from "lucide-react";
import { TablaAGGrid, type Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import {
  denominacionNotScrollColumnProps,
  observacionesColumnProps,
} from "../../../herramientas/tablas/formateo-columnas-documentos";
import type { Marca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { formatFechaHora } from "../../../herramientas/formateo-de-campos/fucion-formateo";


interface Props {
  marcas: Marca[];
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DatosTabla({ marcas, onEditar, onInfo, onDelete }: Props) {
  const columns: Column<Marca>[] = [
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
      header: "Observación",
      accessor: "observacion",
      ...observacionesColumnProps,
    },
  ];

  return (
    <TablaAGGrid
      columns={columns}
      data={marcas}
      getRowClass={(params: any) =>
        params.data?.deletedAt ? "opacity-50 bg-gray-100 dark:bg-slate-800 pointer-events-none" : ""
      }
      actions={(row: Marca) => {
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
