import { DollarSign, PlusCircle, Filter, Tag } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { SelectContentUI, SelectItemUI, SelectTriggerUI, SelectUI, SelectValueUI } from "../../../ui/Select";
import { EstadoPresupuestoBusqueda } from "../../../../interfaces/gestion-venta/presupuesto-venta/interfaces-presupuesto-venta";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";

interface HeaderLgProps {
  entidadesTotales: number;
  datosLength: number;
  handleImprimirTodo: () => void;
  handleImprimirPagina: () => void;
  paginaActual: number;
  openModal: () => void;
}

export const HeaderLg = ({
  entidadesTotales,
  datosLength,
  handleImprimirTodo,
  handleImprimirPagina,
  paginaActual,
  openModal,
}: HeaderLgProps) => {
  return (
    <CardHeader className="items-center p-3 space-y-2">
      {/* Primera fila: Título y botón agregar */}
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Tag className="consultar-icon w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl font-semibold">Marcas</span>
        </CardTitle>
        

      </div>


      {/* <div className="flex items-center justify-between gap-3">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-sm"
          onClick={openModal}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
        
        <div className="flex-shrink-0">
          <ImpresionForm
            entityName="Presupuestos"
            onImprimirTodo={handleImprimirTodo}
            onImprimirPagina={handleImprimirPagina}
            totalItems={entidadesTotales}
            currentPage={paginaActual}
          />
        </div>
      </div> */}
    </CardHeader>
  );
};