import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import EmailInput from "../../../herramientas/formateo-de-campos/email-input";
import { User } from "lucide-react";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { Personal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";
import { usePersonalForm } from "../hooks/use-personal-form";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";

const NOMBRE_ENTIDAD = "Personal";

export default function RegistrarActualizarPersonalForm({
  personal,
  onClose,
  onSuccess,
}: {
  personal?: Personal;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  const { methods, handleSubmit, onSubmit, isSubmitting, errors } =
    usePersonalForm(personal, onClose, onSuccess);

  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const { setValue } = methods;

  useEffect(() => {
    if (personal) {
      setValue("denominacion", personal.denominacion || "");
      setValue("observacion", personal.observacion || null);
      setValue("mail", personal.mail || "");
      setValue("esVendedor", personal.esVendedor ?? false);
    }
  }, []);

  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que quieres cerrar el formulario? NO se guardaran los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (confirmed) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-2xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        <EncabezadoFormularios
          title={personal ? `Actualizar ${NOMBRE_ENTIDAD}` : `Registrar ${NOMBRE_ENTIDAD}`}
          subtitle={
            personal
              ? "Modifica los detalles del Personal."
              : "Ingresa los datos del nuevo Personal."
          }
          icon={<User className="form-icon" />}
          onClose={handleOnClose}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 px-3 py-2">
              <FormInput
                name="denominacion"
                label="Denominación"
                placeholder="Ingresa la denominación"
              />
              <EmailInput
                name="mail"
                label="Mail"
                placeholder="Ingresa el mail"
              />
              <FormInput
                name="observacion"
                label="Observación"
                placeholder="Ingresa una observación (opcional)"
              />
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="esVendedor"
                  {...methods.register("esVendedor")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="esVendedor" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Es vendedor
                </label>
              </div>
            </CardContent>

            {errors.root?.message && (
              <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>
            )}

            <CardFooter className="flex justify-center">
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? personal ? "Actualizando..." : "Registrando..."
                  : personal ? "Actualizar" : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
      <AlertasConfirmacion />
    </div>
  );
}
