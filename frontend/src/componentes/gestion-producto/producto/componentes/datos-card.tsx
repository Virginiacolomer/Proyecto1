import { Bell } from "lucide-react";
import type { ConsultarProducto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";
import { ActionButton } from "../../../herramientas/reutilizables/action-button";
import { ProductoActions } from "./producto-action";


interface Props {
  producto: ConsultarProducto;

  onEditar: (id: number) => void;
  onInfo: (id: number) => void;
  onDelete: (id: number) => void;
  onMovimientos: (id: number) => void;
  onCambioPrecios: (id: number) => void;
  onHistorial: (id: number) => void;
  onNotificar?: (producto: ConsultarProducto) => void;
}

export function DatosCard({
  producto,
  onEditar,
  onInfo,
  onDelete,
  onMovimientos,
  onCambioPrecios,
  onHistorial,
  onNotificar,
}: Props) {
  return (
    <div className="border border-gray-200 rounded-md bg-white px-3 py-3">
      {/* Denominación */}
      <div className="mb-2">
        <p className="text-xs text-gray-500">Denominación</p>
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          {producto.denominacion}
        </p>
      </div>

      {/* Proveedor */}
{/*       <div className="mb-2">
        <p className="text-xs text-gray-500">Proveedor</p>
        <p className="text-sm text-gray-700 truncate">
          {producto.proveedor}
        </p>
      </div> */}

      {/* Códigos */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <p className="text-xs text-gray-500">Código</p>
          <p className="text-sm text-gray-700 truncate">
            {producto.codigoProveedor}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Stock</p>
          <p
            className={`text-sm font-medium ${
              producto.stock < 0 ? "text-red-600" : "text-gray-800"
            }`}
          >
            {producto.stock}
          </p>
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500">Precio Ocasional</p>
          <p className="text-sm font-semibold text-gray-800">
            ${formatPrice(producto.precioOcasionalConIva)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Precio Cliente</p>
          <p className="text-sm font-semibold text-gray-800">
            ${formatPrice(producto.precioClienteConIva)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Precio Mayorista</p>
          <p className="text-sm font-semibold text-gray-800">
            ${formatPrice(producto.precioMayoristaConIva)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Precio Oferta</p>
          <p className="text-sm font-semibold text-gray-800">
            ${formatPrice(producto.precioOfertaConIva)}
          </p>
        </div>
      </div>

      {/* Observación */}
      {producto.observacion && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">Observación</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {producto.observacion}
          </p>
        </div>
      )}

      {onNotificar && (
        <ActionButton
          variant="info"
          title="Enviar notificación"
          onClick={() => onNotificar(producto)}
        >
          <Bell size={16} />
        </ActionButton>
      )}

      {/* Acciones por el momento las ocultamos del celular */}
      {/* <div className="bg-gray-50 px-2 py-2 border-t border-gray-200">
      <div className="flex justify-center gap-1">
        <ProductoActions
          producto={producto}
          onEditar={onEditar}
          onInfo={onInfo}
          onDelete={onDelete}
          onMovimientos={onMovimientos}
          onCambioPrecios={onCambioPrecios}
          onHistorial={onHistorial}
          compact
        />
      </div> 
  </div>*/}
    </div>
  );
}
