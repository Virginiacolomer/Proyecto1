import React, { ReactNode } from "react";
import { Card, CardContent } from "../../../ui/Card";
import { Package } from "lucide-react";

interface SeleccionProductoLayoutProps {
  tipoPrecioSelect: ReactNode;
  codigoInput: ReactNode;
  precioInput: ReactNode;
  extras?: ReactNode;
  infoProducto?: ReactNode;
  modal?: ReactNode;
}

const SeleccionProductoLayout: React.FC<SeleccionProductoLayoutProps> = ({
  tipoPrecioSelect,
  codigoInput,
  precioInput,
  extras,
  infoProducto,
  modal,
}) => {
  return (
    <>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="mb-1">
            <label className="label-base">
              <Package className="w-5 h-5 text-blue-600" />
              Datos del producto
            </label>
          </div>

          {/* Layout responsive */}
          <div className="
            flex flex-col gap-3
            md:flex-row md:items-end md:gap-4 md:flex-nowrap
          ">
            {/* Tipo de precio */}
            <div className="w-full md:min-w-[220px] md:w-auto">
              {tipoPrecioSelect}
            </div>

            {/* Código */}
            <div className="w-full md:w-auto">
              {codigoInput}
            </div>

            {/* Precio */}
            <div className="w-full md:w-auto">
              {precioInput}
            </div>

            {/* Extras */}
            {extras && (
              <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                {extras}
              </div>
            )}
          </div>

          {/* Info producto */}
          {infoProducto && (
            <>
              <div className="mt-3 border-t border-gray-200" />
              <div className="mt-2">{infoProducto}</div>
            </>
          )}
        </CardContent>
      </Card>

      {modal}
    </>
  );
};

export default SeleccionProductoLayout;
