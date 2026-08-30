import { Button } from "../../../ui/Button";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Linea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import { LineaModalTipo } from "../hooks/use-linea-modal";
import RegistrarActualizarLineaForm from "../utils/registrar-actualizar-linea";

interface Props {
  open: boolean;
  tipo: LineaModalTipo;
  linea?: Linea | null;
  auditoria?: Auditoria | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export function LineaModal({ open, tipo, linea, auditoria, onClose, onSuccess }: Props) {
  if (!open || !tipo) return null;

  return (
    <>
      {tipo === "alta" && (
        <RegistrarActualizarLineaForm onClose={onClose} onSuccess={onSuccess} />
      )}

      {tipo === "edicion" && linea && (
        <RegistrarActualizarLineaForm linea={linea} onClose={onClose} onSuccess={onSuccess} />
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
