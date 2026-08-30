import { useState, useEffect, useMemo, useCallback } from "react";
import { formatPrice } from "../../../../herramientas/formateo-de-campos/fucion-formateo";
import { Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { Card, CardContent, CardHeader } from "../../../../ui/Card";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../../herramientas/alertas/alertas";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../../herramientas/alertas/alertas-confirmacion";
import { ConsultarProductosListaPrecios } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { useConfiguracionSistema } from "../../../../sistema/ConfiguracionSistemaContext";
import { useFiltrosContext } from "../../../../../context/filtros-contesxt";
import CambioPreciosMasivoService from "../service/lista-precios-service";
import { useCatalogosContext } from "../../../../../context/catalogos-context";
import { getUsuarioId } from "../../../../../utils/auth";
import { useCambioPrecios } from "../hooks/useCambioPrecios";
import TablaCambioPrecios from "../componentes/tabla-cambio-precios";
import FiltrosCambioPrecios from "../componentes/filtros-cambio-precios";
import { ColumnasImprimir } from "../../../../herramientas/reutilizables/columnas-imprimir";

export default function ListaPrecios() {
  const columns = useMemo<Column<ConsultarProductosListaPrecios>[]>(
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
        header: "Stock",
        accessor: "stock",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
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
        header: "P Mayorista",
        accessor: "precioMayoristaConIva",
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
        header: "P Oferta",
        accessor: "precioOfertaConIva",
        flex: 0.5,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
    ],
    []
  );

  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState<string[]>(
    columns.map((col) => col.accessor as string)
  );
  const [error, setError] = useState<string | null>(null);

  const usuarioId = getUsuarioId();
  const { configuracion } = useConfiguracionSistema();
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { AlertasConfirmacion } = useConfirmation();

  const columnasParaImprimir = useMemo(
    () => columns.filter((col) => columnasSeleccionadas.includes(col.accessor as string)),
    [columns, columnasSeleccionadas]
  );

  const {
    setFiltrosNecesarios,
    valoresFiltros,
    setValoresFiltros,
    limpiarFiltros,
    setBuscar,
    buscarMarcas,
    buscarLineas,
  } = useFiltrosContext();

  const { productos, loading, setProductos, buscarProductos } = useCambioPrecios(usuarioId);

  const { marcas, lineas, sublineas, setLineas, setMarcas, setSublineas } = useCatalogosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: "lista-precios" });
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

  const handleImprimir = useCallback(async () => {
    const columnasParaEnviar = columns
      .filter((col) => columnasSeleccionadas.includes(col.accessor as string))
      .map((col) => ({
        accessor: col.accessor,
        header: col.header,
        type: col.type,
      }));

    const payload = {
      columnas: columnasParaEnviar,
      marcaId: valoresFiltros.marcaId,
      lineaId: valoresFiltros.lineaId,
      subLineaId: valoresFiltros.sublineaId,
      usuarioId: getUsuarioId(),
    };

    const pdfBlob = await CambioPreciosMasivoService.imprimirListaPrecios(payload);
    const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  }, [columns, columnasSeleccionadas, valoresFiltros]);

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
                fetchMarcas={fetchMarcas}
                fetchLineas={fetchLineas}
                onLimpiarFiltros={handleLimpiarFiltros}
              />

              <CardHeader>
                <ColumnasImprimir
                  columns={columns}
                  columnasSeleccionadas={columnasSeleccionadas}
                  onCambiarSeleccion={setColumnasSeleccionadas}
                  onImprimir={handleImprimir}
                />
              </CardHeader>

              <CardContent className="p-0">
                <TablaCambioPrecios productos={productos} columns={columnasParaImprimir} />
              </CardContent>
            </Card>

            <Alertas alerts={alerts} onRemove={removeAlert} />
            <AlertasConfirmacion />
          </>
        )}
      </div>
    </div>
  );
}
