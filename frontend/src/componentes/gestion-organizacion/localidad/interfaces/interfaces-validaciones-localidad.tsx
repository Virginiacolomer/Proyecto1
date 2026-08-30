import * as yup from "yup";
import { Localidad } from "../../../../interfaces/gestion-organizacion/localidad/interfaces-localidad";

//===================== interfaces ============================================//

export interface FormValues {
  denominacion: string;
  provinciaId: number;
}

//===================== schema de validacion ============================================//

export const schema = yup.object().shape({
  denominacion: yup
    .string()
    .trim()
    .lowercase()
    .required("La denominación es obligatoria.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras, números y espacios."),
  provinciaId: yup.number().required(),
});

//===================== transform data ============================================//

export const transformData = (localidad: Localidad): FormValues => {
  return {
    denominacion: localidad.denominacion,
    provinciaId: localidad.provincia.id,
  };
};
