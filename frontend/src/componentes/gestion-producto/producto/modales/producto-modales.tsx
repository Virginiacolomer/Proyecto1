import { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import RegistrarActualizarProductoForm from "../utils/registrar-actualizar-producto";
import HistorialPrecioProducto from "../utils/historial-precio-producto";

interface Props {
  isAltaOpen: boolean;
  mostrarActualizarProducto: boolean;
    mostrarInfoAuditoria: boolean;
    mostrarMovimientosStock: boolean;
    mostrarHistorialPrecios: boolean;
    mostrarProductosAlternativos: boolean;
    mostrarDeQuienEsAlternativo: boolean;
    productoSeleccionado: Producto | null;
    productoInfo: any;
    auditoria: any;
  onCloseAlta: () => void;
    onCloseActualizar: () => void;
    onCloseAuditoria: () => void;
    onCloseMovimientosStock: () => void;
    onCloseHistorialPrecios: () => void;
    onCloseProductosAlternativos: () => void;
    onCloseDeQuienEsAlternativo: () => void;
  onSuccessAlta: (mensaje: string, producto?: Producto) => void;
    onSuccessActualizar: (mensaje: string) => void;
    onRefetch: () => void;
}

export function ProductosModales({
  isAltaOpen,
  mostrarActualizarProducto,
  mostrarInfoAuditoria,
  mostrarMovimientosStock,
  mostrarHistorialPrecios,
  mostrarProductosAlternativos,
  mostrarDeQuienEsAlternativo,
  productoSeleccionado,
  productoInfo,
  auditoria,
  onCloseAlta,
  onCloseActualizar,
  onCloseAuditoria,
  onCloseMovimientosStock,
  onCloseHistorialPrecios,
  onCloseProductosAlternativos,
  onCloseDeQuienEsAlternativo,
  onSuccessAlta,
  onSuccessActualizar,
  onRefetch,
}: Props) {
  return (
    <>
      {isAltaOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RegistrarActualizarProductoForm
            onClose={onCloseAlta}
            onSuccess={onSuccessAlta}
          />
        </div>
      )}

      {mostrarActualizarProducto && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <RegistrarActualizarProductoForm
            producto={productoSeleccionado}
            onClose={onCloseActualizar}
            onSuccess={onSuccessActualizar}
          />
        </div>
      )}

      {mostrarInfoAuditoria && auditoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <InformacionAuditoria auditoria={auditoria} onClose={onCloseAuditoria} />
        </div>
      )}


      {mostrarHistorialPrecios && productoInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <HistorialPrecioProducto
            producto={productoInfo}
            onClose={onCloseHistorialPrecios}
          />
        </div>
      )}
    </>
  );
}
