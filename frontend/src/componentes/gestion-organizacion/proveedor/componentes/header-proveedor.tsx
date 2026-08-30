import { DollarSign, PlusCircle, Filter, User } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";

interface HeaderProveedoresProps {
  entidadesTotales: number;
  proveedoresLength: number;
  handleImprimirTodo: () => void;
  handleImprimirPagina: () => void;
  paginaActual: number;
  openModal: () => void;
}

export const HeaderProveedores = ({
  entidadesTotales,
  proveedoresLength,
  handleImprimirTodo,
  handleImprimirPagina,
  paginaActual,
  openModal,
}: HeaderProveedoresProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-6">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="consultar-icon w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Proveedores</span>
                  </CardTitle>

                  <EstadisticasSimples filtrados={entidadesTotales} mostrados={proveedoresLength} />
                </div>
                <div className="flex items-center gap-2">
                  <ImpresionForm
                    entityName="Proveedores"
                    onImprimirTodo={handleImprimirTodo}
                    onImprimirPagina={handleImprimirPagina}
                    totalItems={entidadesTotales}
                    currentPage={paginaActual}
                  />
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white flex items-center px-4 py-3"
                    onClick={openModal}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                  </Button>
                </div>
              </CardHeader>
  );
};