import { Cliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import RegistrarActualizarClienteForm from "../utils/registrar-actualizar-cliente";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";

export type ModalCliente = "crear" | "editar" | "movimientos" | "auditoria" | null;

interface ClienteModalesProps {
  modalActivo: ModalCliente;
  clienteSeleccionado: Cliente | null;
  auditoria: Auditoria | null;
  onClose: () => void;
  onSuccess: (mensaje: string, cliente?: Cliente) => void;
  onActualizarSuccess: (mensaje: string) => void;
}

export const ClienteModales = ({
  modalActivo,
  clienteSeleccionado,
  auditoria,
  onClose,
  onSuccess,
  onActualizarSuccess,
}: ClienteModalesProps) => {
  if (!modalActivo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* CREAR CLIENTE */}
      {modalActivo === "crear" && (
        <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
          <RegistrarActualizarClienteForm onClose={onClose} onSuccess={onSuccess} />
        </div>
      )}

      {/* EDITAR CLIENTE */}
      {modalActivo === "editar" && clienteSeleccionado && (
        <div className="relative p-6 sm:p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
          <RegistrarActualizarClienteForm
            cliente={clienteSeleccionado}
            onClose={onClose}
            onSuccess={onActualizarSuccess}
          />
        </div>
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
