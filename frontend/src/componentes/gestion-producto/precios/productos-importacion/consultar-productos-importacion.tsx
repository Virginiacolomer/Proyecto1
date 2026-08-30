import { useState, useEffect } from "react";
import { useFiltrosContext } from "../../../../context/filtros-contesxt";
import {
  getOneMonthAgoDate,
  getTodayDate,
} from "../../../herramientas/funciones-reutilizables/funcion-fechas-mes-antes";
import { Column, TablaAGGrid } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import Paginacion from "../../../herramientas/reutilizables/paginacion";
import { Calendar, Search, Star } from "lucide-react";
import { Input } from "../../../ui/Input";
import Select from "react-select";
import { Button } from "../../../ui/Button";
import { Importacion } from "../../../../interfaces/gestion-producto/precios/interfaces-importaciones";
import ImportacionService from "../importaciones/importaciones-service";
import { ConsultarProducto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { useCatalogosContext } from "../../../../context/catalogos-context";

export default function ConsultarProductosImportacion() {
  const [productos, setProductos] = useState<ConsultarProducto[]>([]);
  const [importaciones, setImportaciones] = useState<Importacion[]>([]);
  const [importacionSelected, setImportacionSelected] = useState<Importacion>({} as Importacion);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MANEJO DE PAGINACION =======================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // MANEJO DE PAGINACION =======================================

  // MANEJO DE FILTROS ========================================================
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);
  const {
    setFiltrosNecesarios,
    valoresFiltros,
    setValoresFiltros,
    limpiarFiltros,

    buscar,
    setBuscar,
  } = useFiltrosContext();
  // valoresFiltro tendrá los valores actualizados de los filtros

  // Contexto de catálogos
  const { marcas, setMarcas,proveedores, setProveedores } = useCatalogosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: "consultar-productos-importacion" });
    setFiltrosNecesarios({
      fechaDesde: true,
      fechaHasta: true,
      proveedor: true,
      marca: true,
    });
    setValoresFiltros({
      fechaDesde: getOneMonthAgoDate(),
      fechaHasta: getTodayDate(),
      denominacionProveedor: "",
      denominacionMarca: "",
    });
    setFiltrosInicializados(true);
  }, []);

  useEffect(() => {
    if (buscar.cont > 0 && buscar.componente === "consultar-productos-importacion") {
      handleBuscarProductosImportacion(true);
    }
  }, [buscar]);

  // MANEJO DE FILTROS ========================================================

  const fetchData = async () => {
    setError(null);
    try {
      const proveedoresTotales = await ImportacionService.obtenerTotalesSistema(
        { denominacion: valoresFiltros.denominacionProveedor || " " },
        "proveedores"
      );
      setProveedores(proveedoresTotales.data);

      const marcasTotales = await ImportacionService.obtenerTotalesSistema(
        { denominacion: valoresFiltros.denominacionMarca || " " },
        "marcas"
      );
      setMarcas(marcasTotales.data);
    } catch (err: any) {
      console.error("Error al obtener las productos:", err);
      setError("No se pudieron cargar las productossss.");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleBuscarProductosImportacion = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      resetearPaginacion();
    }
    setLoading(true);

    const filtrosConPaginacion = {
      loteImportacionId: importacionSelected.id || 0,
      skip: skip,
      take: take,
    };

    const productos = await ImportacionService.obtenerDesde(filtrosConPaginacion, "productos");

    setProductos(productos.data);
    setEntidadesTotales(productos.total);
    setLoading(false);
  };

  // MANEJO DE PAGINACION ===========================================

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarProductosImportacion();
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

  const handleBuscarImportaciones = async () => {
    const filtros = {
      fechaDesde: valoresFiltros.fechaDesde,
      fechaHasta: valoresFiltros.fechaHasta,
      marcaId: valoresFiltros.marcaId || 0,
      proveedorId: valoresFiltros.proveedorId || 0,
    };

    const importaciones = await ImportacionService.obtener(filtros);

    setImportaciones(importaciones.data);
  };

  // Adaptar columns para que cumpla con el tipo Column<FacturaVenta>
  const columns: Column<ConsultarProducto>[] = [
    {
      header: "Codigo",
      accessor: "codigoProveedor",
      flex: 0.4,
      type: "text",
      align: "right",
      editable: false,
      scrollable: false,
    },
    {
      header: "Cod Referencia",
      accessor: "codigoReferencia",
      flex: 0.4,
      type: "text",
      align: "right",
      editable: false,
      scrollable: false,
    },
    {
      header: "Denominación",
      accessor: "denominacion",
      flex: 1.3,
      type: "text",
      editable: false,
      formatFunction: ({ value, row }) => (
        <div className="flex flex-col">
          <div
            className="flex items-center gap-1 truncate whitespace-nowrap max-w-[700px]"
            title={typeof value === "string" ? `${value}${row.observacion ? `\n${row.observacion}` : ""}` : undefined}
          >
            <Star size={16} className={row.esAlternativo ? "text-red-500 shrink-0" : "text-yellow-500 shrink-0"} />
            <span>{value}</span>
          </div>
          {row.observacion && <div className="text-sm text-gray-500 truncate max-w-[700px]">{row.observacion}</div>}
        </div>
      ),
      scrollable: false,
    },
    {
      header: "Proveedor",
      accessor: "proveedor",
      flex: 0.4,
      type: "text",
      editable: false,
      scrollable: false,
    },
    {
      header: "Ubicación",
      accessor: "ubicacion",
      flex: 0.5,
      type: "text",
      editable: false,
      scrollable: false,
    },
  ];

  return (
    <div className="w-full">
      {/* Contenido principal */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tabla de facturas */}
            <Card className="border-gray-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-6">
                  <CardTitle className="flex items-center space-x-2">
                    <span>Productos Importación</span>
                  </CardTitle>
                </div>

                {/* Botón añadir */}
                <div className="w-full md:w-auto">
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white flex items-center w-full md:w-auto justify-center px-4 py-3"
                    onClick={() => handleBuscarProductosImportacion(true)}
                  >
                    <Search className="mr-2 h-4 w-4" /> Buscar
                  </Button>
                </div>
              </CardHeader>
              {/* Filtros*/}

              <div className="flex flex-wrap gap-4 px-4 pb-4">
                {/* Fecha Desde */}
                <div className="flex flex-col">
                  <label htmlFor="fechaDesde" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fecha desde
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      name="fechaDesde"
                      className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      value={valoresFiltros.fechaDesde}
                      onChange={(e) =>
                        setValoresFiltros({
                          ...valoresFiltros,
                          fechaDesde: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Fecha Hasta */}
                <div className="flex flex-col">
                  <label htmlFor="fechaHasta" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fecha hasta
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      name="fechaHasta"
                      className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                      value={valoresFiltros.fechaHasta}
                      onChange={(e) =>
                        setValoresFiltros({
                          ...valoresFiltros,
                          fechaHasta: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Proveedor */}
                <div className="flex flex-col min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                  <Select
                    value={(proveedores ?? []).find((option) => option.id === valoresFiltros.proveedorId) || null}
                    options={proveedores ?? []}
                    getOptionLabel={(option) => option.denominacion}
                    getOptionValue={(option) => String(option.id)}
                    onChange={(option) =>
                      setValoresFiltros({
                        ...valoresFiltros,
                        proveedorId: option ? option.id : undefined,
                      })
                    }
                    placeholder="Seleccione"
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

                {/* Marca */}
                <div className="flex flex-col min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
                  <Select
                    value={(marcas ?? []).find((option) => option.id === valoresFiltros.marcaId) || null}
                    options={marcas ?? []}
                    getOptionLabel={(option) => option.denominacion}
                    getOptionValue={(option) => String(option.id)}
                    onChange={(option) =>
                      setValoresFiltros({
                        ...valoresFiltros,
                        marcaId: option ? option.id : undefined,
                      })
                    }
                    placeholder="Seleccione"
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

                {/* Marca */}
                <div className="flex flex-col min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Importaciones</label>
                  <div className="flex gap-x-4">
                    <Select
                      value={(importaciones ?? []).find((option) => option.id === importacionSelected.id) || null}
                      options={importaciones ?? []}
                      getOptionLabel={(option) => option.fecha}
                      getOptionValue={(option) => String(option.id)}
                      onChange={(option) => setImportacionSelected(option ? option : ({} as Importacion))}
                      placeholder="Seleccione una importación"
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
                    <Button
                      type="button"
                      title="Buscar"
                      variant="outline"
                      size="icon"
                      className="bg-blue-500 text-white hover:bg-gray-700 w-10 h-10 rounded-full shadow-md transition"
                      onClick={handleBuscarImportaciones}
                    >
                      <Search size={20} />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <TablaAGGrid
                    columns={columns}
                    data={productos}
                    onUpdate={() => {}}
                    actions={undefined}
                    actionsFlex={0}
                    rowHeight={55}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Paginación */}
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
      </div>
    </div>
  );
}
