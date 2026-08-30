import { Building2, Calendar, CheckCircle, FileText, Landmark, MapPin, Search, Tag, Truck } from "lucide-react";
import { useFiltrosContext } from "../../../context/filtros-contesxt";

const FiltrosAplicados = () => {
  const { valoresFiltros, busquedaRapida } = useFiltrosContext();

  return (
    <div className="hidden lg:flex flex-wrap items-center gap-4 mb-2">
      {/* Título de sección */}
      <span className="text-sm font-semibold text-muted-foreground">Filtros aplicados:</span>

      {busquedaRapida && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
          <Search size={16} className="text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-700 dark:text-red-300">Busqueda Rapida</span>
        </div>
      )}

      {!busquedaRapida && (
        <>
          {/* Filtro: Codigo */}
          {valoresFiltros.codigoProveedor && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
              <Search size={16} className="text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Codigo</span>
            </div>
          )}

          {/* Filtro: Denominacion */}
          {valoresFiltros.denominacion && (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
              <FileText size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Denominación</span>
            </div>
          )}

          {/* Filtro: En stock */}
          {valoresFiltros.conStock === true && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">En stock</span>
            </div>
          )}

          {/* Filtro: Marca */}
          {valoresFiltros.marcaId && (
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Tag size={16} className="text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Marca</span>
            </div>
          )}

          {/* Filtro: Linea */}
          {valoresFiltros.lineaId && (
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800">
              <Building2 size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Linea</span>
            </div>
          )}

          {/* Filtro: Fecha Desde */}
          {valoresFiltros.fechaDesde && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
              <Calendar size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Fecha Desde</span>
            </div>
          )}

          {/* Filtro: Fecha Hasta */}
          {valoresFiltros.fechaHasta && (
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Calendar size={16} className="text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Fecha Hasta</span>
            </div>
          )}

          {/* Filtro: Cliente */}
          {valoresFiltros.clienteId && (
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800">
              <Truck size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Cliente</span>
            </div>
          )}

          {/* Filtro: Condicion Iva */}
          {valoresFiltros.condicionIvaId && (
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <FileText size={16} className="text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Condición Iva</span>
            </div>
          )}

          {/* Filtro: Provincia */}
          {valoresFiltros.provinciaId && (
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <MapPin size={16} className="text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Provincia</span>
            </div>
          )}

          {/* Filtro: Familia Banco */}
          {valoresFiltros.familiaBancoId && (
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Landmark size={16} className="text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Familia Banco</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FiltrosAplicados;
