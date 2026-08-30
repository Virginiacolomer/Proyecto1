import { Button } from "../../../ui/Button";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Localidad } from "../../../../interfaces/gestion-organizacion/localidad/interfaces-localidad";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import { LocalidadModalTipo } from "../hooks/use-localidad-modal";
import RegistrarActualizarLocalidadForm from "../utils/registrar-actualizar-localidad";

interface Props {
  open: boolean;
  tipo: LocalidadModalTipo;
  localidad?: Localidad | null;
  auditoria?: Auditoria | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export function LocalidadModal({ open, tipo, localidad, auditoria, onClose, onSuccess }: Props) {
  if (!open || !tipo) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {tipo === "alta" && (
          <RegistrarActualizarLocalidadForm onClose={onClose} onSuccess={onSuccess} />
        )}

        {tipo === "edicion" && localidad && (
          <RegistrarActualizarLocalidadForm
            entidad={localidad}
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
