import { useEffect, useState } from "react";
import { Info, Pencil, PlusCircle, Trash, Wallet } from "lucide-react";
import { Button } from "../../ui/Button";
import { Column, TablaAGGrid } from "../../herramientas/tablas/tabla-flexible-ag-grid";
import Paginacion from "../../herramientas/reutilizables/paginacion";
import { Auditoria, CondicionIva } from "../../../interfaces/generales/interfaces-generales";
import CondicionIvaService from "./condicion-iva-service";
import RegistrarActualizarCondicionIvaForm from "./registrar-actualizar-condicion-iva";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../herramientas/alertas/alertas-confirmacion";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../herramientas/alertas/alertas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import FiltrosAplicados from "../../herramientas/reutilizables/filtros-aplicados";
import InformacionAuditoria from "../../herramientas/reutilizables/informacion-auditoria";
import {
  denominacionNotScrollColumnProps,
  observacionesColumnProps,
} from "../../herramientas/tablas/formateo-columnas-documentos";
import { EstadisticasSimples } from "../../herramientas/reutilizables/estadisticas-simples";
import { ImpresionForm } from "../../herramientas/reutilizables/impresion-form";
import { getUsuarioId } from "../../../utils/auth";

export default function ConsultarCondicionIva() {
  const [condicionesIva, setCondicionesIva] = useState<CondicionIva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [mostrarActualizarCondicionIva, setMostrarActualizarCondicionIva] = useState(false);
  const [condicionIvaSeleccionada, setCondicionIvaSeleccionada] = useState<CondicionIva>({} as CondicionIva);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usuario = getUsuarioId();
  const usuarioId = usuario;

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

  const [filtros] = useState({
    denominacion: "",
    skip: 0,
    take: take,
  });

  const handleAbrirActualizarCondicionIva = async (id: number) => {
    if (id) {
      const condicionIva = await CondicionIvaService.obtenerId(id);
      setCondicionIvaSeleccionada(condicionIva);
      setMostrarActualizarCondicionIva(true);
    }
  };

  const handleCerrarActualizarCondicionIva = () => {
    setMostrarActualizarCondicionIva(false);
    setCondicionIvaSeleccionada({} as CondicionIva); // Reset de la condicionIva seleccionada
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
    try {
      await CondicionIvaService.eliminar(id, usuarioId);
      setCondicionesIva(condicionesIva.filter((condicion) => condicion.id !== id));
      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: "Condición de Iva eliminada correctamente.",
        autoClose: true,
        duration: 3000,
      });
    } catch (err: any) {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se puede eliminar este elemento porque está siendo utilizada.",
        autoClose: true,
        duration: 3000,
      });
    }
  };

  const handleMostrarInfo = async (id: number) => {
    if (id) {
      const datosAuditoria = await CondicionIvaService.obtenerAuditoria(id);
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

  const handleSuccess = async (denominacionCondicionIva: string) => {
    closeModal(); // Cierra el modal
    setLoading(true);

    // Limpio los filtros y seteo solo códigoProveedor
    const nuevosFiltros = {
      denominacion: denominacionCondicionIva,
      skip: 0,
      take: take,
    };

    //setFiltros(nuevosFiltros);

    const condicionesIva = await CondicionIvaService.obtener(nuevosFiltros);
    console.log("Condiciones de Iva filtrados después de agregar:", condicionesIva);

    setLoading(false);

    setEntidadesTotales(condicionesIva.total);
    setPaginaActual(paginaActual);

    setCondicionesIva(condicionesIva.data);
  };

  const handleBuscarCondicionesIva = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      resetearPaginacion();
    }

    setLoading(true);

    const filtrosConPaginacion = {
      ...filtros,
      skip: skip,
      take: take,
    };

    const condicionesIvaFiltradas = await CondicionIvaService.obtener(filtrosConPaginacion);

    setLoading(false);
    setCondicionesIva(condicionesIvaFiltradas.data);
    setEntidadesTotales(condicionesIvaFiltradas.total);
  };

  // MANEJO DE PAGINACION ===========================================

  useEffect(() => {
    handleBuscarCondicionesIva();
  }, [paginaActual]);

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

  const handleImprimirTodo = async () => {
    try {
      const pdfBlob = await CondicionIvaService.imprimirTodo();
      const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const handleImprimirPagina = async () => {
    try {
      const pdfBlob = await CondicionIvaService.imprimirTodo();
      const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const columns: Column<CondicionIva>[] = [
    {
      header: "Denominación",
      accessor: "denominacion",
      ...denominacionNotScrollColumnProps,
    },
    {
      header: "CUIT Requerido",
      accessor: "requiereCuit",
      flex: 0.5,
      type: "text",
      editable: false,
      formatFunction: ({ value }) => <>{value ? "SI" : "NO"}</>,
    },
    {
      header: "Documento Requerido",
      accessor: "requiereDocumento",
      flex: 0.5,
      type: "text",
      editable: false,
      formatFunction: ({ value }) => <>{value ? "SI" : "NO"}</>,
    },
    {
      header: "Letra",
      accessor: "letra",
      flex: 0.3,
      type: "text",
      editable: false,
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando Condiciones de IVA...</p>
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
              <CardHeader className="flex flex-row items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-6">
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="consultar-icon" />
                    <span>Condiciones de IVA</span>
                    <EstadisticasSimples filtrados={entidadesTotales} mostrados={condicionesIva.length} />
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <ImpresionForm
                    entityName="Condiciones de Iva"
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
                <FiltrosAplicados />
                <div className="overflow-x-auto">
                  <TablaAGGrid
                    columns={columns}
                    data={condicionesIva}
                    onUpdate={() => {}}
                    actions={(row) => (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirActualizarCondicionIva(row.id)}
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
                          title="Eliminar producto"
                          disabled={row.sistema > 0}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    )}
                    actionsFlex={1.1}
                    actionsScrollable={true}
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
            <Alertas alerts={alerts} onRemove={removeAlert} />
            <AlertasConfirmacion />
          </>
        )}
      </div>
      {/* Modal para el formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RegistrarActualizarCondicionIvaForm onClose={closeModal} onSuccess={handleSuccess} />
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

      {mostrarActualizarCondicionIva && condicionIvaSeleccionada !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RegistrarActualizarCondicionIvaForm
              condicionIva={condicionIvaSeleccionada}
              onClose={handleCerrarActualizarCondicionIva}
              onSuccess={() => handleBuscarCondicionesIva()} // <-- Se refrescan los datos al cerrar el formulario
            />
          </div>
        </div>
      )}
    </div>
  );
}
