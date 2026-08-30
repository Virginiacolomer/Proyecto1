import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { getFechaLocalActual } from "../../funciones-reutilizables/funcion-fechas-mes-antes";
import { useCabeceraDocumento } from "../../../../context/cabecera-documentos-context";
import { PuntosVenta } from "../../../../interfaces/generales/interfaces-generales";
import FormInput from "../../formateo-de-campos/form-input";
import GastoService from "../../../../componentes/gestion-cobros-pagos/gestion-pagos/gastos/services/gasto-service";
import SelectorLetraGasto from "./selector-letra-gasto";

interface FormValues {
  fechaDocumento: string;
  prefijo: string;
  numero: string;
  puntoVentaId: number;
  tipoComprobanteId: number | null;
  letra: string;
}

const schema = yup.object().shape({
  fechaDocumento: yup.string().required("Campo requerido"),
  prefijo: yup.string().typeError("El prefijo es obligatorio.").required("Campo requerido").trim().min(1, "El prefijo es obligatorio."),
  numero: yup.string().typeError("El numero es obligatorio.").required("Campo requerido").trim().min(1, "El número es obligatorio."),
  puntoVentaId: yup.number().typeError("El punto de venta es obligatorio.").required("Campo requerido"),
  tipoComprobanteId: yup.number().nullable().optional(),
});

interface TipoComprobante {
  codigo: number;
  denominacion: string;
  requiereNumero: boolean;
}

export default function EncabezadoDocumentosGasto({ disabled = false }: { disabled?: boolean }) {
  const hoy = getFechaLocalActual();
  const [tiposComprobante, setTiposComprobante] = useState<TipoComprobante[]>([]);

  const {
    updateCabecera,
    cabeceraExistente,
    documentoGenerado,
    entidades,
    cabecera,
  } = useCabeceraDocumento();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fechaDocumento: hoy,
      puntoVentaId: PuntosVenta.RESPALDO,
      tipoComprobanteId: null,
    },
    mode: "onChange",
  });

  const { formState: { errors }, watch } = methods;

  const fechaDocumento = watch("fechaDocumento");
  const prefijo = watch("prefijo");
  const numero = watch("numero");
  const puntoVentaId = watch("puntoVentaId");
  const tipoComprobanteId = watch("tipoComprobanteId");

  useEffect(() => {
    GastoService.obtenerTiposComprobante()
      .then(setTiposComprobante)
      .catch(() => {});
  }, []);

  useEffect(() => {
    updateCabecera({
      fechaDocumento,
      numeroDocumento: { prefijo, numero },
      puntoVentaId,
      tipoDocumentoId: tipoComprobanteId ?? undefined,
    });
  }, [fechaDocumento, prefijo, numero, puntoVentaId, tipoComprobanteId, entidades]);

  useEffect(() => {
    if (cabeceraExistente) {
      methods.reset({
        fechaDocumento: cabeceraExistente.fechaDocumento
          ? new Date(cabeceraExistente.fechaDocumento).toISOString().split("T")[0]
          : hoy,
        prefijo: cabeceraExistente.numeroDocumento?.prefijo || "",
        numero: cabeceraExistente.numeroDocumento?.numero || "",
        puntoVentaId: cabeceraExistente.puntoVentaId ?? PuntosVenta.RESPALDO,
        tipoComprobanteId: cabeceraExistente.tipoDocumentoId ?? null,
      });
      // Restaurar la letra del documento (independiente de la letra del proveedor)
      updateCabecera({ letraDocumento: cabeceraExistente.letra || "A" });
    }
  }, [cabeceraExistente]);

  // Cuando cambia el tipo de comprobante, sugerir la letra correspondiente
  useEffect(() => {
    if (tiposComprobante.length === 0) return;
    const tipo = tiposComprobante.find((t) => t.codigo === tipoComprobanteId);
    if (!tipo) return;

    if (!tipo.requiereNumero) {
      // Sin documento → forzar X
      updateCabecera({ letraDocumento: "X" });
    } else {
      // Con documento → sugerir la letra del proveedor si existe
      const letraProveedor = cabecera.letra;
      if (letraProveedor) {
        updateCabecera({ letraDocumento: letraProveedor });
      }
    }
  }, [tipoComprobanteId, tiposComprobante]);

  const tipoComprobanteSeleccionado = tiposComprobante.find((t) => t.codigo === tipoComprobanteId);
  const requiereNumero = tipoComprobanteSeleccionado?.requiereNumero ?? true;
  const letraForzada = tipoComprobanteSeleccionado && !tipoComprobanteSeleccionado.requiereNumero ? "X" : undefined;

  const selectStyles = {
    control: (base: any) => ({ ...base, borderColor: "#d1d5db", borderRadius: "0.375rem", minHeight: "38px" }),
    singleValue: (base: any) => ({ ...base, color: "black" }),
    option: (base: any, { isSelected, isFocused }: any) => ({
      ...base,
      color: isSelected ? "white" : "black",
      backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-2 ml-4 mr-4">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-row flex-wrap items-end gap-4 py-2">
            {/* Fecha */}
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

            {/* Tipo de comprobante */}
            <div className="flex flex-col min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-1">Tipo de comprobante</label>
              <Select
                value={tiposComprobante.find((t) => t.codigo === tipoComprobanteId) || null}
                options={tiposComprobante}
                getOptionLabel={(o) => o.denominacion}
                getOptionValue={(o) => String(o.codigo)}
                onChange={(selected) =>
                  methods.setValue("tipoComprobanteId", selected ? selected.codigo : null)
                }
                isDisabled={documentoGenerado || disabled}
                placeholder="Seleccioná..."
                menuPortalTarget={document.body}
                styles={selectStyles}
                className="text-sm"
              />
            </div>

            {/* Letra — componente separado */}
            <SelectorLetraGasto disabled={documentoGenerado || disabled} letraForzada={letraForzada} />
          </div>

          {/* Número de documento — solo si el tipo lo requiere */}
          {requiereNumero && (
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
          )}
        </div>
      </div>
    </FormProvider>
  );
}
