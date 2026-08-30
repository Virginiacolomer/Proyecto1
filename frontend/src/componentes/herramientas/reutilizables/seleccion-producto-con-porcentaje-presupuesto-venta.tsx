import { ClipboardList } from "lucide-react";
import { Button } from "../../ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/ToolTip";
import { useEffect, useRef, useState } from "react";
import ConsultarProductosConFiltros from "./busqueda-producto";
import { ProductoSeleccionado } from "../../../interfaces/gestion-producto/producto/interfaces-producto";
import Select from "react-select";
import * as yup from "yup";
import React from "react";
import { TipoPrecio } from "../../../interfaces/generales/interfaces-generales";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { formatCantidades } from "../formateo-de-campos/fucion-formateo";
import PriceInput from "../formateo-de-campos/price-input";
import { ModalPortal } from "../../../utils/modal-portal";
import PresupuestoVentaService from "../../gestion-venta/presupuesto-venta/services/presupuesto-venta-service";
import FormInput from "../formateo-de-campos/form-input";
import { FiltrosComponentesProvider } from "../../../context/filtros-componentes-context";
import { useAtom } from "jotai";
import { productoSeleccionadoAtom, tipoPrecioSeleccionadoAtom } from "../../../context/factura-venta-context";
import SeleccionProductoLayout from "./producto/seleccion-producto-layout";
import TipoPrecioSelect from "./producto/tipo-precio-select";
import InfoProducto from "./producto/infor-producto-layout";
import CodigoProductoSelector from "./producto/codigo-producto-selector";

interface FormValuesSeleccionProductoConPorcentaje {
  precioConIva: number;
  precioOpcional?: number;
  observacionOpcional?: string;
}

const schemaSeleccionProductoConPorcentaje = yup.object().shape({
  precioConIva: yup.number().typeError("El precio sin IVA es obligatorio").required("El precio sin IVA es obligatorio"),
  precioOpcional: yup.number().optional(),
  observacionOpcional: yup.string().optional(),
});

export interface PrecioYAjuste {
  precioConIva: number;
  precioOpcional?: number;
  observacionOpcional?: string;
}

export default function SeleccionProductoConPorcentajePresupuestoVenta({
  camposHabilitados,
  onProductoSeleccionado,
  tipoDocumento,
  onTipoPrecio,
  onPrecioYAjuste,
}: {
  camposHabilitados?: boolean;
  onProductoSeleccionado: (productoSeleccionado: ProductoSeleccionado) => void;
  tipoDocumento: string;
  onTipoPrecio: (tipoPrecio: string) => void;
  onPrecioYAjuste: (precioYAjuste: PrecioYAjuste) => void;
}) {
  //const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoSeleccionado>({} as ProductoSeleccionado);
  const [productoSeleccionado, setProductoSeleccionado] = useAtom(productoSeleccionadoAtom)

  const [precioYAjuste, setPrecioYAjuste] = useState<PrecioYAjuste>({} as PrecioYAjuste);

  const methods = useForm<FormValuesSeleccionProductoConPorcentaje>({
    resolver: yupResolver(schemaSeleccionProductoConPorcentaje),
    defaultValues: {},
  });

  const {
    handleSubmit,
    watch,
    setValue,
  } = methods;

  const token = localStorage.getItem("Token");
  const empresaId = token ? jwtDecode<{ empresaId: number }>(token).empresaId : 0;

  const [mostrarProductosFiltros, setMostrarProductosFiltros] = useState(false);
  const [codigoProducto, setCodigoProducto] = useState("");

  //const [tipoPrecioSeleccionado, setTipoPrecioSeleccionado] = useState<string>(TipoPrecio.OCASIONAL);
  const [tipoPrecioSeleccionado, setTipoPrecioSeleccionado] = useAtom(tipoPrecioSeleccionadoAtom);

  const precioTotalSinIvaRef = useRef<HTMLInputElement>(null);
  const precioSinIvaRef = useRef<HTMLInputElement>(null);

  console.log("Producto seleccionado:", productoSeleccionado);

  const precioConIva = watch("precioConIva") || 0;
  const precioOpcional = watch("precioOpcional") || 0;
  const observacionOpcional = watch("observacionOpcional") || "";


  useEffect(() => {
    // limpiar producto global
    setProductoSeleccionado({} as ProductoSeleccionado);

    // limpiar formulario
    methods.reset({
      precioConIva: 0,
      precioOpcional: 0,
      observacionOpcional: "",
    });

    // limpiar código
    setCodigoProducto("");

  }, []);

  useEffect(() => {

    setProductoSeleccionado({} as ProductoSeleccionado);

    setTipoPrecioSeleccionado(TipoPrecio.OCASIONAL);

    methods.reset({
      precioConIva: 0,
      precioOpcional: 0,
      observacionOpcional: "",
    });

    setCodigoProducto("");

  }, []);

  useEffect(() => {
  let nuevoPrecio = 0;

  switch (tipoPrecioSeleccionado) {
    case TipoPrecio.OCASIONAL:
      nuevoPrecio = productoSeleccionado.precioOcasionalConIva || 0;
      break;

    case TipoPrecio.MAYORISTA:
      nuevoPrecio = productoSeleccionado.precioMayoristaConIva || 0;
      break;

    case TipoPrecio.CLIENTE:
      nuevoPrecio = productoSeleccionado.precioClienteConIva || 0;
      break;

    case TipoPrecio.OFERTA:
      nuevoPrecio = productoSeleccionado.precioOfertaConIva || 0;
      break;
  }

  setValue("precioConIva", nuevoPrecio);

  setPrecioYAjuste({
    precioConIva: nuevoPrecio,
    precioOpcional,
    observacionOpcional,
  });

}, [productoSeleccionado, tipoPrecioSeleccionado]);

  useEffect(() => {
    setPrecioYAjuste({
      precioConIva,
      precioOpcional,
      observacionOpcional
    });
  }, [precioConIva, precioOpcional, observacionOpcional]);

  useEffect(() => {
    onPrecioYAjuste?.(precioYAjuste);
  }, [precioYAjuste]);


  useEffect(() => {
    if (onTipoPrecio) {
      onTipoPrecio(tipoPrecioSeleccionado);
    }
  }, [tipoPrecioSeleccionado]);

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
    if (precioSinIvaRef.current) {
      precioSinIvaRef.current.focus();
    }
  };

  const handleCalcularPrecios = async () => {
    const precios = await PresupuestoVentaService.calcularPrecio(
      empresaId,
      productoSeleccionado.alicuota,
      precioConIva,
    ); // cambiar

    setValue("precioConIva", precios.precioConIva || 0);
  };

  const handleEnterConPeticion = async (e: React.KeyboardEvent<HTMLInputElement>, campo: string) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (campo === "PRECIO-SIN-IVA") {
        handleCalcularPrecios();
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        let campoRef: HTMLInputElement | null = null;

        if (campo === "PORCENTAJE") {
          campoRef = precioTotalSinIvaRef.current;
        }

        if (campoRef) {
          const input = campoRef.querySelector("input");
          if (input) {
            input.focus();
            input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
          }
        }
      }, 300); // Ajustá este delay según el tiempo de búsqueda, si es necesario
    }
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

  const codigoInput = (
      <CodigoProductoSelector
        value={codigoProducto}
        onChange={setCodigoProducto}
        onBuscar={handleMostrarProductosFiltros}
        onKeyDown={handleEnterEnNroPieza}
        disabled={false}
        inputRef={nroPiezaRef}
        buttonRef={buscarProductoRef}
      />
    );

  const precioInput = (
  <div className="flex items-end gap-3">
    <div className="flex flex-col space-y-1">
      <PriceInput
        name="precioConIva"
        onKeyDown={(e) => handleEnterConPeticion(e, "PRECIO-CON-IVA")}
        label="Precio"
        className="border border-gray-300 text-right bg-white text-black rounded-lg px-3 py-2.5 text-sm w-[100px]"
        value={precioConIva ?? 0}
        onChange={(value) => setValue("precioConIva", value)}
        disabled={true}
      />
    </div>

    <div className="flex flex-col space-y-1">
      <PriceInput
        name="precioOpcional"
        label="Precio especial"
        className="border border-gray-300 text-right bg-white text-black rounded-lg px-3 py-2.5 text-sm w-[100px]"
        value={precioOpcional ?? 0}
        onChange={(value) => setValue("precioOpcional", value)}
      />
    </div>

    <div className="flex flex-col space-y-1">
      <FormInput
        name="observacionOpcional"
        label="Observación especial"
        className="w-[300px]"
      />
    </div>
  </div>
);


  const modal = mostrarProductosFiltros && (
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
  );

 /*  return (
    <div>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-end mb-4">
              <div className="w-60 ">
                    <label className="block text-sm font-medium text-gray-700 p-2">Tipo Precio</label>
                    <Select<{ id: string; denominacion: string }>
                      value={
                        Object.entries(TipoPrecio)
                          .map(([key, value]) => ({
                            id: key,
                            denominacion: value,
                          }))
                          .filter((option) => option.id !== "MANUAL") // 👈 excluye MANUAL
                          .find((option) => option.id === tipoPrecioSeleccionado) || null
                      }
                      options={Object.entries(TipoPrecio)
                        .map(([key, value]) => ({
                          id: key,
                          denominacion: value,
                        }))
                        .filter((option) => option.id !== "MANUAL")}
                      getOptionLabel={(option) => option.denominacion}
                      getOptionValue={(option) => String(option.id)}
                      onChange={(selectedOption) => {
                        setTipoPrecioSeleccionado(selectedOption?.id ?? "");
                      }}
                      className="text-black"
                      menuPortalTarget={document.body}
                      styles={{
                        control: (base) => ({
                          ...base,
                          color: "black",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "black",
                        }),
                        option: (base, { isSelected, isFocused }) => ({
                          ...base,
                          color: isSelected ? "white" : "black",
                          backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </div>
      
                  <div className="flex items-end gap-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-700">Código</label>
                      <input
                        type="text"
                        ref={nroPiezaRef}
                        onKeyDown={handleEnterEnNroPieza}
                        placeholder="Código"
                        className="border border-gray-300 bg-white text-black rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 w-[150px]"
                        value={codigoProducto}
                        onChange={(e) => setCodigoProducto(e.target.value)}
                        disabled={camposHabilitados === false}
                      />
                    </div>
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
                  </div>

      
                  <div className="flex flex-col space-y-1">
                    <PriceInput
                      name="precioConIva"
                      onKeyDown={(e) => handleEnterConPeticion(e, "PRECIO-CON-IVA")}
                      label="Precio"
                      className="border border-gray-300 text-right bg-white text-black rounded-lg px-3 py-2.5 text-sm w-[100px]"
                      value={precioConIva ?? 0}
                      onChange={(value) => setValue("precioConIva", value)}
                      disabled={true}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <PriceInput
                      name="precioOpcional"
                      label="Precio especial"
                      className="border border-gray-300 text-right bg-white text-black rounded-lg px-3 py-2.5 text-sm w-[100px]"
                      value={precioOpcional ?? 0}
                      onChange={(value) => setValue("precioOpcional", value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <FormInput
                      name="observacionOpcional"
                      label="Observación especial"
                      className="w-[300px]"
                    />
                  </div>

              
            </div>
          </form>
        </FormProvider>




      
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
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
            <span>
              {productoSeleccionado.utilizaPack && (
                <>
                  <strong>Pack:</strong>{" "}
                  {formatCantidades(productoSeleccionado.cantidadPorPack ?? 0)}
                </>
              )}
            </span>
            <span>
              {productoSeleccionado.oferta && (
                <>
                  <strong>Cant. Oferta:</strong>{" "}
                  {formatCantidades(productoSeleccionado.cantidadOferta ?? 0)}
                </>
              )}
            </span>

            
          </div>

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
        
      ); */

  return (
    <SeleccionProductoLayout
      tipoPrecioSelect={<TipoPrecioSelect />}
      codigoInput={codigoInput}
      precioInput={precioInput}
      extras={null}
      infoProducto={<InfoProducto />}
      modal={modal}
    />
  );
}
