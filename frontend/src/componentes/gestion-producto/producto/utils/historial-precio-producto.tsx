import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../ui/Card";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import { History, ArrowRight } from "lucide-react";
import ProductoService from "../services/producto-service";
import { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { formatPrice, formatFechaHora } from "../../../herramientas/formateo-de-campos/fucion-formateo";

interface HistorialPrecioDto {
  id: number;
  precioAnterior: number;
  precioNuevo: number;
  motivo: string;
  fecha: string;
}

interface Props {
  producto: Producto;
  onClose: () => void;
}

export default function HistorialPrecioProducto({ producto, onClose }: Props) {
  const [historial, setHistorial] = useState<HistorialPrecioDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductoService.obtenerHistorialPrecios(producto.id);
        setHistorial(data);
      } catch (err: any) {
        console.error("Error al obtener el historial de precios:", err);
        setError("Ocurrió un error al cargar el historial de precios.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [producto.id]);

  return (
    <Card className="w-full max-w-3xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden relative mt-10 mb-12">
      <EncabezadoFormularios
        title="Historial de Precios"
        subtitle={`Producto: ${producto.denominacion}`}
        icon={<History className="form-icon" />}
        onClose={onClose}
      />
      <CardContent className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500">Cargando historial...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : historial.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <History size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">Este producto aún no tiene modificaciones de precio.</p>
            <p className="text-gray-400 text-sm mt-1">Los cambios se registrarán aquí cuando actualices su precio.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historial.map((registro) => (
              <div
                key={registro.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all hover:bg-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                    {formatFechaHora(registro.fecha)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 my-3">
                  <div className="flex-1 bg-white border border-gray-200 rounded p-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">Precio Anterior</p>
                    <p className="text-lg font-semibold text-gray-600 line-through decoration-red-400">
                      ${formatPrice(registro.precioAnterior)}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <ArrowRight size={20} />
                  </div>
                  
                  <div className="flex-1 bg-white border border-emerald-100 rounded p-2 text-center shadow-sm">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Precio Nuevo</p>
                    <p className="text-lg font-bold text-emerald-700">
                      ${formatPrice(registro.precioNuevo)}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Motivo</p>
                  <p className="text-sm text-gray-700 bg-white border border-gray-100 p-2 rounded">
                    {registro.motivo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
