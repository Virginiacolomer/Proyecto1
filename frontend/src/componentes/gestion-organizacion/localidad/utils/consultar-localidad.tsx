import { useEffect, useState } from "react";
import LocalidadService from "../services/localidad-service";
import type { Localidad } from "../../../../interfaces/gestion-organizacion/localidad/interfaces-localidad";
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
import { useLocalidadModal } from "../hooks/use-localidad-modal";
import { LocalidadModal } from "../modales/localidad-modal";
import { DatosTabla } from "../componentes/datos-tabla";
import { DatosCards } from "../componentes/datos-card";
import { Header } from "../componentes/header";
import { HeaderLg } from "../componentes/header-lg";
import { FiltrosLocalidad, FiltrosLocalidadValues } from "../componentes/filtros-localidad";
import { getUsuarioId } from "../../../../utils/auth";
import { useConfiguracionSistema } from "../../../sistema/ConfiguracionSistemaContext";
import { useCatalogosContext } from "../../../../context/catalogos-context";

const NOMBRE_COMPONENTE = "consultar-localidad";

export default function ConsultarLocalidad() {
  // ===========================
  // ESTADOS PRINCIPALES
  // ===========================
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const modal = useLocalidadModal();
  const usuarioId = getUsuarioId();
  const { configuracion } = useConfiguracionSistema();
  const { setProvincias } = useCatalogosContext();

  // ===========================
  // FILTROS LOCALES
  // ===========================
  const [filtrosLocalidad, setFiltrosLocalidad] = useState<FiltrosLocalidadValues>({ denominacion: "" });

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
  const { setFiltrosNecesarios, valoresFiltros, limpiarFiltros, buscar, setBuscar } = useFiltrosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: NOMBRE_COMPONENTE });
    setFiltrosNecesarios({ denominacion: true, provincia: true });
    setFiltrosInicializados(true);
  }, []);

  useEffect(() => {
    if (buscar.cont > 0 && buscar.componente === NOMBRE_COMPONENTE) {
      handleBuscarLocalidades(true);
    }
  }, [buscar]);

  // Carga provincias para el filtro de sidebar cuando cambia la denominación de provincia
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const caracteresParaBusqueda = configuracion?.caracteresParaBusqueda ?? 4;
        if (
          valoresFiltros.denominacionProvincia &&
          valoresFiltros.denominacionProvincia.length >= caracteresParaBusqueda
        ) {
          const provinciasTotales = await LocalidadService.obtenerTotales({ denominacion: " " }, "provincias");
          setProvincias(provinciasTotales.data);
        }
      } catch (err) {
        console.error("Error al obtener provincias:", err);
      }
    };
    fetchProvincias();
  }, [valoresFiltros.denominacionProvincia]);

  // ===========================
  // CRUD / ACCIONES
  // ===========================
  const handleAltaLocalidad = () => {
    modal.abrirAlta();
  };

  const handleAbrirEdicion = async (id: number) => {
    const localidad = await LocalidadService.obtenerId(id);
    modal.abrirEdicion(localidad);
  };

  const handleMostrarInfo = async (id: number) => {
    const auditoria = await LocalidadService.obtenerAuditoria(id);
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
      const response: ResponsePost = await LocalidadService.eliminar(id, usuarioId);
      setLocalidades((prev) => prev.filter((l) => l.id !== id));

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
        message: "No se puede eliminar este elemento porque está siendo utilizada.",
        autoClose: true,
      });
    }
  };

  // ===========================
  // BÚSQUEDA
  // ===========================
  const handleBuscarLocalidades = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      setSkip(0);
      setPaginaActual(1);
    }

    setLoading(true);

    const filtrosConPaginacion = {
      denominacion: filtrosLocalidad.denominacion,
      ...(filtrosLocalidad.incluirEliminados ? { incluirEliminados: true } : {}),
      provinciaId: valoresFiltros.provinciaId,
      skip,
      take,
    };

    const response = await LocalidadService.obtener(filtrosConPaginacion);

    setLocalidades(response.data);
    setEntidadesTotales(response.total);
    setLoading(false);
  };

  const handleBuscarDesdeFiltro = (filtros: FiltrosLocalidadValues) => {
    setFiltrosLocalidad(filtros);
  };

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarLocalidades();
    }
  }, [paginaActual, filtrosInicializados]);

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarLocalidades(true);
    }
  }, [filtrosLocalidad]);

  const handleImprimirTodo = async () => {
    const pdfBlob = await LocalidadService.imprimirTodo();
    const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  };

  const handleImprimirPagina = async () => {
    const pdfBlob = await LocalidadService.imprimirPagina();
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

    await handleBuscarLocalidades();
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
                datosLength={localidades.length}
                paginaActual={paginaActual}
                openModal={handleAltaLocalidad}
                handleImprimirTodo={handleImprimirTodo}
                handleImprimirPagina={handleImprimirPagina}
              />
            </div>

            <div className="lg:hidden">
              <HeaderLg
                entidadesTotales={entidadesTotales}
                datosLength={localidades.length}
                paginaActual={paginaActual}
                openModal={handleAltaLocalidad}
                handleImprimirTodo={handleImprimirTodo}
                handleImprimirPagina={handleImprimirPagina}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <FiltrosLocalidad onBuscar={handleBuscarDesdeFiltro} mostrarIncluirEliminados />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
                <p className="text-gray-600 text-lg">Cargando localidades...</p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden lg:block">
                  <DatosTabla
                    localidades={localidades}
                    onEditar={handleAbrirEdicion}
                    onInfo={handleMostrarInfo}
                    onDelete={handleDelete}
                  />
                </div>

                {/* Mobile */}
                <div className="lg:hidden space-y-4">
                  {localidades.map((localidad) => (
                    <DatosCards
                      key={localidad.id}
                      localidad={localidad}
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
      <LocalidadModal
        open={modal.tipo !== null}
        tipo={modal.tipo}
        localidad={modal.localidad}
        auditoria={modal.auditoria as Auditoria | null}
        onClose={modal.cerrar}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
