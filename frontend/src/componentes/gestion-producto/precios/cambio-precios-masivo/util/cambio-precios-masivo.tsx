import { useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "../../../../ui/Card";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../../herramientas/alertas/alertas";
import { ConsultarProductosCambioPreciosMasivo } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { formatPrice } from "../../../../herramientas/formateo-de-campos/fucion-formateo";
import { Column } from "../../../../herramientas/tablas/tabla-flexible-ag-grid";
import { useFiltrosContext } from "../../../../../context/filtros-contesxt";
import CambioPreciosMasivoService from "../cambio-precios-masivo-service";
import { useCatalogosContext } from "../../../../../context/catalogos-context";
import { getUsuarioId } from "../../../../../utils/auth";
import { useCambioPrecios } from "../hooks/useCambioPrecios";
import TablaCambioPrecios from "../componentes/tabla-cambio-precios";
import FiltrosCambioPrecios from "../componentes/filtros-cambio-precios";
import { TipoAjustePrecio } from "../../../../../interfaces/gestion-producto/producto/interfaces-producto";

export default function CambioPreciosMasivo() {
  const usuarioId = getUsuarioId();
  const { alerts, addAlert, removeAlert } = useAlerts();

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
    resultado,
    loading,
    simular,
    aplicar,
    limpiar,
  } = useCambioPrecios(usuarioId);

  const { marcas, lineas, setLineas, setMarcas } = useCatalogosContext();

  useEffect(() => {
    limpiarFiltros();
    limpiar();
    setBuscar({ cont: 0, componente: "cambio-precios-masivo" });
    setFiltrosNecesarios({ marca: true, linea: true });
  }, []);

  const fetchMarcas = useCallback(async () => {
    try {
      const marcasTotales = await CambioPreciosMasivoService.buscarMarcas(
        valoresFiltros.denominacionMarca || ""
      );
      setMarcas(marcasTotales.data ?? marcasTotales);
    } catch {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se pudieron cargar las marcas.",
        autoClose: true,
        duration: 3000,
      });
    }
  }, [valoresFiltros.denominacionMarca]);

  useEffect(() => {
    fetchMarcas();
  }, [buscarMarcas]);

  const fetchLineas = useCallback(async () => {
    try {
      const lineasTotales = await CambioPreciosMasivoService.buscarLineas(
        valoresFiltros.denominacionLinea || ""
      );
      setLineas(lineasTotales.data ?? lineasTotales);
    } catch {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se pudieron cargar las líneas.",
        autoClose: true,
        duration: 3000,
      });
    }
  }, [valoresFiltros.denominacionLinea]);

  useEffect(() => {
    fetchLineas();
  }, [buscarLineas]);

  const handleSimular = useCallback(
    async (tipoAjuste: TipoAjustePrecio, valor: number) => {
      try {
        await simular({
          tipoAjuste,
          valor,
          lineaId: valoresFiltros.lineaId,
          marcaId: valoresFiltros.marcaId,
        });
      } catch {
        addAlert({
          type: TipoAlerta.ERROR,
          title: TituloAlerta.ERROR,
          message: "No se pudo calcular la previsualización del aumento.",
          autoClose: true,
          duration: 3000,
        });
      }
    },
    [simular, valoresFiltros.lineaId, valoresFiltros.marcaId]
  );

  const handleAplicar = useCallback(
    async (motivo: string) => {
      try {
        const res = await aplicar(motivo);
        addAlert({
          type: TipoAlerta.SUCCESS,
          title: TituloAlerta.SUCCESS,
          message: `Se actualizaron ${res.actualizados.length} producto(s).${
            res.fallidos.length > 0 ? ` ${res.fallidos.length} no se pudieron actualizar.` : ""
          }`,
          autoClose: true,
          duration: 4000,
        });
      } catch (error: any) {
        addAlert({
          type: TipoAlerta.ERROR,
          title: TituloAlerta.ERROR,
          message: error?.message ?? "No se pudo aplicar el aumento.",
          autoClose: true,
          duration: 3000,
        });
      }
    },
    [aplicar]
  );

  const handleLimpiarFiltros = useCallback(() => {
    setValoresFiltros({
      denominacionMarca: "",
      denominacionLinea: "",
      marcaId: undefined,
      lineaId: undefined,
    });
    setLineas([]);
    setMarcas([]);
    limpiar();
  }, [setValoresFiltros, setLineas, setMarcas, limpiar]);

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
        flex: 1.5,
        type: "text",
        editable: false,
        scrollable: false,
      },
      {
        header: "Precio actual",
        accessor: "precioActual",
        flex: 0.6,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
      },
      {
        header: "Precio nuevo",
        accessor: "precioNuevo",
        flex: 0.6,
        type: "text",
        editable: false,
        align: "right",
        formatFunction: ({ value }) => (
          <span className="font-semibold text-green-700">{formatPrice(value, "ARS")}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <div className="p-6">
        <Card className="border-gray-200 dark:border-slate-700">
          <FiltrosCambioPrecios
            valoresFiltros={valoresFiltros}
            setValoresFiltros={setValoresFiltros}
            marcas={marcas}
            lineas={lineas}
            productosLength={productos.length}
            loading={loading}
            onSimular={handleSimular}
            onAplicar={handleAplicar}
            fetchMarcas={fetchMarcas}
            fetchLineas={fetchLineas}
            onLimpiarFiltros={handleLimpiarFiltros}
          />
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Procesando...</p>
              </div>
            ) : productos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {resultado
                  ? "Aumento aplicado. Simulá un nuevo aumento para continuar."
                  : "Elegí una marca o línea (opcional), un tipo de ajuste y simulá para ver la previsualización."}
              </p>
            ) : (
              <>
                <p className="px-4 py-2 text-sm text-gray-600">
                  El aumento se aplicará a los <strong>{productos.length}</strong> producto(s) listados.
                  Para acotarlo, cambiá la marca o la línea y volvé a simular.
                </p>
                <TablaCambioPrecios productos={productos} columns={columns} />
              </>
            )}
          </CardContent>
        </Card>

        <Alertas alerts={alerts} onRemove={removeAlert} />
      </div>
    </div>
  );
}
