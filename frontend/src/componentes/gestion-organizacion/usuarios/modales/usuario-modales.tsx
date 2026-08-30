import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import { Usuario } from "../../../../interfaces/gestion-usuario/interfaces-usuario";
import RegistrarActualizarUsuarioForm from "../utils/registrar-actualizar-usuario";


export type ModalUsuario = "crear" | "editar" | "movimientos" | "auditoria" | null;

interface UsuarioModalesProps {
  modalActivo: ModalUsuario;
  usuarioSeleccionado: Usuario | null;
  auditoria: Auditoria | null;
  onClose: () => void;
  onSuccess: (mensaje: string, usuario?: Usuario) => void;
  onActualizarSuccess: (mensaje: string) => void;
}

export const UsuarioModales = ({
  modalActivo,
  usuarioSeleccionado,
  auditoria,
  onClose,
  onSuccess,
  onActualizarSuccess,
}: UsuarioModalesProps) => {
  if (!modalActivo) return null;

  return (
    <>
      {modalActivo === "editar" && usuarioSeleccionado && (
        <RegistrarActualizarUsuarioForm
          usuario={usuarioSeleccionado}
          onClose={onClose}
          onSuccess={onActualizarSuccess}
        />
      )}

      {modalActivo === "auditoria" && auditoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] text-black">
            <InformacionAuditoria auditoria={auditoria} onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
};
