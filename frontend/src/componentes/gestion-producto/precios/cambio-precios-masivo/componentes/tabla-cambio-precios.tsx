import { Pencil, Trash } from "lucide-react";
import { ConsultarProductosCambioPreciosMasivo } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { TablaAGGrid,Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { Button } from "../../../../ui/Button";


type Props = {
  productos: ConsultarProductosCambioPreciosMasivo[];
  columns: Column<ConsultarProductosCambioPreciosMasivo>[];
  onEditar: (producto: ConsultarProductosCambioPreciosMasivo) => void;
  onEliminar: (id: number) => void;
};

export default function TablaCambioPrecios({
  productos,
  columns,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <TablaAGGrid
        columns={columns}
        data={productos}
        onUpdate={() => {}}
        actions={(row: any) => (
          <div className="flex justify-end space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditar(row)}
              className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
              title="Actualizar producto"
            >
              <Pencil size={18} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEliminar(row.id)}
              className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-800"
              title="Eliminar producto"
            >
              <Trash size={18} />
            </Button>
          </div>
        )}
        actionsFlex={0.5}
        actionsScrollable={false}
        rowHeight={55}
        height={600}
      />
    </div>
  );
}