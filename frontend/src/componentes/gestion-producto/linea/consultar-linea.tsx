import { useEffect, useState } from "react";
import { Info, Layers, Pencil, PlusCircle, Trash } from "lucide-react";
import { Button } from "../../ui/Button";
import { Linea } from "../../../interfaces/gestion-producto/linea/interfaces-linea";
import Paginacion from "../../herramientas/reutilizables/paginacion";
import { TablaAGGrid, Column } from "../../herramientas/tablas/tabla-flexible-ag-grid";
import { useFiltrosContext } from "../../../context/filtros-contesxt";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../herramientas/alertas/alertas-confirmacion";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../herramientas/alertas/alertas";
import { Auditoria, ResponsePost } from "../../../interfaces/generales/interfaces-generales";
import InformacionAuditoria from "../../herramientas/reutilizables/informacion-auditoria";
import {
  denominacionNotScrollColumnProps,
  observacionesColumnProps,
} from "../../herramientas/tablas/formateo-columnas-documentos";
import { EstadisticasSimples } from "../../herramientas/reutilizables/estadisticas-simples";
import { ImpresionForm } from "../../herramientas/reutilizables/impresion-form";
import { getUsuarioId } from "../../../utils/auth";
import { FiltrosLinea, FiltrosLineaValues } from "./componentes/filtros-linea";
import LineaService from "./services/linea-service";
import RegistrarActualizarLineaForm from "./utils/registrar-actualizar-linea";

export default function ConsultarSuperlinea() {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [mostrarActualizarLinea, setMostrarActualizarLinea] = useState(false);
  const [lineaSeleccionada, setLineaSeleccionada] = useState<Linea>({} as Linea);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion: AlertasConfirmacion } = useConfirmation();

  const [mostrarInfoAuditoria, setMostrarInfoAuditoria] = useState(false);
  const [auditoria, setAuditoria] = useState<Auditoria>({} as Auditoria);

  // MANEJO DE PAGINACION =======================================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(1);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  // MANEJO DE PAGINACION =======================================

  const usuarioId = getUsuarioId();

  // MANEJO DE FILTROS ========================================================
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);
  const { setFiltrosNecesarios, limpiarFiltros, buscar, setBuscar } = useFiltrosContext();

  // Filtros locales
  const [filtrosLinea, setFiltrosLinea] = useState<FiltrosLineaValues>({ denominacion: "" });

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: "consultar-linea" });
    setFiltrosNecesarios({
      denominacion: true,
    });
    setFiltrosInicializados(true);
  }, []);

  useEffect(() => {
    console.log("el buscar es:", buscar);
    if (buscar.cont > 0 && buscar.componente === "consultar-linea") {
      handleBuscarLineas(true);
    }
  }, [buscar]);

  // MANEJO DE FILTROS ========================================================

  const handleAbrirActualizarLinea = async (id: number) => {
    if (id) {
      const linea = await LineaService.obtenerId(id);
      setLineaSeleccionada(linea);
      setMostrarActualizarLinea(true);
    }
  };

  const handleCerrarActualizarLinea = () => {
    setMostrarActualizarLinea(false);
    setLineaSeleccionada({} as Linea);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE,
      title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (!confirmed) return;

    let response: ResponsePost;
    try {
      response = await LineaService.eliminar(id, usuarioId);

      setLineas(lineas.filter((linea) => linea.id !== id));

      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: response.mensaje,
        autoClose: true,
        duration: 3000,
      });
    } catch (err: any) {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se puede eliminar este elemento porque está siendo utilizada por uno o más productos.",
        autoClose: true,
        duration: 3000,
      });
    }
  };

  const handleMostrarInfo = async (id: number) => {
    if (id) {
      const datosAuditoria = await LineaService.obtenerAuditoria(id);
      setAuditoria(datosAuditoria);
      setMostrarInfoAuditoria(true);
    }
  };

  const handleCerrarInfo = () => {
    setMostrarInfoAuditoria(false);
    setAuditoria({} as Auditoria);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = async (mensajeAlerta: string) => {
    closeModal();

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: mensajeAlerta,
      autoClose: true,
      duration: 3000,
    });

    setLoading(true);

    const filtrosConPaginacion = {
      denominacion: filtrosLinea.denominacion,
      skip: skip,
      take: take,
    };

    const lineas = await LineaService.obtener(filtrosConPaginacion);
    setLoading(false);
    setEntidadesTotales(lineas.total);
    setPaginaActual(paginaActual);
    setLineas(lineas.data);
  };

  const handleActualizarSuccess = async (mensajeAlerta: string) => {
    closeModal();

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: mensajeAlerta,
      autoClose: true,
      duration: 3000,
    });

    setLoading(true);

    await handleBuscarLineas();
  };

  const handleBuscarLineas = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      resetearPaginacion();
    }
    setLoading(true);

    const filtrosConPaginacion = {
      denominacion: filtrosLinea.denominacion,
      skip: skip,
      take: take,
    };

    const lineasFiltradas = await LineaService.obtener(filtrosConPaginacion);
    setLineas(lineasFiltradas.data);
    setEntidadesTotales(lineasFiltradas.total);
    setLoading(false);
  };

  const handleBuscarDesdeFiltro = (filtros: FiltrosLineaValues) => {
    setFiltrosLinea(filtros);
  };

  // MANEJO DE PAGINACION ===========================================

  useEffect(() => {
    if (filtrosInicializados === true) {
      handleBuscarLineas();
    }
  }, [paginaActual, filtrosInicializados]);

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarLineas(true);
    }
  }, [filtrosLinea]);

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

  const handleImprimirTodo = async () => {
    try {
      const pdfBlob = await LineaService.imprimirTodo();
      const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const handleImprimirPagina = async () => {
    try {
      const pdfBlob = await LineaService.imprimirTodo();
      const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const columns: Column<Linea>[] = [
    {
      header: "Denominación",
      accessor: "denominacion",
      ...denominacionNotScrollColumnProps,
    },
    {
      header: "Observación",
      accessor: "observacion",
      ...observacionesColumnProps,
    },
  ];

  return (
    <div className="w-full">
      <div className="p-6">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <Card className="border-gray-200 dark:border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-6">
                  <CardTitle className="flex items-center space-x-2">
                    <Layers className="consultar-icon" />
                    <span>Líneas</span>
                    <EstadisticasSimples filtrados={entidadesTotales} mostrados={lineas.length} />
                  </CardTitle>
                </div>
                {/* Contenedor de botones */}
                <div className="flex items-center gap-2">
                  <ImpresionForm
                    entityName="Líneas"
                    onImprimirTodo={handleImprimirTodo}
                    onImprimirPagina={handleImprimirPagina}
                    totalItems={entidadesTotales}
                    currentPage={paginaActual}
                  />
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white flex items-center px-4 py-3"
                    onClick={openModal}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <FiltrosLinea onBuscar={handleBuscarDesdeFiltro} mostrarIncluirEliminados />

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando lineas...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <TablaAGGrid
                      columns={columns}
                      data={lineas}
                      onUpdate={() => {}}
                      actions={(row) => (
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirActualizarLinea(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Actualizar producto"
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMostrarInfo(row.id)}
                            className="bg-blue-500 text-white hover:bg-blue-800 w-8 h-8 flex items-center justify-center"
                            title="Ver información del producto"
                          >
                            <Info size={18} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(row.id)}
                            className={`w-8 h-8 flex items-center justify-center ${row.sistema > 0 ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-800"}`}
                            disabled={row.sistema > 0}
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      )}
                      actionsFlex={1.1}
                      actionsScrollable={false}
                      rowHeight={55}
                    />
                  </div>
                )}
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

        <Alertas alerts={alerts} onRemove={removeAlert} />
        <AlertasConfirmacion />
      </div>

      {/* Modal para Agregar Linea */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <RegistrarActualizarLineaForm onClose={closeModal} onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Modal para Mostrar Información */}
      {mostrarInfoAuditoria && auditoria && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <InformacionAuditoria auditoria={auditoria} onClose={handleCerrarInfo}></InformacionAuditoria>
              <div className="mt-6 pt-4 border-t">
                <Button onClick={handleCerrarInfo} className="btn btn-dark">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarActualizarLinea && lineaSeleccionada !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RegistrarActualizarLineaForm
              linea={lineaSeleccionada}
              onClose={handleCerrarActualizarLinea}
              onSuccess={handleActualizarSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
