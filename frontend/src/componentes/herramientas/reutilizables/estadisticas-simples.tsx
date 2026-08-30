import { Filter, Package } from "lucide-react";

export function EstadisticasSimples({ filtrados, mostrados }: { filtrados: number; mostrados: number }) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-500/10 p-2 rounded-lg">
          <Package className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Filtrados</p>
          <p className="text-yl font-bold text-gray-900 dark:text-white">{filtrados.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="bg-purple-500/10 p-2 rounded-lg">
          <Filter className="h-5 w-5 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Mostrados</p>
          <p className="text-l font-bold text-gray-900 dark:text-white">{mostrados.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
