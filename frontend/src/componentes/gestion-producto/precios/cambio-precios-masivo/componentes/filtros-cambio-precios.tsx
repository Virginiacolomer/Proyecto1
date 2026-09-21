import { Search, Package, Eye, Check, Eraser } from "lucide-react";
import { useState } from "react";
import Select from "react-select";
import { CardHeader, CardTitle } from "../../../../ui/Card";
import { Input } from "../../../../ui/Input";
import { Button } from "../../../../ui/Button";
import { TipoAjustePrecio } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";

type Props = {
  valoresFiltros: any;
  setValoresFiltros: any;
  marcas: any[];
  lineas: any[];
  productosLength: number;
  loading: boolean;
  onSimular: (tipoAjuste: TipoAjustePrecio, valor: number) => void;
  onAplicar: (motivo: string) => void;
  fetchMarcas: () => void;
  fetchLineas: () => void;
  onLimpiarFiltros: () => void;
};

export default function FiltrosCambioPrecios({
  valoresFiltros,
  setValoresFiltros,
  marcas,
  lineas,
  productosLength,
  loading,
  onSimular,
  onAplicar,
  fetchMarcas,
  fetchLineas,
  onLimpiarFiltros,
}: Props) {
  const [tipoAjuste, setTipoAjuste] = useState<TipoAjustePrecio>("PORCENTAJE");
  const [valor, setValor] = useState<number>(0);
  const [motivo, setMotivo] = useState<string>("");

  const etiquetaValor = tipoAjuste === "PORCENTAJE" ? "Porcentaje (%)" : "Monto fijo ($)";

  return (
    <CardHeader className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 w-full items-end">
        <CardTitle className="flex items-center space-x-2">
          <Package className="consultar-icon" />
          <span>Aumento masivo</span>
        </CardTitle>

        {/* Marca */}
        <div className="space-y-1 min-w-[220px]">
          <label className="text-xs font-medium text-gray-700">Marca (opcional)</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar marca..."
              className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500"
              value={valoresFiltros.denominacionMarca ?? ""}
              onKeyDown={(e) => e.key === "Enter" && fetchMarcas()}
              onChange={(e) =>
                setValoresFiltros({ ...valoresFiltros, denominacionMarca: e.target.value })
              }
            />
          </div>
          <Select
            value={(marcas ?? []).find((o) => o.id === valoresFiltros.marcaId) || null}
            options={marcas ?? []}
            getOptionLabel={(o) => o.denominacion}
            getOptionValue={(o) => String(o.id)}
            onChange={(o) => setValoresFiltros({ ...valoresFiltros, marcaId: o ? o.id : undefined })}
            placeholder="Todas las marcas"
            isClearable
            className="text-black"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
          />
        </div>

        {/* Línea */}
        <div className="space-y-1 min-w-[220px]">
          <label className="text-xs font-medium text-gray-700">Línea (opcional)</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar línea..."
              className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500"
              value={valoresFiltros.denominacionLinea ?? ""}
              onKeyDown={(e) => e.key === "Enter" && fetchLineas()}
              onChange={(e) =>
                setValoresFiltros({ ...valoresFiltros, denominacionLinea: e.target.value })
              }
            />
          </div>
          <Select
            value={(lineas ?? []).find((o) => o.id === valoresFiltros.lineaId) || null}
            options={lineas ?? []}
            getOptionLabel={(o) => o.denominacion}
            getOptionValue={(o) => String(o.id)}
            onChange={(o) => setValoresFiltros({ ...valoresFiltros, lineaId: o ? o.id : undefined })}
            placeholder="Todas las líneas"
            isClearable
            className="text-black"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
          />
        </div>

        {/* Tipo de ajuste + valor (Decisión #1) */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">Tipo de ajuste</label>
          <select
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-black"
            value={tipoAjuste}
            onChange={(e) => setTipoAjuste(e.target.value as TipoAjustePrecio)}
          >
            <option value="PORCENTAJE">Porcentaje</option>
            <option value="MONTO_FIJO">Monto fijo</option>
          </select>
        </div>

        <div className="space-y-1 w-32">
          <label className="text-xs font-medium text-gray-700">{etiquetaValor}</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            className="bg-white text-black"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button
            variant="outline"
            onClick={() => onSimular(tipoAjuste, valor)}
            disabled={valor <= 0 || loading}
            className="bg-blue-500 text-white hover:bg-blue-800"
            title="Previsualizar el aumento (no guarda nada todavía)"
          >
            <Eye className="w-4 h-4 mr-1" /> Simular
          </Button>

          <Button
            variant="outline"
            onClick={onLimpiarFiltros}
            className="bg-gray-500 text-white hover:bg-gray-700"
            title="Limpiar filtros"
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Motivo + confirmar (Decisión #8: obligatorio para aplicar) */}
      {productosLength > 0 && (
        <div className="flex flex-col md:flex-row gap-4 items-end border-t pt-4">
          <div className="space-y-1 flex-grow">
            <label className="text-xs font-medium text-gray-700">
              Motivo del aumento (obligatorio para confirmar)
            </label>
            <Input
              type="text"
              placeholder="Ej: actualización de lista de proveedor - septiembre 2026"
              className="bg-white text-black w-full"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => onAplicar(motivo)}
            disabled={motivo.trim().length < 5 || loading}
            className="bg-green-600 text-white hover:bg-green-800"
            title="Aplicar y guardar el aumento"
          >
            <Check className="w-4 h-4 mr-1" /> Aplicar cambios
          </Button>
        </div>
      )}
    </CardHeader>
  );
}
