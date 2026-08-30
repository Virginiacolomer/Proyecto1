import { useRef } from "react";
import { Bell, AlertCircle, Loader2, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Textarea } from "../../ui/TextArea";
import EncabezadoFormularios from "../../ui/encabezadoFormularios";
import EntidadSelectorBase, { EntidadBase } from "../../herramientas/reutilizables/entidad-selector-base";
import { UsuarioDto, NotificacionModalProps } from "../interfaces/notificacion.types";
import { useNotificacionModal } from "../hooks/use-notificacion-modal";

export function NotificacionModal({ open, producto, entidadTipo, onClose }: NotificacionModalProps) {
  const {
    motivos,
    usuarios,
    form,
    cargandoOpciones,
    enviando,
    error,
    esValido,
    handleChange,
    handleSubmit,
  } = useNotificacionModal({ open, producto, entidadTipo, onClose });

  const usuarioDenomRef = useRef<HTMLInputElement>(null);
  const usuarioSelectRef = useRef<HTMLDivElement>(null);
  const motivoDenomRef = useRef<HTMLInputElement>(null);
  const motivoSelectRef = useRef<HTMLDivElement>(null);

  const usuarioSeleccionado = usuarios.find((u) => u.id === form.usuarioDestinatarioId) ?? null;
  const motivoSeleccionado = motivos.find((m) => m.id === form.motivoNotificacionUsuarioId) ?? null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-lg bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">

        <EncabezadoFormularios
          title="Nueva Notificación"
          subtitle=" "
          icon={<Bell className="form-icon" />}
          onClose={onClose}
        />

        <CardContent className="space-y-4 px-4 py-3">

          {/* Producto (solo lectura) */}
          {producto && (
            <div className="border border-gray-300 rounded-lg p-3 bg-gray-100 flex items-start gap-2">
              <Package className="h-4 w-4 mt-0.5 text-gray-500 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{producto.denominacion}</p>
                <p className="text-gray-500">Stock: {producto.stock}</p>
              </div>
            </div>
          )}

          <EntidadSelectorBase<UsuarioDto>
            titulo="Destinatario"
            denominacion=""
            setDenominacion={() => {}}
            denominacionRef={usuarioDenomRef}
            opciones={usuarios}
            selected={usuarioSeleccionado}
            selectedId={form.usuarioDestinatarioId ?? 0}
            selectRef={usuarioSelectRef}
            disabled={cargandoOpciones}
            onEnterInput={() => {}}
            onChange={(u) => handleChange("usuarioDestinatarioId", u?.id ?? null)}
            onAgregar={() => {}}
            ocultarAgregar
          />

          <EntidadSelectorBase<EntidadBase>
            titulo="Motivo"
            denominacion=""
            setDenominacion={() => {}}
            denominacionRef={motivoDenomRef}
            opciones={motivos}
            selected={motivoSeleccionado}
            selectedId={form.motivoNotificacionUsuarioId ?? 0}
            selectRef={motivoSelectRef}
            disabled={cargandoOpciones}
            onEnterInput={() => {}}
            onChange={(m) => handleChange("motivoNotificacionUsuarioId", m?.id ?? null)}
            onAgregar={() => {}}
            ocultarAgregar
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Comentario</label>
            <Textarea
              value={form.comentario}
              onChange={(e) => handleChange("comentario", e.target.value)}
              placeholder="Escribir comentario..."
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button onClick={handleSubmit} disabled={!esValido || enviando} className="btn btn-dark">
            {enviando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar notificación
          </Button>
        </CardFooter>

      </Card>
    </div>
  );
}
