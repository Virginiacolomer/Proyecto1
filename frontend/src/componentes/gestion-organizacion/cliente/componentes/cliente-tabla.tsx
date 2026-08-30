import { CircleDollarSign, Info, Pencil, Trash } from "lucide-react";
import { Button } from "../../../ui/Button";
import { TablaAGGrid, Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { ConsultarCliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";

type Props = {
  clientes: ConsultarCliente[];
  onEditar: (id: number) => void;
  onMovimientos: (id: number) => void;
  onAuditoria: (id: number) => void;
  onEliminar: (id: number) => void;
  columns: Column<ConsultarCliente>[];
  
};

export function ClientesTabla({
  clientes,
  onEditar,
  onEliminar,
  columns
}: Props) {
 

  return (
    <TablaAGGrid
      columns={columns}
      data={clientes}
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
