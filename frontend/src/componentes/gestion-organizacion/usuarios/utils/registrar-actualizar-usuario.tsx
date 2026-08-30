import { useEffect, useState } from "react";
import { FormProvider, useController } from "react-hook-form";
import { Card, CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { User } from "lucide-react";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import EmailInput from "../../../herramientas/formateo-de-campos/email-input";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import { useConfirmation, TipoAlertaConfirmacion, TituloAlertaConfirmacion } from "../../../herramientas/alertas/alertas-confirmacion";
import { Usuario, Rol } from "../../../../interfaces/gestion-usuario/interfaces-usuario";
import { useUsuarioForm } from "../hooks/use-usuario-form";
import UsuarioService from "../services/usuario-service";

// ===================== Selector de roles =====================
function RolesSelector({ rolesDisponibles }: { rolesDisponibles: Rol[] }) {
  const { field, fieldState } = useController({ name: "rolesIds" });
  const seleccionados: number[] = field.value ?? [];

  const toggle = (id: number) => {
    if (seleccionados.includes(id)) {
      field.onChange(seleccionados.filter((r) => r !== id));
    } else {
      field.onChange([...seleccionados, id]);
    }
  };

  return (
    <div className="space-y-1 sm:space-y-2">
      <label className="text-sm font-medium">Roles</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {rolesDisponibles.filter(r => r.denominacion.toLowerCase() !== "root").map((rol) => {
          const activo = seleccionados.includes(rol.id);
          return (
            <button
              key={rol.id}
              type="button"
              onClick={() => toggle(rol.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                activo
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
            >
              {rol.denominacion}
            </button>
          );
        })}
      </div>
      {fieldState.error && (
        <small className="text-red-500">{fieldState.error.message}</small>
      )}
    </div>
  );
}

// ===================== Formulario principal =====================
export default function RegistrarActualizarUsuarioForm({
  usuario,
  onClose,
  onSuccess,
}: {
  usuario?: Usuario;
  onClose: () => void;
  onSuccess: (mensaje: string) => void;
}) {
  const [rolesDisponibles, setRolesDisponibles] = useState<Rol[]>([]);
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();
  const { methods, handleSubmit, onSubmit, isSubmitting, errors } = useUsuarioForm(
    usuario,
    onClose,
    onSuccess
  );

  useEffect(() => {
    UsuarioService.obtenerRolesDisponibles()
      .then(setRolesDisponibles)
      .catch(() => {});
  }, []);

  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que quieres cerrar el formulario? NO se guardarán los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (confirmed) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-lg bg-white mx-auto shadow-lg rounded-2xl overflow-hidden">
        <EncabezadoFormularios
          title={usuario ? "Actualizar Usuario" : "Registrar Usuario"}
          subtitle={usuario ? "Modificá los datos del usuario." : "Ingresá los datos del nuevo usuario."}
          icon={<User className="form-icon" />}
          onClose={handleOnClose}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 px-3 py-2">
              <FormInput
                name="denominacion"
                label="Nombre"
                placeholder="Ingresá el nombre"
              />
              <EmailInput
                name="mail"
                label="Mail"
                placeholder="Ingresá el mail"
              />
              <RolesSelector rolesDisponibles={rolesDisponibles} />
            </CardContent>

            {errors.root?.message && (
              <div className="text-red-600 text-center mb-4 px-3">
                {String(errors.root.message)}
              </div>
            )}

            <CardFooter className="flex justify-center gap-2">
              <Button type="button" variant="outline" onClick={handleOnClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? usuario ? "Actualizando..." : "Registrando..."
                  : usuario ? "Actualizar" : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
      <AlertasConfirmacion />
    </div>
  );
}
