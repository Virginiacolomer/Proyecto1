import { DollarSign, Package, PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../ui/Button";
import { CardHeader, CardTitle } from "../../../ui/Card";
import { Input } from "../../../ui/Input";
import { EstadisticasSimples } from "../../../herramientas/reutilizables/estadisticas-simples";
import { ImpresionForm } from "../../../herramientas/reutilizables/impresion-form";
import { puedeActualizarPreciosMasivo, puedeAgregarProducto } from "../domain/permisos-producto";

interface Props {
  roles:number[];
  codigo: string;
  exacto: boolean;
  onChangeCodigo: (value: string) => void;
  onChangeExacto: (value: boolean) => void;
  onBuscarRapido: () => void;
  onNuevo: () => void;
  total: number;
  mostrados: number;
  paginaActual: number;
  onImprimirTodo: () => void;
  onImprimirPagina: () => void;
}

export function ProductosHeader({
  roles,
  codigo,
  exacto,
  onChangeCodigo,
  onChangeExacto,
  onBuscarRapido,
  onNuevo,
  total,
  mostrados,
  paginaActual,
  onImprimirTodo,
  onImprimirPagina,
}: Props) {
  const navigate = useNavigate();

  return (
    <CardHeader className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full">
        <CardTitle className="flex items-center gap-2">
          <Package className="consultar-icon" />
          <span>Productos</span>
        </CardTitle>

        {/* Buscador rápido */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={codigo}
              placeholder="Código..."
              className="text-black pl-10"
              onChange={(e) => onChangeCodigo(e.target.value)}
             // onKeyDown={(e) => e.key === "Enter" && onBuscarRapido()}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={exacto}
              onChange={(e) => onChangeExacto(e.target.checked)}
            />
            Exacto
          </label>
        </div>

        <EstadisticasSimples filtrados={total} mostrados={mostrados} />
      </div>

      <div className="flex gap-2">
        {puedeActualizarPreciosMasivo(roles) && (
          <Button
            onClick={() => navigate("/admin/cambio-precios-masivo")}
            className="bg-green-600 hover:bg-green-700 text-white"
            title="Aumentar precios por porcentaje o monto fijo"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Actualización masiva de precios
          </Button>
        )}
        <ImpresionForm
          entityName="Productos"
          onImprimirTodo={onImprimirTodo}
          onImprimirPagina={onImprimirPagina}
          totalItems={total}
          currentPage={paginaActual}
        />
        {puedeAgregarProducto(roles) && (
           <Button onClick={onNuevo} className="bg-blue-500 hover:bg-blue-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir
        </Button>
        )}
      </div>
    </CardHeader>
  );
}
