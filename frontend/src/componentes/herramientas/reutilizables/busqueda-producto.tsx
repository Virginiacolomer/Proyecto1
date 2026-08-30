import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import ProductoService from "../../gestion-producto/producto/services/producto-service";
import { Card, CardContent } from "../../ui/Card";
import { ProductoSeleccionado } from "../../../interfaces/gestion-producto/producto/interfaces-producto";
import { Linea } from "../../../interfaces/gestion-producto/linea/interfaces-linea";
import { Marca } from "../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Proveedor } from "../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import FacturaVentaService from "../../gestion-venta/factura-venta/services/factura-venta-service";
import AjusteStockService from "../../gestion-stock/ajuste-stock/services/ajuste-stock-service";
import { useEnterFocus } from "../formateo-de-campos/movimiento-campos";
import Select from "react-select";
import PedidoVentaService from "../../gestion-venta/pedido-venta/services/pedido-venta-service";
import { TipoDocumento } from "../../../interfaces/generales/interfaces-generales";
import RemitoVentaService from "../../gestion-venta/remito-venta/remito-venta-service";
import CargaCompraService from "../../gestion-compra/carga-compra/carga-compra-service";
import { formatCantidades } from "../formateo-de-campos/fucion-formateo";
import { Building2, ChevronDown, ChevronUp, Filter, Package, Recycle, Search, Star, Tag, Truck } from "lucide-react";
import { Column, TablaAGGrid } from "../tablas/tabla-flexible-ag-grid";
import Paginacion from "./paginacion";
import PresupuestoVentaService from "../../gestion-venta/presupuesto-venta/services/presupuesto-venta-service";
import { useFiltrosComponentesContext } from "../../../context/filtros-componentes-context";

export default function ConsultarProductosConFiltros({
  codigoIngresado,
  onSeleccionar,
  onCerrar,
  tipoDocumento,
}: {
  codigoIngresado: string;
  onSeleccionar: (producto: ProductoSeleccionado) => void;
  onCerrar: () => void;
  tipoDocumento: string;
}) {
  const [productos, setProductos] = useState<ProductoSeleccionado[]>([]);
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [denominacionMarca, setDenominacionMarca] = useState(" ");
  const [denominacionLinea, setDenominacionLinea] = useState(" ");
  const [denominacionProveedor, setDenominacionProveedor] = useState(" ");

  // MANEJO DE PAGINACION =======================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // MANEJO DE PAGINACION =======================================

  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);
  const [filtrosColapsados, setFiltrosColapsados] = useState(true);
  const [codigo, setCodigo] = useState<string>("");
  const [exacto, setExacto] = useState<boolean>(true);
  const { valoresFiltros, setValoresFiltros, limpiarFiltros } = useFiltrosComponentesContext();

  useEffect(() => {
    limpiarFiltros();
    setCodigo(codigoIngresado);

    setFiltrosInicializados(true);
  }, []);

  // Función para realizar la búsqueda de productos con los valoresFiltros actuales
  const handleBuscarProductos = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      resetearPaginacion();
    }
    setLoading(true);

    const filtros = {
      denominacion: valoresFiltros.denominacion,
      codigoProveedor: valoresFiltros.codigoProveedor,
      codProveedorExacto: valoresFiltros.codProveedorExacto,
      codigoReferencia: valoresFiltros.codigoReferencia,
      codReferenciaExacto: valoresFiltros.codReferenciaExacto,
      lineaId: valoresFiltros.lineaId,
      marcaId: valoresFiltros.marcaId,
      proveedorId: valoresFiltros.proveedorId,
      skip: skip,
      take: take,
    };

    let productosFiltrados;
    if (tipoDocumento === TipoDocumento.FACTURA_VENTA) {
      productosFiltrados = await FacturaVentaService.obtenerDesde(filtros, "productos");
    }
    if (tipoDocumento === TipoDocumento.PEDIDO_VENTA) {
      productosFiltrados = await PedidoVentaService.obtenerDesde(filtros, "productos");
    }
    if (tipoDocumento === TipoDocumento.PRESUPUESTO_VENTA) {
      productosFiltrados = await PresupuestoVentaService.obtenerDesde(filtros, "productos");
    }
    if (tipoDocumento === TipoDocumento.REMITO_VENTA) {
      productosFiltrados = await RemitoVentaService.obtenerDesde(filtros, "productos");
    }
    if (tipoDocumento === TipoDocumento.AJUSTE_STOCK) {
      productosFiltrados = await AjusteStockService.obtenerDesde(filtros, "productos");
    }
    if (tipoDocumento === TipoDocumento.CARGA_COMPRA) {
      productosFiltrados = await CargaCompraService.obtenerDesde(filtros, "productos");
    }

    setProductos(productosFiltrados.data);
    setEntidadesTotales(productosFiltrados.total);
    setLoading(false);
  };

  const handleBuscarProductosRapido = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      resetearPaginacion();
    }
    setLoading(true);

    const filtrosConPaginacion = {
      codigo: codigo,
      exacto: exacto,
      skip: skip,
      take: take,
    };

    let productosFiltrados;
    if (tipoDocumento === TipoDocumento.FACTURA_VENTA) {
      productosFiltrados = await FacturaVentaService.obtenerRapidoDesde(filtrosConPaginacion, "productos");
    }
    if (tipoDocumento === TipoDocumento.PEDIDO_VENTA) {
      productosFiltrados = await PedidoVentaService.obtenerRapidoDesde(filtrosConPaginacion, "productos");
    }
    if (tipoDocumento === TipoDocumento.AJUSTE_STOCK) {
      productosFiltrados = await AjusteStockService.obtenerRapidoDesde(filtrosConPaginacion, "productos");
    }
    if (tipoDocumento === TipoDocumento.REMITO_VENTA) {
      productosFiltrados = await RemitoVentaService.obtenerRapidoDesde(filtrosConPaginacion, "productos");
    }
    if (tipoDocumento === TipoDocumento.CARGA_COMPRA) {
      productosFiltrados = await CargaCompraService.obtenerRapidoDesde(filtrosConPaginacion, "productos");
    }
    if (tipoDocumento === TipoDocumento.PRESUPUESTO_VENTA) {
      productosFiltrados = await PresupuestoVentaService.obtenerRapidoDesde(filtrosConPaginacion, "productos");
    }

    setProductos(productosFiltrados.data);
    setEntidadesTotales(productosFiltrados.total);
    setLoading(false);
  };

  const handleLimpiarCodigo = () => {
    setCodigo("");
    setExacto(false);
  };

  // MANEJO DE PAGINACION ===========================================

  useEffect(() => {
    if (filtrosInicializados === true) {
      handleBuscarProductosRapido();
    }
  }, [paginaActual, filtrosInicializados]);

  const handlePageChange = (skip: number, take: number, paginaActual: number) => {
    console.log("entra en handlePageChange con skip:", skip, "take:", take, "paginaActual:", paginaActual);
    setSkip(skip);
    setTake(take);
    setPaginaActual(paginaActual);
  };

  function resetearPaginacion() {
    setSkip(0);
    setPaginaActual(1);
  }

  // MANEJO DE PAGINACION ===========================================

  const handleLimpiarFiltros = () => {
    limpiarFiltros();
    setDenominacionLinea(" ");
    setDenominacionMarca(" ");
    setDenominacionProveedor(" ");
  };

  const columns: Column<ProductoSeleccionado>[] = [
    {
      header: "Código",
      accessor: "codigoProveedor",
      flex: 0.3,
      type: "text",
      align: "right",
      editable: false,
    },
    {
      header: "Denominación",
      accessor: "denominacion",
      flex: 1.2,
      type: "text",
      editable: false,
      formatFunction: ({ value, row }) => (
        <div className="flex flex-col">
          <div
            className="flex items-center gap-1 truncate whitespace-nowrap max-w-[700px]"
            title={typeof value === "string" ? value : undefined}
          >
            <Star size={16} className={row.esAlternativo ? "text-red-500 shrink-0" : "text-yellow-500 shrink-0"} />
            <span>{value}</span>
          </div>
          {row.observacion && <div className="text-sm text-gray-500 truncate max-w-[700px]">{row.observacion}</div>}
        </div>
      ),
    },
    {
      header: "Stock",
      accessor: "stock",
      flex: 0.3,
      type: "text",
      align: "right",
      editable: false,
      formatFunction: ({ value }) => <span>{formatCantidades(value || 0)}</span>,
    },
    {
      header: "Ubicación",
      accessor: "ubicacion",
      flex: 0.5,
      type: "text",
      editable: false,
    },
  ];

  const denominacionLineaRef = useRef<HTMLInputElement>(null);
  const denominacionProductoRef = useRef<HTMLInputElement>(null);
  const nroPiezaRef = useRef<HTMLInputElement>(null);
  const enterToDenominacionProducto = useEnterFocus(denominacionProductoRef);
  const enterToNroPieza = useEnterFocus(nroPiezaRef);
  const selectLineaRef = useRef<HTMLDivElement>(null);
  const denominacionMarcaRef = useRef<HTMLInputElement>(null);
  const denominacionProveedorRef = useRef<HTMLInputElement>(null);
  const selectMarcaRef = useRef<HTMLDivElement>(null);
  const selectProveedorRef = useRef<HTMLDivElement>(null);
  const enterToDenominacionMarca = useEnterFocus(denominacionMarcaRef);
  const enterToDenominacionProveedor = useEnterFocus(denominacionProveedorRef);
  const buscarRef = useRef<HTMLButtonElement>(null);
  const enterToBuscar = useEnterFocus(buscarRef);

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
      if (select === "PROVEEDOR") {
        const proveedores = await ProductoService.obtenerTotales(
          { denominacion: denominacionProveedor },
          "proveedores",
        );
        if (proveedores) {
          console.log("proveedores encontradas:", proveedores);
          setProveedores(proveedores.data);
        } else {
          console.log("No se encontró un provedor con la denominación ingresada.");
        }
      }
    } catch (error) {
      console.error("Error al buscar por código:", error);
    }
  };

  const handleEnterEnSelect = async (e: React.KeyboardEvent<HTMLInputElement>, select: string) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (select === "LINEA") {
        handleBuscarPorDenominacion("LINEA");
      }

      if (select === "MARCA") {
        handleBuscarPorDenominacion("MARCA");
      }

      if (select === "PROVEEDOR") {
        handleBuscarPorDenominacion("PROVEEDOR");
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

        if (select === "PROVEEDOR") {
          selectDiv = selectProveedorRef.current;
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
      <div className="container mx-auto px-2 sm:px-4">
        <Card className="w-full max-w-8xl bg-white dark:bg-slate-800 mx-auto shadow-2xl rounded-lg overflow-hidden relative mt-10 mb-12">
          {/* Botón de cierre mejorado */}
          <button
            onClick={onCerrar}
            type="button"
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            &times;
          </button>

          {/* Sección de Filtros */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Filter className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Filtros de Búsqueda</h2>
            </div>

            {/* Filtros adicionales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end mb-4">
              {filtrosColapsados && (
                <div className="flex items-center gap-2">
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Codigo..."
                      name="codigo"
                      onKeyDown={(e) => e.key === "Enter" && handleBuscarProductosRapido(true)}
                      className="pl-10 w-full bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      value={codigo || ""}
                      onChange={(e) => {
                        setCodigo(e.target.value);
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2 px-2.5 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600">
                    <input
                      type="checkbox"
                      name="exacto"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={exacto || false}
                      onChange={(e) => setExacto(e.target.checked)}
                    />
                    <label htmlFor="codProveedorExacto" className="text-sm text-gray-700 dark:text-gray-300">
                      Exacto
                    </label>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    if (!filtrosColapsados) {
                      handleBuscarProductos(true);
                    } else {
                      handleBuscarProductosRapido(true);
                    }
                  }}
                  type="button"
                  ref={buscarRef}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>

                <Button
                  className="border-green-600 dark:border-green-900 bg-green-600"
                  onClick={() => {
                    if (!filtrosColapsados) {
                      handleLimpiarFiltros();
                    } else {
                      handleLimpiarCodigo();
                    }
                  }}
                  type="button"
                >
                  <Recycle className="h-4 w-4 text-white" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltrosColapsados(!filtrosColapsados)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {filtrosColapsados ? (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Filtros Adicionales
                    </>
                  ) : (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Ocultar Filtros
                    </>
                  )}
                </Button>
              </div>
            </div>
            {!filtrosColapsados && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                  {/* Código */}
                  <div className="flex flex-col flex-1 space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Código</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="codigoProveedor"
                        placeholder="Código..."
                        value={valoresFiltros.codigoProveedor}
                        ref={nroPiezaRef}
                        onKeyDown={enterToBuscar}
                        onChange={(e) =>
                          setValoresFiltros({
                            ...valoresFiltros,
                            codigoProveedor: e.target.value,
                          })
                        }
                        className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Checkbox Exacto */}
                  <div className="flex items-center space-x-2 px-3 py-2 sm:mt-5 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-slate-600">
                    <input
                      type="checkbox"
                      name="codProveedorExacto"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={valoresFiltros.codProveedorExacto || false}
                      onChange={(e) =>
                        setValoresFiltros({
                          ...valoresFiltros,
                          codProveedorExacto: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="codProveedorExacto" className="text-sm text-gray-700 dark:text-gray-300">
                      Exacto
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Denominación</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      name="denominacion"
                      placeholder="Denominación..."
                      ref={denominacionProductoRef}
                      onKeyDown={enterToNroPieza}
                      value={valoresFiltros.denominacion}
                      onChange={(e) =>
                        setValoresFiltros({
                          ...valoresFiltros,
                          denominacion: e.target.value,
                        })
                      }
                      className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1"></div>

                {/* Líneas */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Líneas</label>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          ref={denominacionLineaRef}
                          onKeyDown={(e) => handleEnterEnSelect(e, "LINEA")}
                          placeholder="Buscar línea..."
                          className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                          value={denominacionLinea}
                          onChange={(e) => setDenominacionLinea(e.target.value)}
                        />
                      </div>
                      <div ref={selectLineaRef}>
                        <Select
                          value={lineas.find((option) => option.id === valoresFiltros.lineaId) || null}
                          options={lineas}
                          onKeyDown={enterToDenominacionMarca}
                          getOptionLabel={(option) => option.denominacion}
                          getOptionValue={(option) => String(option.id)}
                          onChange={(selectedOption) => {
                            setValoresFiltros({
                              ...valoresFiltros,
                              lineaId: selectedOption ? selectedOption.id : undefined,
                            });
                          }}
                          placeholder="Seleccione línea"
                          className="text-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marcas */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marcas</label>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          ref={denominacionMarcaRef}
                          onKeyDown={(e) => handleEnterEnSelect(e, "MARCA")}
                          placeholder="Buscar marca..."
                          className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                          value={denominacionMarca}
                          onChange={(e) => setDenominacionMarca(e.target.value)}
                        />
                      </div>
                      <div ref={selectMarcaRef}>
                        <Select
                          value={marcas.find((option) => option.id === valoresFiltros.marcaId) || null}
                          options={marcas}
                          onKeyDown={enterToDenominacionProveedor}
                          getOptionLabel={(option) => option.denominacion}
                          getOptionValue={(option) => String(option.id)}
                          onChange={(selectedOption) => {
                            setValoresFiltros({
                              ...valoresFiltros,
                              marcaId: selectedOption ? selectedOption.id : undefined,
                            });
                          }}
                          placeholder="Seleccione marca"
                          className="text-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proveedores */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Proveedores</label>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="text"
                          ref={denominacionProveedorRef}
                          onKeyDown={(e) => handleEnterEnSelect(e, "PROVEEDOR")}
                          placeholder="Buscar proveedor..."
                          className="pl-10 bg-white dark:bg-slate-600 border-gray-300 dark:border-slate-500 focus:border-blue-500 focus:ring-blue-500"
                          value={denominacionProveedor}
                          onChange={(e) => setDenominacionProveedor(e.target.value)}
                        />
                      </div>
                      <div ref={selectProveedorRef}>
                        <Select
                          value={proveedores.find((option) => option.id === valoresFiltros.proveedorId) || null}
                          options={proveedores}
                          onKeyDown={enterToDenominacionProducto}
                          getOptionLabel={(option) => option.denominacion}
                          getOptionValue={(option) => String(option.id)}
                          onChange={(option) =>
                            setValoresFiltros({
                              ...valoresFiltros,
                              proveedorId: option ? option.id : undefined,
                            })
                          }
                          placeholder="Seleccione proveedor"
                          className="text-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Referencia/Estadísticas 
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <ReferenciaProducto entidadesTotales={entidadesTotales} productos={productos} estadisticas={false} />
        </div>
        */}

          {/* Contenido Principal */}
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Buscando productos...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
                  <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
                </div>
              </div>
            ) : (
              <>
                <Card className="border-gray-200 dark:border-slate-700">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      {productos.length > 0 ? (
                        <TablaAGGrid
                          columns={columns}
                          data={productos}
                          onUpdate={() => {}}
                          actions={(row) => (
                            <button
                              className="bg-blue-600 text-white rounded px-2 py-1"
                              onClick={() => onSeleccionar(row)}
                            >
                              Seleccionar
                            </button>
                          )}
                          actionsFlex={0.5}
                          actionsScrollable={false}
                          rowHeight={55}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Package className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-center text-gray-500 text-lg">No se encontraron productos</p>
                          <p className="text-center text-gray-400 text-sm mt-2">
                            Intenta ajustar los filtros de búsqueda
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-6">
                  <Paginacion
                    entidadesTotales={entidadesTotales}
                    take={take}
                    paginaActual={paginaActual}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
