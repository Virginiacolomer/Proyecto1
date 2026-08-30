import { DollarSign, PlusCircle, Filter, User } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { puedeAgregar } from "../domain/permisos-clientes";

interface HeaderClienteLgProps {
  entidadesTotales: number;
  roles: number[];
  clientesLength: number;
  handleImprimirTodo: () => void;
  handleImprimirPagina: () => void;
  paginaActual: number;
  openModal: () => void;
}

export const HeaderClienteLg = ({
  
  entidadesTotales,
  roles,
  clientesLength,
  handleImprimirTodo,
  handleImprimirPagina,
  paginaActual,
  openModal,
}: HeaderClienteLgProps) => {
  return (
    <CardHeader className="items-center p-3 space-y-2">
      {/* Primera fila: Título y botón agregar */}
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <User className="consultar-icon w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl font-semibold">Clientes</span>
        </CardTitle>
        

      </div>

<div className="flex items-center justify-between gap-3">
        {puedeAgregar(roles) && (<Button
          className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-sm"
          onClick={openModal}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>)}
        
        {/* Botón de impresión */}
        <div className="flex-shrink-0">
          <ImpresionForm
            entityName="Clientes"
            onImprimirTodo={handleImprimirTodo}
            onImprimirPagina={handleImprimirPagina}
            totalItems={entidadesTotales}
            currentPage={paginaActual}
          />
        </div>
      </div>
    </CardHeader>
  );
};