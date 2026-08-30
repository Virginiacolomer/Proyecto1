import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import MarcaService from "../services/marca-service";
import { Marca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Auditoria, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { TipoAlerta, TituloAlerta, useAlerts } from "../../../herramientas/alertas/alertas";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { getUsuarioId } from "../../../../utils/auth";

export function useMarcas() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);

  const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);

  const { alerts, addAlert, removeAlert } = useAlerts();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const usuarioId = getUsuarioId();

  const eliminarMarca = async (id: number) => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DESTRUCTIVE,
      title: TituloAlertaConfirmacion.DESTRUCTIVE,
      message: "¿Estás seguro de que quieres eliminar este elemento?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (!confirmed) return;

    try {
      const response: ResponsePost = await MarcaService.eliminar(id, usuarioId);
      setMarcas((prev) => prev.filter((m) => m.id !== id));

      addAlert({
        type: TipoAlerta.SUCCESS,
        title: TituloAlerta.SUCCESS,
        message: response.mensaje,
        autoClose: true,
      });
    } catch {
      addAlert({
        type: TipoAlerta.ERROR,
        title: TituloAlerta.ERROR,
        message: "No se puede eliminar la marca porque está en uso.",
        autoClose: true,
      });
    }
  };

  const cargarAuditoria = async (id: number) => {
    const data = await MarcaService.obtenerAuditoria(id);
    setAuditoria(data);
  };

  return {
    marcas,
    setMarcas,
    loading,
    setLoading,

    marcaSeleccionada,
    setMarcaSeleccionada,
    auditoria,
    setAuditoria,

    eliminarMarca,
    cargarAuditoria,

    alerts,
    removeAlert,
    AlertasConfirmacion,
  };
}
//muestra los mensajes de exito o eliminacion y despues se setea ese estado para llamar al metodo del service para que elimine. Comunica mi pantalla con el service correspondiente. 