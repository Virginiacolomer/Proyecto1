import { Button } from "../../../ui/Button";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Personal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import { PersonalModalTipo } from "../hooks/use-personal-modal";
import RegistrarActualizarPersonalForm from "../utils/registrar-actualizar-personal";

interface Props {
  open: boolean;
  tipo: PersonalModalTipo;
  personal?: Personal | null;
  auditoria?: Auditoria | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export function PersonalModal({ open, tipo, personal, auditoria, onClose, onSuccess }: Props) {
  if (!open || !tipo) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {tipo === "alta" && (
          <RegistrarActualizarPersonalForm onClose={onClose} onSuccess={onSuccess} />
        )}

        {tipo === "edicion" && personal && (
          <RegistrarActualizarPersonalForm
            personal={personal}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}

        {tipo === "auditoria" && auditoria && (
          <>
            <InformacionAuditoria auditoria={auditoria} onClose={onClose} />
            <div className="mt-6 pt-4 border-t">
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
