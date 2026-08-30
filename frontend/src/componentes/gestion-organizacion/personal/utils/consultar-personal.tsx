import { useEffect, useState } from "react";
import PersonalService from "../services/personal-service";
import type { IConsultarPersonal, Personal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";
import Paginacion from "../../../herramientas/reutilizables/paginacion";
import { Card, CardContent, CardHeader } from "../../../ui/Card";
import { useFiltrosContext } from "../../../../context/filtros-contesxt";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../herramientas/alertas/alertas";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { Auditoria, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { usePersonalModal } from "../hooks/use-personal-modal";
import { PersonalModal } from "../modales/personal-modal";
import { DatosTabla } from "../componentes/datos-tabla";
import { DatosCards } from "../componentes/datos-card";
import { Header } from "../componentes/header";
import { HeaderLg } from "../componentes/header-lg";
import { FiltrosPersonal, FiltrosPersonalValues } from "../componentes/filtros-personal";
import { getUsuarioId } from "../../../../utils/auth";

const NOMBRE_COMPONENTE = "consultar-personal";

export default function ConsultarPersonal() {
  // ===========================
  // ESTADOS PRINCIPALES
  // ===========================
  const [personales, setPersonales] = useState<IConsultarPersonal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const modal = usePersonalModal();
  const usuarioId = getUsuarioId();

  // ===========================
  // FILTROS LOCALES
  // ===========================
  const [filtrosPersonal, setFiltrosPersonal] = useState<FiltrosPersonalValues>({ denominacion: "" });

  // ===========================
  // PAGINACIÓN
  // ===========================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(0);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);

  // ===========================
  // FILTROS CONTEXTO
  // ===========================
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);
  const { setFiltrosNecesarios, limpiarFiltros, buscar, setBuscar } = useFiltrosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: NOMBRE_COMPONENTE });
    setFiltrosNecesarios({ denominacion: true });
    setFiltrosInicializados(true);
  }, []);

  useEffect(() => {
    if (buscar.cont > 0 && buscar.componente === NOMBRE_COMPONENTE) {
      handleBuscarPersonales(true);
    }
  }, [buscar]);

  // ===========================
  // CRUD / ACCIONES
  // ===========================
  const handleAltaPersonal = () => {
    modal.abrirAlta();
  };

  const handleAbrirEdicion = async (id: number) => {
    const personal = await PersonalService.obtenerId(id);
    modal.abrirEdicion(personal);
  };

  const handleMostrarInfo = async (id: number) => {
    const auditoria = await PersonalService.obtenerAuditoria(id);
    modal.abrirAuditoria(auditoria);
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
      const response: ResponsePost = await PersonalService.eliminar(id, usuarioId);
      setPersonales((prev) => prev.filter((p) => p.id !== id));

      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: response.mensaje,
        autoClose: true,
      });
    } catch {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se puede eliminar este elemento porque está siendo utilizado.",
        autoClose: true,
      });
    }
  };

  // ===========================
  // BÚSQUEDA
  // ===========================
  const handleBuscarPersonales = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      setSkip(0);
      setPaginaActual(1);
    }

    setLoading(true);

    const filtrosConPaginacion = {
      denominacion: filtrosPersonal.denominacion,
      ...(filtrosPersonal.incluirEliminados ? { incluirEliminados: true } : {}),
      skip,
      take,
    };

    const response = await PersonalService.obtener(filtrosConPaginacion);

    setPersonales(response.data);
    setEntidadesTotales(response.total);
    setLoading(false);
  };

  const handleBuscarDesdeFiltro = (filtros: FiltrosPersonalValues) => {
    setFiltrosPersonal(filtros);
  };

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarPersonales();
    }
  }, [paginaActual, filtrosInicializados]);

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarPersonales(true);
    }
  }, [filtrosPersonal]);

  const handleImprimirTodo = async () => {
    const pdfBlob = await PersonalService.imprimirTodo();
    const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  };

  const handleImprimirPagina = async () => {
    const pdfBlob = await PersonalService.imprimirPagina();
    const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  };

  const handlePageChange = (skip: number, take: number, paginaActual: number) => {
    setSkip(skip);
    setTake(take);
    setPaginaActual(paginaActual);
  };

  // ===========================
  // SUCCESS MODAL
  // ===========================
  const handleSuccess = async (mensajeAlerta: string) => {
    modal.cerrar();

    addAlert({
      type: TipoAlerta.SUCCESS,
      title: TituloAlerta.SUCCESS,
      message: mensajeAlerta,
      autoClose: true,
    });

    await handleBuscarPersonales();
  };

  // ===========================
  // RENDER
  // ===========================
  if (error) {
    return (
      <div className="w-full p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <>
        <Card>
          <CardHeader className="flex justify-between">
            <div className="hidden lg:block">
              <Header
                entidadesTotales={entidadesTotales}
                datosLength={personales.length}
                paginaActual={paginaActual}
                openModal={handleAltaPersonal}
                handleImprimirTodo={handleImprimirTodo}
                handleImprimirPagina={handleImprimirPagina}
              />
            </div>

            <div className="lg:hidden">
              <HeaderLg
                entidadesTotales={entidadesTotales}
                datosLength={personales.length}
                paginaActual={paginaActual}
                openModal={handleAltaPersonal}
                handleImprimirTodo={handleImprimirTodo}
                handleImprimirPagina={handleImprimirPagina}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <FiltrosPersonal onBuscar={handleBuscarDesdeFiltro} mostrarIncluirEliminados />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
                <p className="text-gray-600 text-lg">Cargando personal...</p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden lg:block">
                  <DatosTabla
                    personales={personales}
                    onEditar={handleAbrirEdicion}
                    onInfo={handleMostrarInfo}
                    onDelete={handleDelete}
                  />
                </div>

                {/* Mobile */}
                <div className="lg:hidden space-y-4">
                  {personales.map((personal) => (
                    <DatosCards
                      key={personal.id}
                      personal={personal}
                      onEditar={handleAbrirEdicion}
                      onInfo={handleMostrarInfo}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </>
            )}
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

        <Alertas alerts={alerts} onRemove={removeAlert} />
        <AlertasConfirmacion />
      </>

      {/* MODAL ÚNICO */}
      <PersonalModal
        open={modal.tipo !== null}
        tipo={modal.tipo}
        personal={modal.personal}
        auditoria={modal.auditoria as Auditoria | null}
        onClose={modal.cerrar}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
