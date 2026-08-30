import { Button } from "../../../ui/Button";
import InformacionAuditoria from "../../../herramientas/reutilizables/informacion-auditoria";
import { Marca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";
import { MarcaModalTipo } from "../hooks/use-marca-modal";
import RegistrarActualizarMarcaForm from "../utils/registrar-actualizar-marca";


interface Props {
  open: boolean;
  tipo: MarcaModalTipo;
  marca?: Marca | null;
  auditoria?: Auditoria | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export function MarcaModal({
  open,
  tipo,
  marca,
  auditoria,
  onClose,
  onSuccess,
}: Props) {
  if (!open || !tipo) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {tipo === "alta" && (
          <RegistrarActualizarMarcaForm
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}

        {tipo === "edicion" && marca && (
          <RegistrarActualizarMarcaForm
            marca={marca}
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
} //abre las pantallas dependiendo las acciones seteaadas en el hook use marca modal. 