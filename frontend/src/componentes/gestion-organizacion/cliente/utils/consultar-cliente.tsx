import { useEffect, useState } from "react";

import Paginacion from "../../../herramientas/reutilizables/paginacion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { useConfirmation } from "../../../herramientas/alertas/alertas-confirmacion";
import { usePaginacion } from "../../../../hooks/use-paginacion";
import { PAGINACION } from "../../../../config/paginacion";
import { HeaderClientes } from "../componentes/header-cliente";
import { HeaderClienteLg } from "../componentes/header-cliente-lg";
import { ClientesTabla } from "../componentes/cliente-tabla";
import { ClientesCards } from "../componentes/clientes-card";
import { ClienteModales } from "../modales/cliente-modales";
import { useClienteImpresion } from "../hooks/use-cliente-impresion";
import { Alertas, useAlerts } from "../../../herramientas/alertas/alertas";
import { useClienteModales } from "../hooks/use-cliente-modales";
import { useClientesFiltros } from "../hooks/use-clientes-filtros";
import { useClientes } from "../hooks/use-cliente";
import { getAuthData, getRoles } from "../../../../utils/auth";
import { Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { ConsultarCliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";
import ClienteService from "../services/cliente-service";
import { FiltrosCliente, FiltrosClienteValues } from "../componentes/filtros-cliente";
import { ColumnasImprimir } from "../../../herramientas/reutilizables/columnas-imprimir";
import { CabeceraDocumentoProvider } from "../../../../context/cabecera-documento-provider";

// =========================
// COMPONENTE
// =========================
export default function ConsultarClientes() {

  const columns: Column<ConsultarCliente>[] = [
    {
      header: "Código",
      accessor: "codigo",
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
      formatFunction: ({ value }) => {
        const str = String(value ?? "");
        if (str.includes("REC")) {
          const nombre = str.replace("REC", "").trim();
          return (
            <span className="flex items-center gap-2">
              <span>{nombre}</span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-300 rounded px-1.5 py-0.5">REC</span>
            </span>
          );
        }
        return <span>{str}</span>;
      },
    },
    {
      header: "Condición IVA",
      accessor: "condicionIva",
      flex: 1.3,
      type: "text",
      editable: false,
      scrollable: false,
    },
    {
      header: "Saldo",
      accessor: "saldo",
      flex: 0.5,
      type: "text",
      editable: false,
      align: "right",
      formatFunction: ({ value }) => <span>{formatPrice(value, "ARS")}</span>,
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
    clientes,
    clienteSeleccionado,
    auditoria,
    buscar,
    obtenerPorId,
    obtenerAuditoria,
    eliminar,
    setClienteSeleccionado,
  } = useClientes(empresaId, usuarioId);

  const {
    modalActivo,
    abrirCrear,
    abrirEditar,
    abrirMovimientos,
    abrirAuditoria,
    cerrar,
  } = useClienteModales();

  // =========================
  // COLUMNAS PARA IMPRESIÓN
  // =========================

  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState<string[]>(
    columns.map(col => col.accessor as string) // todas seleccionadas por defecto
  );

  const columnasParaImprimir = columns.filter(col =>
    columnasSeleccionadas.includes(col.accessor as string)
  );

  // =========================
  // FILTROS
  // =========================
  const { filtrosInicializados } = useClientesFiltros();

  // Filtros locales del cliente
  const [filtrosCliente, setFiltrosCliente] = useState<FiltrosClienteValues>({ denominacion: "" });

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
  } = useClienteImpresion();

  // =========================
  // BUSCAR CLIENTES
  // =========================
  const handleBuscarClientes = async (reset?: boolean) => {
    if (reset) resetearPaginacion();

    const total = await buscar({
      denominacion: filtrosCliente.denominacion || " ",
      condicionIvaId: filtrosCliente.selectId ?? undefined,
      poseeSaldo: filtrosCliente.poseeSaldo,
      incluirEliminados: filtrosCliente.incluirEliminados,
      empresaId,
      skip,
      take,
    });

    setEntidadesTotales(total);
  };

  const handleBuscarDesdeFiltro = (filtros: FiltrosClienteValues) => {
    setFiltrosCliente(filtros);
  };

  // Disparo por paginación
  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarClientes();
    }
  }, [paginaActual, filtrosInicializados]);

  // Disparo por cambio de filtros locales
  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarClientes(true);
    }
  }, [filtrosCliente]);

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
      title: "Eliminar cliente",
      message: "¿Estás seguro de eliminar este cliente?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => { },
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
        message: "No se pudo eliminar el cliente.",
        autoClose: true,
      });
    }
  };

  const handleSuccess = async (mensaje: string) => {
    cerrar();
    addAlert({ type: "success", title: "Éxito", message: mensaje, autoClose: true });
    await handleBuscarClientes();
  };

  const handleImprimir = async () => {

    const columnasParaEnviar = columns
      .filter(col => columnasSeleccionadas.includes(col.accessor as string))
      .map(col => ({
        accessor: col.accessor,
        header: col.header,
      }));
      
    const payload = {
      columnas: columnasParaEnviar,
      empresaId, 
      denominacion:""
    };
    
    const pdfBlob = await ClienteService.imprimirClientes(payload);

    const fileURL = URL.createObjectURL(
      new Blob([pdfBlob], { type: "application/pdf" })
    );

    window.open(fileURL, "_blank");
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
            <HeaderClientes
              entidadesTotales={entidadesTotales}
              roles={getRoles()}
              clientesLength={clientes.length}
              handleImprimirTodo={handleImprimirTodo}
              handleImprimirPagina={handleImprimirPagina}
              paginaActual={paginaActual}
              openModal={abrirCrear}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-4">
            <HeaderClienteLg
              entidadesTotales={entidadesTotales}
              roles={getRoles()}
              clientesLength={clientes.length}
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
              <FiltrosCliente onBuscar={handleBuscarDesdeFiltro} />
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
            <ClientesTabla
              clientes={clientes}
              onEditar={handleEditar}
              onMovimientos={handleMovimientos}
              onAuditoria={handleAuditoria}
              onEliminar={handleEliminar}
              columns={columnasParaImprimir}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <ClientesCards
              clientes={clientes}
              onEditar={handleEditar}
              onMovimientos={handleMovimientos}
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
          <ClienteModales
            modalActivo={modalActivo}
            clienteSeleccionado={clienteSeleccionado}
            auditoria={auditoria}
            onClose={() => {
              cerrar();
              setClienteSeleccionado(null);
            }}
            onSuccess={handleSuccess}
            onActualizarSuccess={handleSuccess}
          />
      </CabeceraDocumentoProvider>

    </div>
  );
}
