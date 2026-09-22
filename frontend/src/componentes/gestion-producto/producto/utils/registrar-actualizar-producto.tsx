import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import { Card } from "../../../ui/Card";
import ProductoService from "../services/producto-service";
import PriceInput from "../../../herramientas/formateo-de-campos/price-input";
import CantidadesInput from "../../../herramientas/formateo-de-campos/cantidades-input";
import { Producto, SelectPresentacion } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { SelectMarca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Linea, SelectLinea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import PresentacionService from "../../presentacion/services/presentacion-service";
import { AlicuotaIva, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import Select from "react-select";
import { useEnterFocus } from "../../../herramientas/formateo-de-campos/movimiento-campos";
import { useConfiguracionSistema } from "../../../sistema/ConfiguracionSistemaContext";
import { parseApiError } from "../../../../utils/errores";
import { Layers } from "lucide-react";
import RegistrarActualizarMarcaForm from "../../marca/utils/registrar-actualizar-marca";
import { ItemProveedor } from "../../../../interfaces/gestion-producto/producto/interfaces-item-proveedor";
import { SelectSublinea } from "../../../../interfaces/gestion-producto/sublinea/interfaces-sublinea";
import { ItemsProveedorEnPayload } from "../interfaces/interfaces-validaciones-item-proveedor";
import { FormValues, schema, transformData, transformarItemsProdAlternativo } from "../interfaces/interfaces-validaciones-producto";
import LineasSelector from "../componentes/configuracion/lineas-selector";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import MarcasSelector from "../componentes/configuracion/marcas-selector";
import PresentacionesSelector from "../componentes/configuracion/presentacion-selector";
import { getUsuarioId } from "../../../../utils/auth";
import RegistrarActualizarLineaForm from "../../linea/utils/registrar-actualizar-linea";
import RegistrarActualizarPresentacionForm from "../../presentacion/utils/registrar-actualizar-presentacion";
import PorcentajeInput from "../../../herramientas/formateo-de-campos/porcentaje-input";


export default function RegistrarActualizarProductoForm({
  producto,
  onClose,
  onSuccess,
}: {
  producto?: Producto;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  //===================== CONSTANTES VARIAS ============================================
  const usuarioId = getUsuarioId();

  const { configuracion } = useConfiguracionSistema();
  const [rStockCritico, setStockCritico] = useState(false);
  const [usaOferta, setUsaOferta] = useState(false);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<Linea>({} as Linea);

  console.log("Configuración del sistema:", configuracion);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(rStockCritico, false, usaOferta)) as any,
    defaultValues: producto
      ? transformData(producto)
      : {
          alicuotaIva: AlicuotaIva.ALICUOTA_21,
        },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    setError,
  } = methods;

  console.log("estos son los errores", errors);

  console.log("Producto que llega al formulario", producto);

  console.log("linea seleccionada", lineaSeleccionada);

  const [marcas, setMarcas] = React.useState<SelectMarca[]>([]);
  const [lineas, setLineas] = React.useState<SelectLinea[]>([]);
  const [presentaciones, setPresentaciones] = React.useState<SelectPresentacion[]>([]);
  
  const [denominacionMarca, setDenominacionMarca] = useState(" ");
  const [denominacionLinea, setDenominacionLinea] = useState(" ");
  const [denominacionPresentacion, setDenominacionPresentacion] = useState(" ");
  const [selectedLinea, setSelectedLinea] = React.useState<SelectLinea>();
  const [selectedMarca, setSelectedMarca] = React.useState<SelectMarca>();
  const [selectedPresentacion, setSelectedPresentacion] = React.useState<SelectPresentacion>();
  const [mostrarFormularioLinea, setMostrarFormularioLinea] = useState(false);
  const [mostrarFormularioMarca, setMostrarFormularioMarca] = useState(false);
  const [mostrarFormularioPresentacion, setMostrarFormularioPresentacion] = useState(false);
  const [itemProdAlternativoSinAgregar, setItemProdAlternativoSinAgregar] = useState(false);

  const stock = watch(`stock`);
  const stockMinimo = watch("stockMinimo");
  const utilizaStockMinimo = watch("utilizaStockMinimo");
  const costo = watch("costo");
  const porcentaje = watch("porcentaje");

  useEffect(() => {
    const c = Number(costo) || 0;
    const p = Number(porcentaje) || 0;
    const precioCalculado = c + (c * (p / 100));
    setValue("precio", precioCalculado, { shouldValidate: true });
  }, [costo, porcentaje, setValue]);

  const precioActual = watch("precio") || 0;
  const precioAnterior = producto?.precio || 0;
  const haCambiadoPrecio = producto && Math.abs(Number(precioActual) - Number(precioAnterior)) > 0.01;

  //=============================== CONSTANTES PARA MOVIMIENTO ENTRE CAMPOS ==================================
  const denominacionProductoRef = useRef<HTMLInputElement>(null);
  useEnterFocus(denominacionProductoRef);
  const observacionRef = useRef<HTMLInputElement>(null);
  const ubicacionRef = useRef<HTMLInputElement>(null);
  const selectTipoProductoRef = useRef<HTMLDivElement>(null);
  const selectAlicuotaIvaRef = useRef<HTMLDivElement>(null);
  const precioOfertaRef = useRef<HTMLInputElement>(null);
  const denominacionLineaRef = useRef<HTMLInputElement>(null);
  const selectLineaRef = useRef<HTMLDivElement>(null);
  const denominacionMarcaRef = useRef<HTMLInputElement>(null);
  const selectMarcaRef = useRef<HTMLDivElement>(null);
  const denominacionPresentacionRef = useRef<HTMLInputElement>(null);
  const selectPresentacionRef = useRef<HTMLDivElement>(null);

  const enterToObservacion = useEnterFocus(observacionRef);
  const enterToPrecioOferta = useEnterFocus(precioOfertaRef);
  const enterToDenominacionMarca = useEnterFocus(denominacionMarcaRef);
  const enterToDenominacionPresentacion = useEnterFocus(denominacionPresentacionRef);

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    if (!utilizaStockMinimo) {
      setValue("stockMinimo", 0);
    }
    
  }, [utilizaStockMinimo, false, setValue]);

  useEffect(() => {
    setValue("stockMinimo", lineaSeleccionada.stockMinimo || 0);
    setValue("utilizaStockMinimo", lineaSeleccionada.utilizaStockMinimo || false);
  }, [lineaSeleccionada]);

  useEffect(() => {
    setStockCritico(utilizaStockMinimo || false);
    setUsaOferta(false);
  }, [utilizaStockMinimo, false]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (producto) {
          setValue("lineaId", producto.linea.id || 0);
          setSelectedLinea(producto.linea);

          setValue("marcaId", producto.marca.id || 0);
          setSelectedMarca(producto.marca);

          if (producto.presentacion) {
            setValue("presentacionId", producto.presentacion.id || 0);
            setSelectedPresentacion(producto.presentacion);
          }

          
          setValue("denominacion", producto.denominacion || "");
          setValue("observacion", producto.observacion || null);
          setValue("codigoReferencia", producto.codigoReferencia || "");
          setValue("stock", producto.stock || 0);
          setValue("costo", producto.costo || 0);
          
          //setValue("oferta", producto.oferta || false);
          setValue("alicuotaIva", producto.alicuotaIva || 0);

          setValue("stockMinimo", producto.stockMinimo || 0);
          setValue("utilizaStockMinimo", producto.utilizaStockMinimo || false);
        
          console.error("llega aca", producto);
        
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [producto]);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;

    try {
      // ⚠️ Validar si hay ítems sin agregar
      if (itemProdAlternativoSinAgregar) {
        const mensaje = [
          itemProdAlternativoSinAgregar ? "- Hay un producto alternativo sin agregar." : "",
          "",
          "¿Estás seguro de que querés registrar sin agregarlos?",
        ]
          .filter(Boolean)
          .join("\n");

        const confirmar = window.confirm(mensaje);

        if (!confirmar) return; // el usuario canceló
      }

      // Extraemos precio porque el backend lo rechaza (se calcula solo allá)
      const { precio, ...datosParaBackend } = formData as any;

      if (producto) {
        const payload: any = {
          ...datosParaBackend,
          usuarioUpdatedId: usuarioId,
        };

        // No eliminamos precio ni costo aquí, se enviarán para la validación del backend.

        response = await ProductoService.actualizar(producto.id, payload);
      } else {
        const payload = {
          ...datosParaBackend,
          usuarioCreatedId: usuarioId,
        };

        response = await ProductoService.nuevo(payload);
      }

      await onSuccess(response.mensaje);
      onClose();
    } catch (error) {
      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleBuscarPorDenominacion = async (select: string) => {
    try {
      if (select === "LINEA") {
        const lineas = await ProductoService.obtenerTotales({ denominacion: denominacionLinea }, "lineas");
        if (lineas) {
          console.log("Lineas encontradas:", lineas);
          setLineas(lineas.data);
        } else {
          console.log("No se encontró una linea con la denominación ingresada.");
        }
      }
      if (select === "MARCA") {
        const marcas = await ProductoService.obtenerTotales({ denominacion: denominacionMarca }, "marcas");
        if (marcas) {
          console.log("Marcas encontradas:", marcas);
          setMarcas(marcas.data);
        } else {
          console.log("No se encontró una marca con la denominación ingresada.");
        }
      }
      if (select === "PRESENTACION") {
        const res = await PresentacionService.obtener({ denominacion: denominacionPresentacion });
        if (res) {
          console.log("Presentaciones encontradas:", res);
          setPresentaciones(res.data);
        } else {
          console.log("No se encontró una presentacion con la denominación ingresada.");
        }
      }
      
    } catch (error) {
      console.error("Error al buscar por código:", error);
    }
  };

  const handleEnterEnSelect = async (e: React.KeyboardEvent, select: string) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (select === "LINEA") {
        handleBuscarPorDenominacion("LINEA");
      }

      if (select === "MARCA") {
        handleBuscarPorDenominacion("MARCA");
      }

      if (select === "PRESENTACION") {
        handleBuscarPorDenominacion("PRESENTACION");
      }

      // Esperar un poco (opcional, si el botón hace una búsqueda antes)
      setTimeout(() => {
        let selectDiv: HTMLDivElement | null = null;

        if (select === "MARCA") {
          selectDiv = selectMarcaRef.current;
        }

        if (select === "LINEA") {
          selectDiv = selectLineaRef.current;
        }

        if (select === "PRESENTACION") {
          selectDiv = selectPresentacionRef.current;
        }

        if (select === "TIPO-PRODUCTO") {
          selectDiv = selectTipoProductoRef.current;
        }

        if (select === "ALICUOTA-IVA") {
          selectDiv = selectAlicuotaIvaRef.current;
        }

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
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-5">
      <Card className="w-full max-w-7xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden relative mt-10 mb-12">
        <EncabezadoFormularios
          title={producto ? "Producto" : "Registrar Producto"}
          subtitle={
            producto
              ? "Edita los datos."
            : "Ingresa los datos."
          }
          icon={<Layers className="form-icon" />}
          onClose={onClose}
        />  

        {/* Formulario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-6 py-4">
              {/* Primera fila */}
              <div className="flex flex-col w-full gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 col-span-full">
                  <div className="col-span-full flex flex-col md:flex-row items-end gap-2">
                    <div className="flex-[2]">
                      <FormInput
                        name="denominacion"
                        label="Denominación"
                        placeholder="Ingresa la denominación"
                        disabled={producto && producto.sistema > 0 ? true : false}
                        onKeyDown={enterToObservacion}
                        inputRef={denominacionProductoRef}
                      />
                    </div>
                    <div className="flex-1 w-full md:w-auto">
                      <FormInput
                        name="codigoReferencia"
                        label="Codigo Referencia"
                        placeholder="Ingresa el codigo de referencia"
                      />
                    </div>
                  </div>

                  {/* <FormInput
                    name="costo"
                    label="Costo"
                    placeholder="Ingresa el costo"
                  />

                  <FormInput
                    name="precio"
                    label="Precio"
                    placeholder="Ingresa el precio"
                  />

                  <FormInput
                    name="porcentaje"
                    label="Porcentaje"
                    placeholder="Ingresa el porcentaje"
                  /> */}

                  <PriceInput
                    name="costo"
                    label="Costo"
                    value={watch("costo") || 0}
                    onChange={(value) => setValue("costo", value, { shouldValidate: true })}
                    maxDigits={9}
                    disabled={producto && producto.sistema > 0 ? true : false}
                  />
                  <PriceInput
                    name="precio"
                    label="Precio"
                    value={watch("precio") || 0}
                    onChange={(value) => setValue("precio", value, { shouldValidate: true })}
                    maxDigits={9}
                    disabled={true}
                  />
                  <PorcentajeInput
                    name="porcentaje"
                    label="Porcentaje"
                    value={watch("porcentaje") || 0}
                    onChange={(value) => setValue("porcentaje", value, { shouldValidate: true })}
                    disabled={producto && producto.sistema > 0 ? true : false}
                  />

                  {haCambiadoPrecio && (
                    <FormInput
                      name="motivo"
                      label="Motivo del cambio de precio (*)"
                      placeholder="Indique el motivo"
                    />
                  )}


                  <FormInput
                    name="ubicacion"
                    label="Ubicación"
                    placeholder="Ingresa una ubicación (opcional)"
                    onKeyDown={(e) => handleEnterEnSelect(e, "TIPO-PRODUCTO")}
                    inputRef={ubicacionRef}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Alicuota IVA</label>
                    <div ref={selectAlicuotaIvaRef} className="w-full">
                      <Select
                        value={
                          Object.entries(AlicuotaIva)
                            .map(([key, value]) => ({
                              id: value,
                              denominacion: key === "ALICUOTA_105" ? "10.5" : key.replace("ALICUOTA_", ""),
                            }))
                            .find((option) => option.id === watch("alicuotaIva")) || null
                        }
                        options={Object.entries(AlicuotaIva).map(([key, value]) => ({
                          id: value,
                          denominacion: key === "ALICUOTA_105" ? "10.5" : key.replace("ALICUOTA_", ""),
                        }))}
                        onKeyDown={enterToPrecioOferta}
                        getOptionLabel={(option) => option.denominacion}
                        getOptionValue={(option) => String(option.id)}
                        isDisabled={producto && producto.sistema > 0 ? true : false}
                        onChange={(selectedOption) => {
                          methods.setValue(`alicuotaIva`, selectedOption?.id || 0);
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
                      {errors.alicuotaIva && (
                        <small className="text-red-500">{errors.alicuotaIva?.message as string}</small>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    {producto ? (
                      <CantidadesInput
                        name={`stock`}
                        label="Stock"
                        value={stock || 0}
                        onChange={(value) => setValue(`stock`, Number(value))}
                        disabled={true}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <div className="col-span-full flex flex-wrap gap-4 mt-8">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...methods.register("utilizaStockMinimo")}
                          className={` w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500`}
                          disabled={producto && producto.sistema > 0 ? true : false}
                        />
                      </label>
                    </div>

                    <CantidadesInput
                      name={`stockMinimo`}
                      label="Stock Crítico"
                      value={stockMinimo || 0}
                      onChange={(value) => setValue(`stockMinimo`, Number(value))}
                      disabled={utilizaStockMinimo ? false : true}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-2">

              <LineasSelector
                denominacionLinea={denominacionLinea}
                setDenominacionLinea={setDenominacionLinea}
                denominacionLineaRef={denominacionLineaRef}
                selectLineaRef={selectLineaRef}
                lineas={lineas}
                selectedLinea={selectedLinea}
                lineaId={watch("lineaId")}
                disabled={producto && producto.sistema > 0}
                errors={errors}
                onEnterLinea={(e) => handleEnterEnSelect(e, "LINEA")}
                onEnterDenominacion={enterToDenominacionMarca}
                onLineaChange={(linea) => {
                  methods.setValue("lineaId", linea?.id || 0);
                  setLineaSeleccionada(linea as any);
                  setSelectedLinea(linea as any);
                }}
                onAgregarLinea={() => setMostrarFormularioLinea(true)}
              />

              <MarcasSelector
                denominacionMarca={denominacionMarca}
                setDenominacionMarca={setDenominacionMarca}
                denominacionMarcaRef={denominacionMarcaRef}
                selectMarcaRef={selectMarcaRef}
                marcas={marcas}
                selectedMarca={selectedMarca}
                marcaId={watch("marcaId")}
                disabled={producto && producto.sistema > 0}
                error={errors.marcaId?.message}
                onEnterMarca={(e) => handleEnterEnSelect(e, "MARCA")}
                onChangeMarca={(marca) => {
                  methods.setValue("marcaId", marca?.id || 0);
                  setSelectedMarca(marca as any);
                }}
                onAgregarMarca={() => setMostrarFormularioMarca(true)}
              />

              <PresentacionesSelector
                denominacionPresentacion={denominacionPresentacion}
                setDenominacionPresentacion={setDenominacionPresentacion}
                denominacionPresentacionRef={denominacionPresentacionRef}
                selectPresentacionRef={selectPresentacionRef}
                presentaciones={presentaciones}
                selectedPresentacion={selectedPresentacion}
                presentacionId={watch("presentacionId") as any}
                disabled={producto && producto.sistema > 0}
                error={errors.presentacionId?.message}
                onEnterPresentacion={(e) => handleEnterEnSelect(e, "PRESENTACION")}
                onChangePresentacion={(pres) => {
                  methods.setValue("presentacionId", pres?.id || 0);
                  setSelectedPresentacion(pres as any);
                }}
                onAgregarPresentacion={() => setMostrarFormularioPresentacion(true)}
              />

              </div>

              {/* Segunda fila */}


              <hr className="col-span-full my-2 border-gray-300" />

              
              
            </CardContent>

            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

            {/* Botón de submit */}
            <CardFooter className="flex justify-center">
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? producto
                    ? "Actualizando..."
                    : "Registrando..."
                  : producto
                  ? "Actualizar"
                  : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>

        {mostrarFormularioLinea && (
          <RegistrarActualizarLineaForm
            onClose={() => setMostrarFormularioLinea(false)}
            onSuccess={() => {
              setMostrarFormularioLinea(false);
              handleBuscarPorDenominacion("LINEA")
            }}
          />
        )}


        {mostrarFormularioMarca && (
          <RegistrarActualizarMarcaForm
            onClose={() => setMostrarFormularioMarca(false)}
            onSuccess={() => {
              setMostrarFormularioMarca(false);
              handleBuscarPorDenominacion("MARCA")
            }}
          />
        )}

        {mostrarFormularioPresentacion && (
          <RegistrarActualizarPresentacionForm
            onClose={() => setMostrarFormularioPresentacion(false)}
            onSuccess={() => {
              setMostrarFormularioPresentacion(false);
              handleBuscarPorDenominacion("PRESENTACION")
            }}
          />
        )}

       
      </Card>
    </div>
  );
}
