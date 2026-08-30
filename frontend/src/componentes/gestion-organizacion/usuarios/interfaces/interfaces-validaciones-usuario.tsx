import * as yup from "yup";
import { Usuario } from "../../../../interfaces/gestion-usuario/interfaces-usuario";

export interface FormValues {
  mail: string;
  denominacion: string;
  rolesIds: number[];
}

export const schema = yup.object().shape({
  denominacion: yup
    .string()
    .trim()
    .required("La denominación es obligatoria.")
    .max(100, "Máximo 100 caracteres."),
  mail: yup
    .string()
    .trim()
    .email("Debe ser un mail válido.")
    .required("El mail es obligatorio.")
    .max(255, "Máximo 255 caracteres."),
  rolesIds: yup
    .array()
    .of(yup.number().required())
    .min(1, "Debe asignar al menos un rol.")
    .required(),
});

export const transformData = (usuario: Usuario): FormValues => {
  return {
    denominacion: usuario.denominacion ?? "",
    mail: usuario.mail ?? "",
    rolesIds: (usuario.roles ?? []).map((r) => r.id),
  };
};
