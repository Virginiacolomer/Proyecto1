import { ClipboardList } from "lucide-react";
import { Button } from "../../ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/ToolTip";
import { useRef, useState } from "react";
import ConsultarProductosConFiltros from "./busqueda-producto";
import { ProductoSeleccionado } from "../../../interfaces/gestion-producto/producto/interfaces-producto";

import React from "react";
import { formatCantidades } from "../formateo-de-campos/fucion-formateo";
import { ModalPortal } from "../../../utils/modal-portal";
import { FiltrosComponentesProvider } from "../../../context/filtros-componentes-context";

export default function SeleccionProducto({
  camposHabilitados,
  onProductoSeleccionado,
  tipoDocumento,
}: {
  camposHabilitados?: boolean;
  onProductoSeleccionado: (productoSeleccionado: ProductoSeleccionado) => void;
  tipoDocumento: string;
}) {
  const [mostrarProductosFiltros, setMostrarProductosFiltros] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoSeleccionado>({} as ProductoSeleccionado);
  const [codigoProducto, setCodigoProducto] = useState("");

  const handleMostrarProductosFiltros = () => {
    setMostrarProductosFiltros(true);
  };

  const handleCerrarProductosFiltros = () => {
    setMostrarProductosFiltros(false);
  };

  const handleSeleccionarProducto = (producto: ProductoSeleccionado) => {
    setCodigoProducto(producto.codigoProveedor);
    setProductoSeleccionado(producto);
    onProductoSeleccionado(producto); // Llama a la función de callback con el producto seleccionado
    setMostrarProductosFiltros(false);
  };

  const nroPiezaRef = useRef<HTMLInputElement>(null);
  const buscarProductoRef = useRef<HTMLButtonElement>(null);
  const selectProductoRef = useRef<HTMLDivElement>(null);

  const handleEnterEnNroPieza = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Ejecutar clic del botón (si está presente)
      if (buscarProductoRef.current) {
        buscarProductoRef.current.click();
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        // Buscar el componente Select y abrirlo
        const selectDiv = selectProductoRef.current;
        if (selectDiv) {
          const input = selectDiv.querySelector("input");
          if (input) {
            input.focus();
            input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          }
        }
      }, 300); // Ajustá este delay según el tiempo de búsqueda, si es necesario
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-4 flex-wrap">
        {/* Label + Input de código */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Código</label>
          <input
            type="text"
            ref={nroPiezaRef}
            onKeyDown={handleEnterEnNroPieza}
            placeholder="Codigo"
            className="border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={codigoProducto}
            onChange={(e) => setCodigoProducto(e.target.value)}
            disabled={camposHabilitados === false}
          />
        </div>

        {/* Botón búsqueda avanzada con tooltip */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                ref={buscarProductoRef}
                variant="outline"
                size="icon"
                onClick={handleMostrarProductosFiltros}
                className="bg-blue-500 text-white hover:bg-blue-700 w-10 h-10 rounded-full shadow-md transition"
                disabled={camposHabilitados === false}
              >
                <ClipboardList size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-800 text-white p-2 rounded-md">Búsqueda Avanzada</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex flex-col space-y-1 min-w-[330px]">
          <label className="text-sm font-medium text-gray-700">Producto</label>
          <input
            type="text"
            className="border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm"
            value={productoSeleccionado?.denominacion || ""}
            onChange={() => {}}
            disabled
          />
        </div>

        <div className="flex flex-col space-y-1 min-w-[230px]">
          <label className="text-sm font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            className="border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm"
            value={productoSeleccionado.ubicacion || "NO TIENE"}
            onChange={() => {}}
            disabled
          />
        </div>

        <div className="flex flex-col space-y-1 min-w-[100px]">
          <label className="text-sm font-medium text-gray-700">Stock</label>
          <input
            type="text"
            className="w-[100px] border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm"
            value={formatCantidades(productoSeleccionado.stock ?? 0)}
            onChange={() => {}}
            disabled
          />
        </div>

        {/*  <div className="flex flex-col space-y-1 min-w-[100px]">
                <label className="text-sm font-medium text-gray-700">Precio sin IVA</label>
                <input
                    type="text"
                    className="w-[120px] border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm"
                    value={formatPrice(productoSeleccionado.precio ?? 0, "ARS")}
                    onChange={() => {}}
                    disabled
                />
            </div>

            <div className="flex flex-col space-y-1 w-[100px]">
                <label className="text-sm font-medium text-gray-700">Alícuota</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm"
                    value={formatPercentage(productoSeleccionado.alicuota ?? 0)}
                    onChange={() => {}}
                    disabled
                />
            </div>

            <div className="flex flex-col space-y-1 w-[120px]">
                <label className="text-sm font-medium text-gray-700">Precio con IVA</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 bg-white text-black rounded-lg px-3 py-2 text-sm"
                    value={formatPrice(productoSeleccionado.precioConIva ?? 0, "ARS")}
                    onChange={() => {}}
                    disabled
                />
            </div> */}
      </div>

      {/* Modal de selección de productos */}
      {mostrarProductosFiltros && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ModalPortal>
            <FiltrosComponentesProvider>
              <ConsultarProductosConFiltros
                tipoDocumento={tipoDocumento}
                codigoIngresado={codigoProducto}
                onSeleccionar={handleSeleccionarProducto}
                onCerrar={handleCerrarProductosFiltros}
              />
            </FiltrosComponentesProvider>
          </ModalPortal>
        </div>
      )}
    </div>
  );
}
