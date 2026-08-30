import { useEffect, useState } from "react";
import Paginacion from "../../../herramientas/reutilizables/paginacion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Alertas } from "../../../herramientas/alertas/alertas";
import { useConfirmation } from "../../../herramientas/alertas/alertas-confirmacion";
import { usePaginacion } from "../../../../hooks/use-paginacion";
import { PAGINACION } from "../../../../config/paginacion";
import { useAlerts } from "../../../herramientas/alertas/alertas";
import { useProveedores } from "../hooks/use-proveedor";
import { useProveedorModales } from "../hooks/use-proveedor-modales";
import { useProveedoresFiltros } from "../hooks/use-proveedores-filtros";
import { useProveedorImpresion } from "../hooks/use-proveedor-impresion";
import { HeaderProveedores } from "../componentes/header-proveedor";
import { HeaderProveedorLg } from "../componentes/header-proveedor-lg";
import { ProveedoresTabla } from "../componentes/proveedor-tabla";
import { ProveedoresCards } from "../componentes/proveedores-card";
import { ProveedorModales } from "../modales/proveedor-modales";
import { getAuthData } from "../../../../utils/auth";
import { formatPrice } from "../../../herramientas/formateo-de-campos/fucion-formateo";
import { ConsultarProveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import { Column } from "../../../herramientas/tablas/tabla-flexible-ag-grid";
import { ColumnasImprimir } from "../../../herramientas/reutilizables/columnas-imprimir";
import ProveedorService from "../services/proveedor-service";
import { FiltrosProveedor, FiltrosProveedorValues } from "../componentes/filtros-proveedor";
import { CabeceraDocumentoProvider } from "../../../../context/cabecera-documento-provider";


// =========================
// COMPONENTE
// =========================
export default function ConsultarProveedores() {

  const columns: Column<ConsultarProveedor>[] = [
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
        if (str.includes("ORDEN")) {
          const nombre = str.replace("ORDEN", "").trim();
          return (
            <span className="flex items-center gap-2">
              <span>{nombre}</span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-300 rounded px-1.5 py-0.5">ORDEN</span>
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
    proveedores,
    proveedorSeleccionado,
    auditoria,
    buscar,
    obtenerPorId,
    obtenerAuditoria,
    eliminar,
    setProveedorSeleccionado,
  } = useProveedores(empresaId, usuarioId);

  const {
    modalActivo,
    abrirCrear,
    abrirEditar,
    abrirMovimientos,
    abrirAuditoria,
    cerrar,
  } = useProveedorModales();

  // =========================
  // FILTROS
  // =========================
  const { filtrosInicializados } = useProveedoresFiltros();

  // Filtros locales del proveedor
  const [filtrosProveedor, setFiltrosProveedor] = useState<FiltrosProveedorValues>({ denominacion: "" });

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
  } = useProveedorImpresion();

  // =========================
  // BUSCAR PROVEEDORES
  // =========================
  const handleBuscarProveedores = async (reset?: boolean) => {
    if (reset) resetearPaginacion();

    const total = await buscar({
      denominacion: filtrosProveedor.denominacion || " ",
      condicionIvaId: filtrosProveedor.selectId ?? undefined,
      poseeSaldo: filtrosProveedor.poseeSaldo,
      incluirEliminados: filtrosProveedor.incluirEliminados,
      empresaId,
      skip,
      take,
    });

    setEntidadesTotales(total);
  };

  const handleBuscarDesdeFiltro = (filtros: FiltrosProveedorValues) => {
    setFiltrosProveedor(filtros);
  };

  // Disparo por paginación
  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarProveedores();
    }
  }, [paginaActual, filtrosInicializados]);

  // Disparo por cambio de filtros locales
  useEffect(() => {
    if (filtrosInicializados) {
      handleBuscarProveedores(true);
    }
  }, [filtrosProveedor]);

  const handleImprimir = async () => {
    const payload = {
      columnas: columnasSeleccionadas,
      empresaId,
      denominacion: ""
    };
    const pdfBlob = await ProveedorService.imprimirProveedores(payload);
    const fileURL = URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
    window.open(fileURL, "_blank");
  };

  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState<string[]>(
    columns.map(col => col.accessor as string)
  );

  const columnasParaImprimir = columns.filter(col =>
    columnasSeleccionadas.includes(col.accessor as string)
  );

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
      title: "Eliminar proveedor",
      message: "¿Estás seguro de eliminar este proveedor?",
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
        message: "No se pudo eliminar el proveedor.",
        autoClose: true,
      });
    }
  };

  const handleSuccess = async (mensaje: string) => {
    cerrar();
    addAlert({ type: "success", title: "Éxito", message: mensaje, autoClose: true });
    await handleBuscarProveedores();
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
            <HeaderProveedores
              entidadesTotales={entidadesTotales}
              proveedoresLength={proveedores.length}
              handleImprimirTodo={handleImprimirTodo}
              handleImprimirPagina={handleImprimirPagina}
              paginaActual={paginaActual}
              openModal={abrirCrear}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-4">
            <HeaderProveedorLg
              entidadesTotales={entidadesTotales}
              proveedoresLength={proveedores.length}
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
              <FiltrosProveedor onBuscar={handleBuscarDesdeFiltro} />
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
            <ProveedoresTabla
              proveedores={proveedores}
              onEditar={handleEditar}
              onMovimientos={handleMovimientos}
              onAuditoria={handleAuditoria}
              onEliminar={handleEliminar}
              columns={columnasParaImprimir}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <ProveedoresCards
              proveedores={proveedores}
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
          <ProveedorModales
            modalActivo={modalActivo}
            proveedorSeleccionado={proveedorSeleccionado}
            auditoria={auditoria}
            onClose={() => {
              cerrar();
              setProveedorSeleccionado(null);
            }}
            onSuccess={handleSuccess}
            onActualizarSuccess={handleSuccess}
          />
      </CabeceraDocumentoProvider>

    </div>
  );
}
