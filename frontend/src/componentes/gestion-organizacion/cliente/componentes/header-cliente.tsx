import { DollarSign, PlusCircle, Filter, User } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";
import { puedeAgregar } from "../domain/permisos-clientes";

interface HeaderClientesProps {
  entidadesTotales: number;
  roles: number[];
  clientesLength: number;
  handleImprimirTodo: () => void;
  handleImprimirPagina: () => void;
  paginaActual: number;
  openModal: () => void;
}

export const HeaderClientes = ({
  entidadesTotales,
  roles,
  clientesLength,
  handleImprimirTodo,
  handleImprimirPagina,
  paginaActual,
  openModal,
}: HeaderClientesProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-6">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="consultar-icon w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Clientes</span>
                  </CardTitle>

                  <EstadisticasSimples filtrados={entidadesTotales} mostrados={clientesLength} />
                </div>
                <div className="flex items-center gap-2">
                  <ImpresionForm
                    entityName="Clientes"
                    onImprimirTodo={handleImprimirTodo}
                    onImprimirPagina={handleImprimirPagina}
                    totalItems={entidadesTotales}
                    currentPage={paginaActual}
                  />
                  {puedeAgregar(roles) && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white flex items-center px-4 py-3"
                    onClick={openModal}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                  </Button>
                  )}
                </div>
              </CardHeader>
  );
};