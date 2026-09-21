import { ConsultarProductosCambioPreciosMasivo } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { TablaAGGrid, Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";

// Solo lectura: el aumento se aplica a TODOS los productos que muestra la
// previsualización. No se pueden excluir filas sueltas porque el backend
// vuelve a calcular todo el alcance a partir de los filtros (Decisión #4).
type Props = {
  productos: ConsultarProductosCambioPreciosMasivo[];
  columns: Column<ConsultarProductosCambioPreciosMasivo>[];
};

export default function TablaCambioPrecios({ productos, columns }: Props) {
  return (
    <div className="overflow-x-auto">
      <TablaAGGrid
        columns={columns}
        data={productos}
        onUpdate={() => {}}
        actionsFlex={0}
        rowHeight={55}
        height={600}
      />
    </div>
  );
}
