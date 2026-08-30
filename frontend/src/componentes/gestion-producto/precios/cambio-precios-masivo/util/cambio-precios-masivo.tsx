import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "../../../../ui/Card";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../../herramientas/alertas/alertas";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../../herramientas/alertas/alertas-confirmacion";
import { ConsultarProductosCambioPreciosMasivo } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { formatPrice } from "../../../../herramientas/formateo-de-campos/fucion-formateo";
import { Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { useConfiguracionSistema } from "../../../../sistema/ConfiguracionSistemaContext";
import { useFiltrosContext } from "../../../../../context/filtros-contesxt";
import CambioPreciosMasivoService from "../cambio-precios-masivo-service";
import CambioPreciosManual from "../cambio-precios.manual";
import { useCatalogosContext } from "../../../../../context/catalogos-context";
import { getUsuarioId } from "../../../../../utils/auth";
import { useCambioPrecios } from "../hooks/useCambioPrecios";
import TablaCambioPrecios from "../componentes/tabla-cambio-precios";
import FiltrosCambioPrecios from "../componentes/filtros-cambio-precios";

export default function CambioPreciosMasivo() {
  const [error, setError] = useState<string | null>(null);
  const [mostrarActualizarProducto, setMostrarActualizarProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ConsultarProductosCambioPreciosMasivo>(
    {} as ConsultarProductosCambioPreciosMasivo
  );

  const usuarioId = getUsuarioId();
  const { configuracion } = useConfiguracionSistema();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const {
    setFiltrosNecesarios,
    valoresFiltros,
    setValoresFiltros,
    limpiarFiltros,
    setBuscar,
    buscarMarcas,
    buscarLineas,
  } = useFiltrosContext();

  const {
    productos,
    loading,
    setProductos,
    buscarProductos,
    aplicarCambios,
    guardarCambios,
    actualizarProductoLocal,
  } = useCambioPrecios(usuarioId);

  const { marcas, lineas, sublineas, setLineas, setMarcas, setSublineas } = useCatalogosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: "cambio-precios-masivo" });
    setFiltrosNecesarios({ marca: true, linea: true, sublinea: true });
  }, []);

  const fetchMarcas = useCallback(async () => {
    setError(null);
    try {
      const caracteresParaBusqueda = configuracion?.caracteresParaBusqueda ?? 4;
      if (
        valoresFiltros.denominacionMarca &&
        valoresFiltros.denominacionMarca.length >= caracteresParaBusqueda
      ) {
        const marcasTotales = await CambioPreciosMasivoService.obtenerTotales(
          { denominacion: valoresFiltros.denominacionMarca || " " },
          "marcas"
        );
        setMarcas(marcasTotales.data);
      }
    } catch {
      setError("No se pudieron cargar las marcas.");
    }
  }, [valoresFiltros.denominacionMarca, configuracion?.caracteresParaBusqueda]);

  useEffect(() => {
    fetchMarcas();
  }, [buscarMarcas]);

  const fetchLineas = useCallback(async () => {
    setError(null);
    try {
      const caracteresParaBusqueda = configuracion?.caracteresParaBusqueda ?? 4;
      if (
        valoresFiltros.denominacionLinea &&
        valoresFiltros.denominacionLinea.length >= caracteresParaBusqueda
      ) {
        const lineasTotales = await CambioPreciosMasivoService.obtenerTotales(
          { denominacion: valoresFiltros.denominacionLinea || " " },
          "lineas"
        );
        setLineas(lineasTotales.data);
      }
    } catch {
      setError("No se pudieron cargar las líneas.");
    }
  }, [valoresFiltros.denominacionLinea, configuracion?.caracteresParaBusqueda]);

  useEffect(() => {
    fetchLineas();
  }, [buscarLineas]);

  useEffect(() => {
    const fetchSublineas = async () => {
      setError(null);
      try {
        if (valoresFiltros.lineaId && valoresFiltros.lineaId !== 0) {
          const sublineasTotales = await CambioPreciosMasivoService.obtenerTotalesPara(
            valoresFiltros.lineaId || 0,
            "sublineas"
          );
          setSublineas(sublineasTotales.data);
        }
      } catch {
        setError("No se pudieron cargar las sublíneas.");
      }
    };
    fetchSublineas();
  }, [valoresFiltros.lineaId]);

  const handleAbrirActualizarProducto = useCallback(
    (producto: ConsultarProductosCambioPreciosMasivo) => {
      setProductoSeleccionado(producto);
      setMostrarActualizarProducto(true);
    },
    []
  );

  const handleCerrarActualizarProducto = useCallback(() => {
    setMostrarActualizarProducto(false);
    setProductoSeleccionado({} as ConsultarProductosCambioPreciosMasivo);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = await showConfirmation({
        type: TipoAlertaConfirmacion.DESTRUCTIVE,
        title: TituloAlertaConfirmacion.DESTRUCTIVE,
        message: "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.",
        confirmText: "Eliminar",
        cancelText: "Cancelar",
        onConfirm: () => {},
      });
      if (!confirmed) return;

      try {
        setProductos((prev) => prev.filter((p) => p.id !== id));
        addAlert({
          type: TipoAlerta.SUCCESS,
          title: TituloAlerta.SUCCESS,
          message: "El elemento ha sido eliminado.",
          autoClose: true,
          duration: 3000,
        });
      } catch {
        addAlert({
          type: TipoAlerta.ERROR,
          title: TituloAlerta.ERROR,
          message: "No se puede eliminar este elemento.",
          autoClose: true,
          duration: 3000,
        });
      }
    },
    [showConfirmation, setProductos, addAlert]
  );

  const handleLimpiarFiltros = useCallback(() => {
    setValoresFiltros({
      denominacionMarca: "",
      denominacionLinea: "",
      marcaId: undefined,
      lineaId: undefined,
      sublineaId: undefined,
    });
    setSublineas([]);
    setLineas([]);
    setMarcas([]);
    setProductos([]);
  }, [setValoresFiltros, setSublineas, setLineas, setMarcas, setProductos]);

  const handleActualizarSuccess = useCallback(
    (productoActualizado: ConsultarProductosCambioPreciosMasivo) => {
      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: `El producto ${productoActualizado.denominacion} se ha actualizado correctamente.`,
        autoClose: true,
        duration: 3000,
      });
      actualizarProductoLocal(productoActualizado);
      setMostrarActualizarProducto(false);
    },
    [addAlert, actualizarProductoLocal]
  );

  const handleGuardarCambios = useCallback(async () => {
    const response = await guardarCambios();
    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: response.mensaje,
      autoClose: true,
      duration: 3000,
    });
  }, [guardarCambios, addAlert]);

  const columns = useMemo<Column<ConsultarProductosCambioPreciosMasivo>[]>(
    () => [
      {
        header: "Código",
        accessor: "codigoProveedor",
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
        scrollable: false,
        formatFunction: ({ value, row }) => (
          <div className="flex flex-col">
            <div
              className="flex items-center gap-1 truncate whitespace-nowrap max-w-[700px]"
              title={
                typeof value === "string"
                  ? `${value}${row.observacion ? `\n${row.observacion}` : ""}`
                  : undefined
              }
            >
              <span>{value}</span>
            </div>
            {row.observacion && (
              <div className="text-sm text-gray-500 truncate max-w-[700px]">{row.observacion}</div>
            )}
          </div>
        ),
      },
      {
        header: "P Ocasional",
        accessor: "precioOcasionalConIva",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "N Ocasional",
        accessor: "precioOcasionalConIvaNuevo",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "P Mayorista",
        accessor: "precioMayoristaConIva",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "N Mayorista",
        accessor: "precioMayoristaConIvaNuevo",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "P Cliente",
        accessor: "precioClienteConIva",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "N Cliente",
        accessor: "precioClienteConIvaNuevo",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "P Oferta",
        accessor: "precioOfertaConIva",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "N Oferta",
        accessor: "precioOfertaConIvaNuevo",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
    ],
    []
  );

  return (
    <div className="w-full">
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
            <Card className="border-gray-200 dark:border-slate-700">
              <FiltrosCambioPrecios
                valoresFiltros={valoresFiltros}
                setValoresFiltros={setValoresFiltros}
                marcas={marcas}
                lineas={lineas}
                sublineas={sublineas}
                productosLength={productos.length}
                onBuscar={() =>
                  buscarProductos({
                    marcaId: valoresFiltros.marcaId,
                    lineaId: valoresFiltros.lineaId,
                    subLineaId: valoresFiltros.sublineaId,
                  })
                }
                onAplicarCambios={aplicarCambios}
                onGuardarCambios={handleGuardarCambios}
                fetchMarcas={fetchMarcas}
                fetchLineas={fetchLineas}
                onLimpiarFiltros={handleLimpiarFiltros}
              />
              <CardContent className="p-0">
                <TablaCambioPrecios
                  productos={productos}
                  columns={columns}
                  onEditar={handleAbrirActualizarProducto}
                  onEliminar={handleDelete}
                />
              </CardContent>
            </Card>

            <Alertas alerts={alerts} onRemove={removeAlert} />
            <AlertasConfirmacion />
          </>
        )}
      </div>

      {mostrarActualizarProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <CambioPreciosManual
              producto={productoSeleccionado}
              onClose={handleCerrarActualizarProducto}
              onSuccess={handleActualizarSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
