// components/ReferenciaProductoLegend.tsx
import { AlertTriangle, CheckCircle, Filter, Package, Star } from "lucide-react";
import { ConsultarProducto } from "../../../interfaces/gestion-producto/producto/interfaces-producto";
import { useConfiguracionSistema } from "../../sistema/ConfiguracionSistemaContext";

interface ReferenciaProductoProps {
  entidadesTotales: number;
  productos: ConsultarProducto[];
  estadisticas: boolean;
}

const ReferenciaProducto = ({ entidadesTotales, productos, estadisticas }: ReferenciaProductoProps) => {
  const productosConStock = productos.filter((p) => p.stock > 0).length;
  const productosSinStock = productos.filter((p) => p.stock <= 0).length;
  const { configuracion } = useConfiguracionSistema();

  return (
    <div className="space-y-0">
      {/* Sección de Referencias */}
      <div className="flex items-center justify-between gap-4 w-full flex-wrap">
        {/* Parte derecha: barra + porcentaje */}
        {productos.length > 0 && estadisticas === true && configuracion?.estadisticasProducto === true && (
          <div className="flex-1 flex items-center gap-3 min-w-[200px]">
            {/* Barra */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(productosConStock / productos.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Porcentaje */}
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {Math.round((productosConStock / productos.length) * 100)}% con stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-8 mb-4">
        <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <Star size={16} className="text-yellow-500" />
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Producto original</span>
        </div>

        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
          <Star size={16} className="text-red-500" />
          <span className="text-sm font-medium text-red-700 dark:text-red-300">Producto alternativo</span>
        </div>

        {/* Sección de Estadísticas */}
        {/* Total Productos */}
        {estadisticas === true && configuracion?.estadisticasProducto === true && (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-1 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {entidadesTotales.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-1 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Filter className="h-5 w-5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Filtrados
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {productos.length.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-1 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Con Stock
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {productosConStock.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-1 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500/10 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Sin Stock
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {productosSinStock.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferenciaProducto;
