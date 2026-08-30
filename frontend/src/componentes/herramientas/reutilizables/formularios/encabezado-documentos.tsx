import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { getFechaLocalActual } from "../../funciones-reutilizables/funcion-fechas-mes-antes";
import { useCabeceraDocumento } from "../../../../context/cabecera-documentos-context";
import { PuntosVenta } from "../../../../interfaces/generales/interfaces-generales";
import FormInput from "../../formateo-de-campos/form-input";


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

export default function EncabezadoDocumentos({}: {}) {

  const hoy = getFechaLocalActual();

  const { 
    updateCabecera, 
    cabeceraExistente,
    documentoGenerado,
    requiereEntidad,
    entidades,
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
    }
  }, [cabeceraExistente]);

  return (
    <FormProvider {...methods}>
  <div className="mx-4 my-2">
    <div className="flex flex-wrap items-end gap-4">

      {/* Punto de venta */}
      <div className="min-w-[220px]">
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Punto de venta
        </label>
        <Select
          value={
            Object.entries(PuntosVenta)
              .map(([key, value]) => ({ id: value, denominacion: key }))
              .find(option => option.id === puntoVentaId) || null
          }
          options={Object.entries(PuntosVenta).map(([key, value]) => ({
            id: value,
            denominacion: key,
          }))}
          getOptionLabel={(o) => o.denominacion}
          getOptionValue={(o) => String(o.id)}
          onChange={(o) => methods.setValue("puntoVentaId", o?.id || 0)}
          isDisabled={documentoGenerado}
          menuPortalTarget={document.body}
          className="text-black"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "36px",
              height: "36px",
              fontSize: "0.875rem",
            }),
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
        />
      </div>

      {/* Fecha */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Fecha
        </label>
        <input
          type="date"
          {...methods.register("fechaDocumento")}
          disabled={documentoGenerado}
          className="h-[36px] rounded-md border border-gray-300 bg-white px-2 text-sm text-black"
        />
      </div>

      {/* Número de documento */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Nº documento
        </label>
        <div className="flex items-center gap-2 h-[36px]">
          <div className="w-20">
            <FormInput
              name="prefijo"
              label=""
              placeholder="Pref."
              disabled={documentoGenerado}
            />
          </div>

          <span className="text-gray-400 text-sm leading-none">–</span>

          <div className="w-[140px]">
            <FormInput
              name="numero"
              label=""
              placeholder="Número"
              disabled={documentoGenerado}
            />
          </div>
        </div>
      

      </div>
    </div>
                {/* Separador visual */}
     <div className="mt-3 border-t border-gray-200"></div>
  </div>
</FormProvider>


  );
}
