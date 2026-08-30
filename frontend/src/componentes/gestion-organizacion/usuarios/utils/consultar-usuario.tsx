import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import Paginacion from "../../../herramientas/reutilizables/paginacion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import FiltrosAplicados from "../../../herramientas/reutilizables/filtros-aplicados";

import { Alertas } from "../../../herramientas/alertas/alertas";
import { useConfirmation } from "../../../herramientas/alertas/alertas-confirmacion";

import { CabeceraDocumentoProvider } from "../../../../context/cabecera-documentos-context";
import { TotalesDocumentoProvider } from "../../../../context/totales-documento-context";

import { usePaginacion } from "../../../../hooks/use-paginacion";
import { PAGINACION } from "../../../../config/paginacion";


import { useFiltrosContext } from "../../../../context/filtros-contesxt";
import { useAlerts } from "../../../herramientas/alertas/alertas";

import { getAuthData } from "../../../../utils/auth";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";

import { Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { Button } from "../../../ui/Button";
import { ColumnasImprimir } from "../../../herramientas/reutilizables/columnas-imprimir";

import { useUsuarios } from "../hooks/use-usuario";
import { useUsuarioModales } from "../hooks/use-usuario-modales";
import { useUsuariosFiltros } from "../hooks/use-usuarios-filtros";
import UsuarioService from "../services/usuario-service";
import { HeaderUsuarios } from "../componentes/header-usuario";
import { HeaderUsuarioLg } from "../componentes/header-usuario-lg";
import { UsuariosTabla } from "../componentes/usuario-tabla";
import { UsuariosCards } from "../componentes/usuarios-card";
import { UsuarioModales } from "../modales/usuario-modales";
import { useUsuarioImpresion } from "../hooks/use-usuario-impresion";
import { ConsultarUsuario } from "../../../../interfaces/gestion-usuario/interfaces-usuario";


// =========================
// COMPONENTE
// =========================
export default function ConsultarUsuarios() {

  const columns: Column<ConsultarUsuario>[] = [
    
    {
      header: "Denominación",
      accessor: "denominacion",
      flex: 1.3,
      type: "text",
      editable: false,
      scrollable: false,
      
    },
    
  ];
  // =========================
  // TOKEN / IDS
  // =========================
  const { usuarioId, empresaId, puntoVentaId } = getAuthData();

  // =========================
  // HOOKS DE NEGOCIO
  // =========================
  const {
    usuarios,
    usuarioSeleccionado,
    auditoria,
    buscar,
    obtenerPorId,
    obtenerAuditoria,
    eliminar,
    setUsuarioSeleccionado,
  } = useUsuarios(empresaId, usuarioId);

  const {
    modalActivo,
    abrirCrear,
    abrirEditar,
    abrirMovimientos,
    abrirAuditoria,
    cerrar,
  } = useUsuarioModales();

  // =========================
  // FILTROS
  // =========================
  const { filtrosInicializados } = useUsuariosFiltros();
  const { valoresFiltros, buscar: buscarFiltro } = useFiltrosContext();

  // =========================
  // PAGINACIÓN
  // =========================
  const {
    paginaActual,
    entidadesTotales,
    skip,
    take,
    setEntidadesTotales,
    handlePageChange,
    resetearPaginacion,
  } = usePaginacion(PAGINACION.TAKE_DEFAULT);

  // =========================
  // ALERTAS / CONFIRMACIONES
  // =========================
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  // =========================
  // IMPRESIÓN
  // =========================
  const {
    handleImprimirTodo,
    handleImprimirPagina,
  } = useUsuarioImpresion();

  // =========================
  // BUSCAR PROVEEDORES
  // =========================
  const handleBuscarUsuarios = async (reset?: boolean) => {
    if (reset) resetearPaginacion();

    const total = await buscar({
      denominacion: valoresFiltros.denominacion ?? " ",
      condicionIvaId: valoresFiltros.condicionIvaId,
      empresaId,
      skip,
      take,
    });

    setEntidadesTotales(total);
  };

  const handleImprimir = async () => {
    const payload = {
      columnas: columnasSeleccionadas,
      empresaId, 
      denominacion:""
    };
    //FALTARÍA EL MÉTODO PARA IMPRIMIR CON EL PAYLOAD EN GENERAL
    const pdfBlob = await UsuarioService.imprimirUsuarios(payload);

    const fileURL = URL.createObjectURL(
      new Blob([pdfBlob], { type: "application/pdf" })
    );

    window.open(fileURL, "_blank");
  };
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState<string[]>(
      columns.map(col => col.accessor as string) // todas seleccionadas por defecto
    );
  
    const columnasParaImprimir = columns.filter(col =>
      columnasSeleccionadas.includes(col.accessor as string)
    );

  // Disparo por filtros
  useEffect(() => {
    if (buscarFiltro.cont > 0 && buscarFiltro.componente === "consultar-usuario") {
      handleBuscarUsuarios(true);
    }
  }, [buscarFiltro]);

  // Disparo por paginación
  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarUsuarios();
    }
  }, [paginaActual, filtrosInicializados]);

  // =========================
  // HANDLERS UI
  // =========================
  const handleEditar = async (id: number) => {
    await obtenerPorId(id);
    abrirEditar();
  };

  const handleMovimientos = async (id: number) => {
    await obtenerPorId(id);
    abrirMovimientos();
  };

  const handleAuditoria = async (id: number) => {
    await obtenerAuditoria(id);
    abrirAuditoria();
  };

  const handleEliminar = async (id: number) => {
    const confirmed = await showConfirmation({
      type: "destructive",
      title: "Eliminar usuario",
      message: "¿Estás seguro de eliminar este usuario?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
    });

    if (!confirmed) return;

    try {
      const mensaje = await eliminar(id);
      addAlert({
        type: "success",
        title: "Éxito",
        message: mensaje,
        autoClose: true,
      });
    } catch {
      addAlert({
        type: "error",
        title: "Error",
        message: "No se pudo eliminar el usuario.",
        autoClose: true,
      });
    }
  };

  const handleSuccess = async (mensaje: string) => {
    cerrar();
    addAlert({ type: "success", title: "Éxito", message: mensaje, autoClose: true });
    await handleBuscarUsuarios();
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="w-full p-2">
      <Card>
        <CardHeader className="flex justify-between">
          {/* Desktop */}
          <div className="hidden lg:block">
            <HeaderUsuarios
              entidadesTotales={entidadesTotales}
              usuariosLength={usuarios.length}
              handleImprimirTodo={handleImprimirTodo}
              handleImprimirPagina={handleImprimirPagina}
              paginaActual={paginaActual}
              openModal={abrirCrear}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-4">
            <HeaderUsuarioLg
              entidadesTotales={entidadesTotales}
              usuariosLength={usuarios.length}
              handleImprimirTodo={handleImprimirTodo}
              handleImprimirPagina={handleImprimirPagina}
              paginaActual={paginaActual}
              openModal={abrirCrear}
            />
          </div>

          
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-start gap-x-6">
            <div className="flex-1 min-w-0">
              <FiltrosAplicados />
            </div>
            <ColumnasImprimir
              columns={columns}
              columnasSeleccionadas={columnasSeleccionadas}
              onCambiarSeleccion={setColumnasSeleccionadas}
              onImprimir={handleImprimir}
            />
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <UsuariosTabla
              usuarios={usuarios}
              onEditar={handleEditar}
              onAuditoria={handleAuditoria}
              onEliminar={handleEliminar}
              columns={columnasParaImprimir}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <UsuariosCards
              usuarios={usuarios}
              onEditar={handleEditar}
              onAuditoria={handleAuditoria}
              onEliminar={handleEliminar}
            />
          </div>
        </CardContent>
      </Card>

      <Paginacion
        entidadesTotales={entidadesTotales}
        take={take}
        paginaActual={paginaActual}
        onChange={handlePageChange}
      />

      <Alertas alerts={alerts} onRemove={removeAlert} />
      <AlertasConfirmacion />

      <CabeceraDocumentoProvider>
        <TotalesDocumentoProvider>
          <UsuarioModales
            modalActivo={modalActivo}
            usuarioSeleccionado={usuarioSeleccionado}
            auditoria={auditoria}
            onClose={() => {
              cerrar();
              setUsuarioSeleccionado(null);
            }}
            onSuccess={handleSuccess}
            onActualizarSuccess={handleSuccess}
          />
        </TotalesDocumentoProvider>
      </CabeceraDocumentoProvider>
    </div>
  );
}
