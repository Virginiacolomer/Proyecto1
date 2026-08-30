import { DollarSign, PlusCircle, Filter, Tag } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";

interface HeaderProps {
  entidadesTotales: number;
  datosLength: number;
  handleImprimirTodo: () => void;
  handleImprimirPagina: () => void;
  paginaActual: number;
  openModal: () => void;
}

export const Header = ({
  entidadesTotales,
  datosLength,
  handleImprimirTodo,
  handleImprimirPagina,
  paginaActual,
  openModal,
}: HeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
      {/* Primera fila: Título y botón agregar */}
      <div className="flex items-center gap-6">
        <CardTitle className="flex items-center space-x-2">
          <Tag className="consultar-icon w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl font-semibold">Marcas</span>
        </CardTitle>

        <EstadisticasSimples filtrados={entidadesTotales} mostrados={datosLength} />
      </div>


     
        {/* Botón de impresión */}
        <div className="flex items-center gap-2">
          <ImpresionForm
            entityName="Marcas"
            onImprimirTodo={handleImprimirTodo}
            onImprimirPagina={handleImprimirPagina}
            totalItems={entidadesTotales}
            currentPage={paginaActual}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white flex items-center gap-1.5 px-3 py-2 rounded-lg shadow-sm"
            onClick={openModal}
          >
            <PlusCircle className="h-4 w-4" />

          </Button>
        </div>
     
    </CardHeader>
  );
};