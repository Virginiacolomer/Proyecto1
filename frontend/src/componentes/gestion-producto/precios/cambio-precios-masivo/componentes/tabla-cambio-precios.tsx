import { Trash } from "lucide-react";
import { ConsultarProductosCambioPreciosMasivo } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { TablaAGGrid,Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { Button } from "../../../../ui/Button";


type Props = {
  productos: ConsultarProductosCambioPreciosMasivo[];
  columns: Column<ConsultarProductosCambioPreciosMasivo>[];
  onEliminar: (productoId: number) => void;
};

export default function TablaCambioPrecios({
  productos,
  columns,
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
              onClick={() => onEliminar(row.productoId)}
              className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-800"
              title="Quitar de la previsualización"
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