import * as yup from "yup";
import { Marca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";


//===================== schema de validacion ============================================//

export const schema = yup.object().shape({
  denominacion: yup
    .string()
    .trim()
    .lowercase()
    .required("La denominación es obligatoria.")
    .max(255, "La denominación no puede superar los 255 caracteres.")
    .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras, números y espacios."),

  observacion: yup.string().nullable().optional(),
});

export type FormValues = yup.InferType<typeof schema>;

//===================== transform data ============================================//

export const transformData = (marca: Marca): FormValues => {
  return {
    denominacion: marca.denominacion,
    observacion: marca.observacion ?? null,
  };
};
