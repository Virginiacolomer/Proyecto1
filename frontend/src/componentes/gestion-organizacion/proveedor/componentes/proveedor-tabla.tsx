import { CircleDollarSign, Info, Pencil, Trash } from "lucide-react";
import { Button } from "../../../ui/Button";
import { TablaAGGrid, Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";
import { ConsultarProveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";

type Props = {
  proveedores: ConsultarProveedor[];
  onEditar: (id: number) => void;
  onEliminar: (id: number) => void;
  columns: Column<ConsultarProveedor>[];
};

export function ProveedoresTabla({
  proveedores,
  onEditar,
  onEliminar,
  columns
}: Props) {
 

  return (
    <TablaAGGrid
      columns={columns}
      data={proveedores}
      actions={(row) => (
        <div className="flex gap-2 justify-end">
          <Button onClick={() => onEditar(row.id)}><Pencil size={16} /></Button>
          <Button onClick={() => onEliminar(row.id)} disabled>
            <Trash size={16} />
          </Button>
        </div>
      )}
      actionsFlex={0}
    />
  );
}
