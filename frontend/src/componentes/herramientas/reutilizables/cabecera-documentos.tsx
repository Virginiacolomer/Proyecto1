import { useEffect } from "react";
import FormInput from "../formateo-de-campos/form-input";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PuntosVenta } from "../../../interfaces/generales/interfaces-generales";
import SeleccionProveedorClienteCabecera from "./seleccion-proveedor-cliente-cabecera";
import Select from "react-select";
import { getFechaLocalActual } from "../funciones-reutilizables/funcion-fechas-mes-antes";
import { useCabeceraDocumento } from "../../../context/cabecera-documentos-context";

export interface DatosEntidad {
  entidadId: number;
  domicilio: string;
  condicionIva: string;
  letra: string;
  cuit: string;
  dni: string;
}


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

export default function CabeceraDocumentos({}: {}) {

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
      <div className=" flex flex-col gap-2 ml-4 mr-4">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-row flex-wrap items-end gap-4 py-2">
            <div className="flex flex-col">
              <label className="mb-2 block text-sm font-medium text-gray-700">Punto de Venta</label>
              <Select
                value={
                  Object.entries(PuntosVenta)
                    .map(([key, value]) => ({
                      id: value,
                      denominacion: key,
                    }))
                    .find((option) => option.id === watch("puntoVentaId")) || null
                }
                options={Object.entries(PuntosVenta).map(([key, value]) => ({
                  id: value,
                  denominacion: key,
                }))}
                getOptionLabel={(option) => option.denominacion}
                getOptionValue={(option) => String(option.id)}
                onChange={(selectedOption) => {
                  methods.setValue(`puntoVentaId`, selectedOption?.id || 0);
                }}
                className="text-black"
                isDisabled={documentoGenerado}
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({
                    ...base,
                    color: "black",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "black",
                  }),
                  option: (base, { isSelected, isFocused }) => ({
                    ...base,
                    color: isSelected ? "white" : "black",
                    backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                {...methods.register("fechaDocumento")}
                className="p-2 border bg-white text-black border-gray-300 rounded-md w-fit"
                disabled={documentoGenerado}
              />

              {errors.fechaDocumento?.message && (
                <p className="text-sm text-red-600 mt-1">{errors.fechaDocumento.message}</p>
              )}
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
            <label className="block text-sm font-medium text-gray-700 text-center">Número De Documento</label>
            <div className="flex items-center space-x-2">
              <div className="relative w-20">
                <FormInput name="prefijo" label="" placeholder="Prefijo " disabled={documentoGenerado} />
              </div>
              <span className="text-gray-600">-</span>
              <div className="relative flex-1">
                <FormInput name="numero" label="" placeholder="Número " disabled={documentoGenerado} />
              </div>
            </div>
          </div>
        </div>

        <fieldset>
          {requiereEntidad ? (
            <div className="w-full">
              <SeleccionProveedorClienteCabecera />
            </div>
          ) : null}

          <hr className="my-2 border-gray-300" />
        </fieldset>
      </div>
    </FormProvider>
  );
}
