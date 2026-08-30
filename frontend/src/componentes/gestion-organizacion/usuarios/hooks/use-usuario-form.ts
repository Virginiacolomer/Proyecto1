import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseApiError } from "../../../../utils/errores";
import { ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { getUsuarioId } from "../../../../utils/auth";
import { Usuario } from "../../../../interfaces/gestion-usuario/interfaces-usuario";
import { FormValues, schema, transformData } from "../interfaces/interfaces-validaciones-usuario";
import UsuarioService from "../services/usuario-service";

export function useUsuarioForm(
  usuario: Usuario | undefined,
  onClose: () => void,
  onSuccess: (mensajeAlerta: string) => void
) {
  const usuarioId = getUsuarioId();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: usuario ? transformData(usuario) : { rolesIds: [] },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;

    try {
      if (usuario) {
        const payload = {
          denominacion: formData.denominacion,
          mail: formData.mail,
          rolesIds: formData.rolesIds,
          usuarioUpdatedId: usuarioId,
        };
        response = await UsuarioService.actualizar(usuario.id, payload);
      } else {
        const payload = {
          ...formData,
          usuarioCreatedId: usuarioId,
        };
        response = await UsuarioService.nuevo(payload);
      }

      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setError("root", { type: "manual", message: errorMessage });
    }
  };

  return { methods, handleSubmit, onSubmit, isSubmitting, errors };
}
