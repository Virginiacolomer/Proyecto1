import * as yup from "yup";
import { Linea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";

//===================== interfaces ============================================//

export interface FormValues {
  denominacion: string;
  observacion?: string | null;
  stockMinimo?: number;
  utilizaStockMinimo?: boolean;
}

export interface SublineasEnPayload {
  denominacion: string;
  observacion?: string | null;
  usuarioCreatedId: number;
}

//===================== schema de validacion ============================================//

export const schema = (utilizaStockMinimo: boolean) =>
  yup.object().shape({
    denominacion: yup
      .string()
      .trim()
      .lowercase()
      .required("La denominación es obligatoria.")
      .max(255, "Máximo 255 caracteres.")
      .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, "Solo se permiten letras, números y espacios."),
    observacion: yup.string().optional().nullable(),
    stockMinimo: yup.number().when([], {
      is: () => utilizaStockMinimo,
      then: (schema) => schema.required("El Stock minimo es obligatorio.").moreThan(0, "El stock minimo debe ser mayor a 0."),
      otherwise: (schema) => schema.optional(),
    }),
    utilizaStockMinimo: yup.boolean().optional(),
   
  });

//===================== transform data ============================================//

export const transformData = (linea: Linea): FormValues => {
  return {
    denominacion: linea.denominacion,
    observacion: linea.observacion ?? null,
    stockMinimo: linea.stockMinimo ?? 0,
    utilizaStockMinimo: linea.utilizaStockMinimo ?? false,
  };
};

