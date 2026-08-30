import { CircleDollarSign, Info, Pencil, Trash } from "lucide-react";
import { Button } from "../../../ui/Button";
import { TablaAGGrid, Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";
import { ConsultarUsuario } from "../../../../interfaces/gestion-usuario/interfaces-usuario";



type Props = {
  usuarios: ConsultarUsuario[];
  onEditar: (id: number) => void;
  onAuditoria: (id: number) => void;
  onEliminar: (id: number) => void;
  columns: Column<ConsultarUsuario>[];
};

export function UsuariosTabla({
  usuarios,
  onEditar,
  onAuditoria,
  onEliminar,
  columns
}: Props) {
 

  return (
    <TablaAGGrid
      columns={columns}
      data={usuarios}
      actions={(row) => (
        <div className="flex gap-2 justify-end">
          <Button onClick={() => onEditar(row.id)}><Pencil size={16} /></Button>
          <Button onClick={() => onAuditoria(row.id)}><Info size={16} /></Button>
          <Button onClick={() => onEliminar(row.id)} disabled>
            <Trash size={16} />
          </Button>
        </div>
      )}
      actionsFlex={0}
    />
  );
}
