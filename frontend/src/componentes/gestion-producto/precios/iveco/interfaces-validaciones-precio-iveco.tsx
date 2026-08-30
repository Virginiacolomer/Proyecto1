import * as yup from "yup";

export interface FormValues {
  cotizacionDolar: number;
}

//===================== schema de validacion ============================================//

export const crearSchemaValidacion = (maximoDolar: number) =>
  yup.object().shape({
    cotizacionDolar: yup
      .number()
      .typeError("La cotización es obligatoria.")
      .required("La cotización es obligatoria.")
      .moreThan(999, "La cotización debe ser mayor que 1000.")
      .max(maximoDolar, `La cotización no puede ser mayor a ${maximoDolar}.`)
      .notOneOf([Infinity, -Infinity], "Valor inválido."),
  });
