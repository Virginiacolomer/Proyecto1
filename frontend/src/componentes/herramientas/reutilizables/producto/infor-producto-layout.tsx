import React from "react";
import { useAtom } from "jotai";
import { productoSeleccionadoAtom } from "../../../../context/factura-venta-context";
import { formatCantidades } from "../../formateo-de-campos/fucion-formateo";

const InfoProducto: React.FC = () => {
  const [productoSeleccionado] = useAtom(productoSeleccionadoAtom);

  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
      <span>
        <strong>Producto:</strong>{" "}
        {productoSeleccionado.denominacion || "NO TIENE"}
      </span>

      <span>
        <strong>Ubicación:</strong>{" "}
        {productoSeleccionado.ubicacion || "NO TIENE"}
      </span>

      <span>
        <strong>Stock:</strong>{" "}
        {formatCantidades(productoSeleccionado.stock ?? 0)}
      </span>

      {productoSeleccionado.utilizaPack && (
        <span>
          <strong>Cantidad Pack:</strong>{" "}
          {formatCantidades(productoSeleccionado.cantidadPorPack ?? 0)}
        </span>
      )}

      {productoSeleccionado.oferta && (
        <span>
          <strong>En Oferta:</strong>{" "}
          {formatCantidades(productoSeleccionado.cantidadOferta ?? 0)}
        </span>
      )}
    </div>
  );
};

export default InfoProducto;