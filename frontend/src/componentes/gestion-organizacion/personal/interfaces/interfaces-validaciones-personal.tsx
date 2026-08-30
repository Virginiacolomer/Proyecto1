import * as yup from "yup";
import { Personal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";

export interface FormValuesPersonal {
  denominacion: string;
  observacion?: string | null;
  mail: string;
  esVendedor: boolean;
}

export const schema = yup.object().shape({
  denominacion: yup
    .string()
    .trim()
    .lowercase()
    .required("La denominación es obligatoria.")
    .max(255, "La denominación no puede superar los 255 caracteres.")
    .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras, números y espacios."),
  observacion: yup.string().optional().nullable(),
  mail: yup.string().email("El mail no es válido.").required("El mail es obligatorio."),
  esVendedor: yup.boolean().required(),
});

export const transformData = (personal: Personal): FormValuesPersonal => {
  return {
    denominacion: personal.denominacion,
    observacion: personal.observacion ?? null,
    mail: personal.mail ?? "",
    esVendedor: personal.esVendedor ?? false,
  };
};
