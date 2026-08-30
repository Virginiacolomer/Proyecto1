import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getFechaLocalActual } from "../../funciones-reutilizables/funcion-fechas-mes-antes";
import { useCabeceraDocumento } from "../../../../context/cabecera-documentos-context";
import { PuntosVenta } from "../../../../interfaces/generales/interfaces-generales";
import FormInput from "../../formateo-de-campos/form-input";
import SelectorLetraGasto from "./selector-letra-gasto";


interface FormValues {
  fechaDocumento: string;
  prefijo: string;
  numero: string;
  puntoVentaId: number;
}

const schema = yup.object().shape({
  fechaDocumento: yup.string().required("Campo requerido"),
  prefijo: yup
    .string()
    .typeError("El prefijo es obligatorio.")
    .required("Campo requerido")
    .trim()
    .min(1, "El prefijo es obligatorio."),
  numero: yup
    .string()
    .typeError("El numero es obligatorio.")
    .required("Campo requerido")
    .trim()
    .min(1, "El prefijo es obligatorio."),
  puntoVentaId: yup.number().typeError("El punto de venta es obligatorio.").required("Campo requerido"),
});

export default function EncabezadoDocumentosCompras({ disabled = false }: { disabled?: boolean }) {

  const hoy = getFechaLocalActual();

  const { 
    updateCabecera, 
    cabeceraExistente,
    documentoGenerado,
    requiereEntidad,
    entidades,
    cabecera,
  } = useCabeceraDocumento();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fechaDocumento: hoy,
      puntoVentaId: PuntosVenta.RESPALDO,
    },
    mode: "onChange",
  });

  const {
    formState: { errors },
    watch,
  } = methods;

  const fechaDocumento = watch("fechaDocumento");
  const prefijo = watch("prefijo");
  const numero = watch("numero");
  const puntoVentaId = watch("puntoVentaId");

  useEffect(() => {
    updateCabecera({
      fechaDocumento: fechaDocumento,
      numeroDocumento: {
        prefijo: prefijo,
        numero: numero,
      },
      puntoVentaId: puntoVentaId,
    });
      
  }, [fechaDocumento, prefijo, numero, puntoVentaId, entidades]);


  useEffect(() => {
    if (cabeceraExistente) {
      methods.reset({
        fechaDocumento: cabeceraExistente.fechaDocumento
          ? new Date(cabeceraExistente.fechaDocumento).toISOString().split("T")[0]
          : hoy,
        prefijo: cabeceraExistente.numeroDocumento?.prefijo || "",
        numero: cabeceraExistente.numeroDocumento?.numero || "",
        puntoVentaId: cabeceraExistente.puntoVentaId ?? PuntosVenta.RESPALDO,
      });
      // Restaurar la letra del documento al cargar una factura existente
      updateCabecera({ letraDocumento: cabeceraExistente.letra || "A" });
    }
  }, [cabeceraExistente]);

  // Cuando el proveedor cambia, sugerir su letra como letra del documento
  useEffect(() => {
    if (cabecera.letra && !cabeceraExistente) {
      updateCabecera({ letraDocumento: cabecera.letra });
    }
  }, [cabecera.letra]);

  return (
    <FormProvider {...methods}>
      <div className=" flex flex-col gap-2 ml-4 mr-4">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-row flex-wrap items-end gap-4 py-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                {...methods.register("fechaDocumento")}
                className="p-2 border bg-white text-black border-gray-300 rounded-md w-fit"
                disabled={documentoGenerado || disabled}
              />

              {errors.fechaDocumento?.message && (
                <p className="text-sm text-red-600 mt-1">{errors.fechaDocumento.message}</p>
              )}
            </div>

            {/* Letra del documento */}
            <SelectorLetraGasto disabled={documentoGenerado || disabled} />
          </div>

          <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
            <label className="block text-sm font-medium text-gray-700 text-center">Número De Documento</label>
            <div className="flex items-center space-x-2">
              <div className="relative w-20">
                <FormInput
                  name="prefijo"
                  label=""
                  placeholder="Prefijo"
                  disabled={documentoGenerado || disabled}
                  onKeyDown={(e) => {
                    if (!/[\d\b]/.test(e.key) && !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                      e.preventDefault();
                    }
                    if (/\d/.test(e.key) && e.currentTarget.value.length >= 4) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val) methods.setValue("prefijo", val.padStart(4, "0"));
                  }}
                />
              </div>
              <span className="text-gray-600">-</span>
              <div className="relative flex-1">
                <FormInput
                  name="numero"
                  label=""
                  placeholder="Número"
                  disabled={documentoGenerado || disabled}
                  onKeyDown={(e) => {
                    if (!/[\d\b]/.test(e.key) && !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                      e.preventDefault();
                    }
                    if (/\d/.test(e.key) && e.currentTarget.value.length >= 10) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val) methods.setValue("numero", val.padStart(10, "0"));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
