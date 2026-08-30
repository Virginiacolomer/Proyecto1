import { Cliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import { Proveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import RegistrarActualizarProveedorForm from "../utils/registrar-actualizar-proveedor";

export type ModalProveedor = "crear" | "editar" | "movimientos" | "auditoria" | null;

interface ProveedorModalesProps {
  modalActivo: ModalProveedor;
  proveedorSeleccionado: Proveedor | null;
  auditoria: Auditoria | null;
  onClose: () => void;
  onSuccess: (mensaje: string, proveedor?: Proveedor) => void;
  onActualizarSuccess: (mensaje: string) => void;
}

export const ProveedorModales = ({
  modalActivo,
  proveedorSeleccionado,
  auditoria,
  onClose,
  onSuccess,
  onActualizarSuccess,
}: ProveedorModalesProps) => {
  if (!modalActivo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* CREAR PROVEEDOR */}
      {modalActivo === "crear" && (
        <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
          <RegistrarActualizarProveedorForm onClose={onClose} onSuccess={onSuccess} />
        </div>
      )}

      {/* EDITAR CLIENTE */}
      {modalActivo === "editar" && proveedorSeleccionado && (
        <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
          <RegistrarActualizarProveedorForm
            proveedor={proveedorSeleccionado}
            onClose={onClose}
            onSuccess={onActualizarSuccess}
          />
        </div>
      )}

      {/* MOVIMIENTOS DE CUENTA */}
      {modalActivo === "movimientos" && proveedorSeleccionado && (
        <ConsultarMovimientosCuenta
          entidad={proveedorSeleccionado}
          tipoEntidad="proveedor"
          onClose={onClose}
        />
      )}


      {/* INFORMACIÓN DE AUDITORÍA */}
      {modalActivo === "auditoria" && auditoria && (
        <div className="w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] text-black">
          <InformacionAuditoria auditoria={auditoria} onClose={onClose} />
        </div>
      )}
    </div>
  );
};
