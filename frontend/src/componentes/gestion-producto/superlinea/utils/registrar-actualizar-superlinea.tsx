import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter, Card } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import { Superlinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { Layers } from "lucide-react";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import SuperLineaService from "../services/superlinea-service";
import { getUsuarioId } from "../../../../utils/auth";
import { parseApiError } from "../../../../utils/errores";

const NOMBRE_ENTIDAD = "SuperLínea";

interface FormValues {
  denominacion: string;
  observacion?: string | null;
}

const schema = yup.object().shape({
  denominacion: yup
    .string()
    .trim()
    .lowercase()
    .required("La denominación es obligatoria.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras, números y espacios."),
  observacion: yup.string().optional().nullable(),
});

export default function RegistrarActualizarSuperlineaForm({
  superlinea,
  onClose,
  onSuccess,
}: {
  superlinea?: Superlinea | null;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
}) {
  const usuarioId = getUsuarioId();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();
  const isEdit = !!superlinea;

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: superlinea
      ? {
          denominacion: superlinea.denominacion,
          observacion: superlinea.observacion ?? "",
        }
      : {
          denominacion: "",
          observacion: "",
        },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = methods;

  const onSubmit = async (formData: FormValues) => {
    try {
      let response: any;
      if (superlinea) {
        const payload = { ...formData, usuarioUpdatedId: usuarioId };
        response = await SuperLineaService.actualizar(superlinea.id, payload);
      } else {
        const payload = { ...formData, usuarioCreatedId: usuarioId };
        response = await SuperLineaService.nuevo(payload);
      }
      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      setError("root", { type: "manual", message: parseApiError(error) });
    }
  };

  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que quieres cerrar el formulario? NO se guardarán los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (confirmed) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-2xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        <EncabezadoFormularios
          title={isEdit ? `Actualizar ${NOMBRE_ENTIDAD}` : `Registrar ${NOMBRE_ENTIDAD}`}
          subtitle={isEdit ? "Modifica los detalles de la SuperLínea." : "Ingresa los datos de la nueva SuperLínea."}
          icon={<Layers className="form-icon" />}
          onClose={handleOnClose}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 px-6 py-4">
              <FormInput
                name="denominacion"
                label="Denominación"
                placeholder="Ingresa la denominación"
                disabled={superlinea?.sistema === 1}
              />
              <FormInput
                name="observacion"
                label="Observación"
                placeholder="Ingresa una observación (opcional)"
              />
            </CardContent>

            {errors.root?.message && (
              <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>
            )}

            <CardFooter className="flex justify-center">
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? isEdit
                    ? "Actualizando..."
                    : "Registrando..."
                  : isEdit
                  ? "Actualizar"
                  : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>

      <AlertasConfirmacion />
    </div>
  );
}
