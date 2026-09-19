import { Button } from "../../../ui/Button";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Presentacion } from "../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import { PresentacionModalTipo } from "../hooks/use-presentacion-modal";
import RegistrarActualizarPresentacionForm from "../utils/registrar-actualizar-presentacion";


interface Props {
  open: boolean;
  tipo: PresentacionModalTipo;
  presentacion?: Presentacion | null;
  auditoria?: Auditoria | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export function PresentacionModal({
  open,
  tipo,
  presentacion,
  auditoria,
  onClose,
  onSuccess,
}: Props) {
  if (!open || !tipo) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {tipo === "alta" && (
          <RegistrarActualizarPresentacionForm
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}

        {tipo === "edicion" && presentacion && (
          <RegistrarActualizarPresentacionForm
            presentacion={presentacion}
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
} //abre las pantallas dependiendo las acciones seteaadas en el hook use presentacion modal. 