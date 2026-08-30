import { Column, TablaAGGrid } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { ConsultarProducto, Producto} from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { Info, Pencil, Trash } from "lucide-react";
import { ProductoActions } from "./producto-action";

interface Props {
  productos: ConsultarProducto[];
  columns: Column<ConsultarProducto>[];
  puedeAccionar: boolean;
  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
  
}

export function DatosTabla({
  productos,
  columns,
  puedeAccionar,
  onEditar,
  onInfo,
  onDelete,
  ...actions
}: Props) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <TablaAGGrid
        columns={columns}
        data={productos}
        actions={
          puedeAccionar
            ? (row) => (
                <ProductoActions
                  producto={row}
                  onEditar={onEditar}
                  onInfo={onInfo}
                  onDelete={onDelete}
                />
              )
            : undefined
        }
        actionsFlex={0.5}
        rowHeight={55}
      />
    </div>
  );
}
