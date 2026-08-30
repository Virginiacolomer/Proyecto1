import { useState, useEffect } from "react";
import { getEmpresaId, getUsuarioId } from "../../../utils/auth";
import NotificacionUsuarioService from "../services/notificacion-usuario-service";
import {
  MotivoNotificacionUsuarioDto,
  UsuarioDto,
  CreateNotificacionUsuarioPayload,
  NotificacionModalProps,
  EntidadTipo,
} from "../interfaces/notificacion.types";

interface FormState {
  usuarioDestinatarioId: number | null;
  motivoNotificacionUsuarioId: number | null;
  comentario: string;
}

const formInicial: FormState = {
  usuarioDestinatarioId: null,
  motivoNotificacionUsuarioId: null,
  comentario: "",
};

export function useNotificacionModal({ open, producto, entidadTipo, onClose }: NotificacionModalProps) {
  const [motivos, setMotivos] = useState<MotivoNotificacionUsuarioDto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [form, setForm] = useState<FormState>(formInicial);
  const [cargandoOpciones, setCargandoOpciones] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(formInicial);
    setError(null);
    setCargandoOpciones(true);

    Promise.all([
      NotificacionUsuarioService.obtenerMotivos(entidadTipo),
      NotificacionUsuarioService.obtenerUsuarios(getUsuarioId()),
    ])
      .then(([motivosRes, usuariosRes]) => {
        setMotivos(motivosRes.data);
        setUsuarios(usuariosRes.data);
      })
      .catch(() => setError("Error al cargar las opciones."))
      .finally(() => setCargandoOpciones(false));
  }, [open]);

  const handleChange = (field: keyof FormState, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const esValido =
    form.usuarioDestinatarioId !== null &&
    form.motivoNotificacionUsuarioId !== null &&
    form.comentario.trim() !== "" &&
    producto !== null;

  const handleSubmit = async () => {
    if (!esValido || !producto) return;

    const payload: CreateNotificacionUsuarioPayload = {
      entidadId: producto.id,
      entidadTipo: entidadTipo as EntidadTipo,
      destinatarioId: form.usuarioDestinatarioId!,
      motivoId: form.motivoNotificacionUsuarioId!,
      comentario: form.comentario.trim(),
      empresaId: getEmpresaId(),
      puntoVentaId: 1,
      usuarioCreatedId: getUsuarioId(),
      remitenteId: getUsuarioId(),
      fechaDocumento: new Date().toISOString().split('T')[0],
    };

    setEnviando(true);
    setError(null);

    try {
      await NotificacionUsuarioService.enviar(payload);
      onClose();
    } catch {
      setError("Error al enviar la notificación. Intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return {
    motivos,
    usuarios,
    form,
    cargandoOpciones,
    enviando,
    error,
    esValido,
    handleChange,
    handleSubmit,
  };
}
