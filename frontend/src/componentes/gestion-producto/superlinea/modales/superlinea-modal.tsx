import { Button } from "../../../ui/Button";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Superlinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import RegistrarActualizarSuperlineaForm from "../utils/registrar-actualizar-superlinea";

export type SuperlineaModalTipo = "alta" | "edicion" | "auditoria" | null;

interface Props {
  open: boolean;
  tipo: SuperlineaModalTipo;
  superlinea?: Superlinea | null;
  auditoria?: Auditoria | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export function SuperlineaModal({ open, tipo, superlinea, auditoria, onClose, onSuccess }: Props) {
  if (!open || !tipo) return null;

  return (
    <>
      {tipo === "alta" && (
        <RegistrarActualizarSuperlineaForm onClose={onClose} onSuccess={onSuccess} />
      )}

      {tipo === "edicion" && superlinea && (
        <RegistrarActualizarSuperlineaForm superlinea={superlinea} onClose={onClose} onSuccess={onSuccess} />
      )}

      {tipo === "auditoria" && auditoria && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <InformacionAuditoria auditoria={auditoria} onClose={onClose} />
            <div className="mt-6 pt-4 border-t">
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
