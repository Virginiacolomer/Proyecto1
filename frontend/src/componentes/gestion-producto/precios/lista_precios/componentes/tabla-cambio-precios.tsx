import { Pencil, Trash } from "lucide-react";
import { ConsultarProductosCambioPreciosMasivo, ConsultarProductosListaPrecios } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { TablaAGGrid,Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { Button } from "../../../../ui/Button";


type Props = {
  productos: ConsultarProductosListaPrecios[];
  columns: Column<ConsultarProductosListaPrecios>[];
};

export default function TablaCambioPrecios({
  productos,
  columns,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <TablaAGGrid
        columns={columns}
        data={productos}
        onUpdate={() => {}}
        actionsFlex={0.5}
        actionsScrollable={false}
        rowHeight={55}
        height={600}
      />
    </div>
  );
}