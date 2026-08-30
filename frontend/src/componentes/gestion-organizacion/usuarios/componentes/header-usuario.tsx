import { DollarSign, PlusCircle, Filter } from "lucide-react";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";

interface HeaderUsuariosProps {
  entidadesTotales: number;
  usuariosLength: number;
  handleImprimirTodo: () => void;
  handleImprimirPagina: () => void;
  paginaActual: number;
  openModal: () => void;
}

export const HeaderUsuarios = ({
  entidadesTotales,
  usuariosLength,
  handleImprimirTodo,
  handleImprimirPagina,
  paginaActual,
  openModal,
}: HeaderUsuariosProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-6">
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="consultar-icon" />
                    <span>Usuarios</span>
                  </CardTitle>

                  <EstadisticasSimples filtrados={entidadesTotales} mostrados={usuariosLength} />
                </div>
                <div className="flex items-center gap-2">
                  <ImpresionForm
                    entityName="Usuarios"
                    onImprimirTodo={handleImprimirTodo}
                    onImprimirPagina={handleImprimirPagina}
                    totalItems={entidadesTotales}
                    currentPage={paginaActual}
                  />
                </div>
              </CardHeader>
  );
};