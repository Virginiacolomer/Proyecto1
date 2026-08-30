import * as yup from "yup";
import { CondicionIva } from "../../../interfaces/generales/interfaces-generales";

//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValues {
  denominacion: string;
  observacion?: string | null;
  letra?: string | null;
}

//===================== schema de validacion ============================================//

export const schema = yup.object().shape({
  denominacion: yup
    .string()
    .trim()
    .lowercase()
    .required("La denominación es obligatoria.")
    .max(255, "La denominación no puede superar los 255 caracteres.")
    .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras, números y espacios."),

  observacion: yup.string().optional().nullable(),
  letra: yup.string().optional().nullable(),
});

//===================== transform data ============================================//

export const transformData = (condicionIva: CondicionIva): FormValues => {
  return {
    denominacion: condicionIva.denominacion,
    observacion: condicionIva.observacion || null,
    letra: condicionIva.letra || null,
  };
};
