import { useEffect, useState } from "react";
import MarcaService from "../services/marca-service";
import type { Marca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import Paginacion from "../../../herramientas/reutilizables/paginacion";
import { Card, CardContent, CardHeader } from "../../../ui/Card";
import { useFiltrosContext } from "../../../../context/filtros-contesxt";
import { Alertas, TipoAlerta, TituloAlerta, useAlerts } from "../../../herramientas/alertas/alertas";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";

import { HeaderLg } from "../componentes/header-lg";
import { Header } from "../componentes/header";

import { Auditoria, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { useMarcaModal } from "../hooks/use-marca-modal";
import { MarcaModal } from "../modales/marca-modal";
import { DatosTabla } from "../componentes/datos-tabla";
import { DatosCards } from "../componentes/datos-card";
import { FiltrosMarca, FiltrosMarcaValues } from "../componentes/filtros-marca";
import { getUsuarioId } from "../../../../utils/auth";

const NOMBRE_COMPONENTE = "consultar-marca";

export default function ConsultarMarcas() {
  // ===========================
  // ESTADOS PRINCIPALES
  // ===========================
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const modal = useMarcaModal();

  const usuarioId = getUsuarioId();

  // ===========================
  // FILTROS LOCALES
  // ===========================
  const [filtrosMarca, setFiltrosMarca] = useState<FiltrosMarcaValues>({ denominacion: "" });

  // ===========================
  // PAGINACIÓN
  // ===========================
  const [paginaActual, setPaginaActual] = useState(1);
  const [entidadesTotales, setEntidadesTotales] = useState(0);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);

  // ===========================
  // FILTROS
  // ===========================
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);
  const { setFiltrosNecesarios, limpiarFiltros, buscar, setBuscar } =
    useFiltrosContext();

  useEffect(() => {
    limpiarFiltros();
    setBuscar({ cont: 0, componente: NOMBRE_COMPONENTE });
    setFiltrosNecesarios({ denominacion: true });
    setFiltrosInicializados(true);
  }, []);

  useEffect(() => {
    if (buscar.cont > 0 && buscar.componente === NOMBRE_COMPONENTE) {
      handleBuscarMarcas(true);
    }
  }, [buscar]);

  // ===========================
  // CRUD / ACCIONES
  // ===========================
  const handleAltaMarca = () => {
    modal.abrirAlta();
  };

  const handleAbrirActualizarMarca = async (id: number) => {
    const marca = await MarcaService.obtenerId(id);
    modal.abrirEdicion(marca);
  };

  const handleMostrarInfo = async (id: number) => {
    const auditoria = await MarcaService.obtenerAuditoria(id);
    modal.abrirAuditoria(auditoria);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE,
      title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: "¿Estás seguro de que quieres eliminar este elemento?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (!confirmed) return;

    try {
      const response: ResponsePost = await MarcaService.eliminar(id, usuarioId);
      setMarcas((prev) => prev.filter((m) => m.id !== id));

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
        message:
          "No se puede eliminar este elemento porque está siendo utilizada por uno o más productos.",
        autoClose: true,
      });
    }
  };

  // ===========================
  // BÚSQUEDA
  // ===========================
  const handleBuscarMarcas = async (botonBuscar?: boolean) => {
    if (botonBuscar) {
      setSkip(0);
      setPaginaActual(1);
    }

    setLoading(true);

    const filtrosConPaginacion = {
      denominacion: filtrosMarca.denominacion,
      ...(filtrosMarca.incluirEliminados ? { incluirEliminados: true } : {}),
      skip,
      take,
    };

    const response = await MarcaService.obtener(filtrosConPaginacion);

    setMarcas(response.data);
    setEntidadesTotales(response.total);
    setLoading(false);
  };

  const handleBuscarDesdefiltro = (filtros: FiltrosMarcaValues) => {
    setFiltrosMarca(filtros);
  };

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarMarcas();
    }
  }, [paginaActual, filtrosInicializados]);

  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarMarcas(true);
    }
  }, [filtrosMarca]);

  const handleImprimirTodo = async () => {
    const pdfBlob = await MarcaService.imprimirTodo();
    
    const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  };

  const handleImprimirPagina = async () => {
    const pdfBlob = await MarcaService.imprimirPagina();
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

    await handleBuscarMarcas();
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
                  datosLength={marcas.length}
                  paginaActual={paginaActual}
                  openModal={handleAltaMarca}
                  handleImprimirTodo={handleImprimirTodo}
                  handleImprimirPagina={handleImprimirPagina}
                />
              </div>

              <div className="lg:hidden">
                <HeaderLg
                  entidadesTotales={entidadesTotales}
                  datosLength={marcas.length}
                  paginaActual={paginaActual}
                  openModal={handleAltaMarca}
                  handleImprimirTodo={handleImprimirTodo}
                  handleImprimirPagina={handleImprimirPagina}
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <FiltrosMarca onBuscar={handleBuscarDesdefiltro} mostrarIncluirEliminados />

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
                  <p className="text-gray-600 text-lg">Cargando marcas...</p>
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden lg:block">
                    <DatosTabla
                      marcas={marcas}
                      onEditar={handleAbrirActualizarMarca}
                      onInfo={handleMostrarInfo}
                      onDelete={handleDelete}
                    />
                  </div>

                  {/* Mobile */}
                  <div className="lg:hidden space-y-4">
                    {marcas.map(marca => (
                      <DatosCards
                        key={marca.id}
                        marca={marca}
                        onEditar={handleAbrirActualizarMarca}
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
      <MarcaModal
        open={modal.tipo !== null}
        tipo={modal.tipo}
        marca={modal.marca}
        auditoria={modal.auditoria as Auditoria | null}
        onClose={modal.cerrar}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
//hacen combinacion de informacion. El consultar muestra los datos. El registrar hace el abm y actualiza. El consultar decide el componente qeu vas a utilizar, card o tabla. LE PASA A LA CARD O TABLA LSA ENTIDADES QUE TIENE QUE BUSCAR . EWS UN PASAMANO. LLAM A FILTROS, FILTROS DEVUELVE, Y SE LO PASA A L TABLA O COMPONENTE DE CARD. 