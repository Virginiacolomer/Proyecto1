import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PersonalService from "../services/personal-service";
import { FormValuesPersonal, schema, transformData } from "../interfaces/interfaces-validaciones-personal";
import { Personal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";
import { parseApiError } from "../../../../utils/errores";
import { ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { getUsuarioId } from "../../../../utils/auth";

export function usePersonalForm(
  personal: Personal | undefined,
  onClose: () => void,
  onSuccess: (mensajeAlerta: string) => void
) {
  const usuarioId = getUsuarioId();

  const methods = useForm<FormValuesPersonal>({
    resolver: yupResolver(schema),
    defaultValues: personal ? transformData(personal) : {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (formData: FormValuesPersonal) => {
    let response: ResponsePost;

    try {
      if (personal) {
        const payload = {
          denominacion: formData.denominacion,
          observacion: formData.observacion,
          mail: formData.mail,
          esVendedor: formData.esVendedor,
          usuarioUpdatedId: usuarioId,
        };
        response = await PersonalService.actualizar(personal.id, payload);
      } else {
        const payload = { ...formData, usuarioCreatedId: usuarioId };
        response = await PersonalService.nuevo(payload);
      }

      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setError("root", { type: "manual", message: errorMessage });
    }
  };

  return {
    methods,
    handleSubmit,
    onSubmit,
    isSubmitting,
    errors,
  };
}
