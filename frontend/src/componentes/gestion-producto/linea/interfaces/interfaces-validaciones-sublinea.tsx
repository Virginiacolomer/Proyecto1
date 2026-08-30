import * as yup from "yup";
import { SelectSublinea, SubLinea } from "../../../../interfaces/gestion-producto/sublinea/interfaces-sublinea";

//===================== interfaces ============================================//

export interface FormValues {
  denominacion: string;
  observacion?: string | null;
}

export interface SublineasEnPayload {
  denominacion: string;
  observacion?: string | null;
  usuarioCreatedId: number;
}

export interface SublineaTabla {
  denominacion: string;
  observacion: string;
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
  observacion: yup.string().optional().nullable(),
});

//===================== transform data ============================================//

export const transformData = (sublinea: SubLinea): FormValues => {
  return {
    denominacion: sublinea.denominacion,
    observacion: sublinea.observacion ?? null,
  };
};

export const normalizeDenominacion = (str: string) =>
  str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const existeSublinea = (
  denominacion: string,
  sublineasNuevas: SublineaTabla[],
  sublineasExistentes: SelectSublinea[],
) => {
  const normalizada = normalizeDenominacion(denominacion);
  return (
    sublineasNuevas.some((s) => normalizeDenominacion(s.denominacion) === normalizada) ||
    sublineasExistentes.some((s) => normalizeDenominacion(s.denominacion) === normalizada)
  );
};
