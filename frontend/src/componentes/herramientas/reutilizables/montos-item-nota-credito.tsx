import { useEffect } from "react";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PriceInput from "../formateo-de-campos/price-input";
import {
  DocumentoCompleto,
  IMontosItemNotaCredito,
  MotivoNotaCredito,
} from "../../../interfaces/generales/interfaces-generales";

interface FormValuesMontosItemNotaCredito {
  monto?: number;
  subTotalNoGravado?: number;
  ivaCalculado?: number;
  otrosTributos?: number;
  subtotal: number;
  importeTotal: number;
}

const schemaMontosItemNotaCredito = yup.object().shape({
  monto: yup.number().optional(),
  subTotalNoGravado: yup.number().optional(),
  ivaCalculado: yup.number().optional(),
  otrosTributos: yup.number().optional(),
  subtotal: yup.number().typeError("el subtotal es obligatorio").required("el subtotal es obligatorio"),
  importeTotal: yup.number().typeError("el total es obligatorio").required("el total es obligatorio"),
});

export default function MontosItemNotaCredito({
  documento,
  onMontosItem,
  motivoNotaCredito,
  mostrarRecuadroGris,
}: {
  documento?: DocumentoCompleto;
  onMontosItem: (montosItem: IMontosItemNotaCredito) => void;
  mostrarRecuadroGris?: boolean;
  motivoNotaCredito?: string;
}) {
  console.log("este es el documento que llega a montos item nota credito", documento);

  const methods = useForm<FormValuesMontosItemNotaCredito>({
    resolver: yupResolver(schemaMontosItemNotaCredito),
    defaultValues: {
      subTotalNoGravado: documento?.subTotalNoGravado || 0,
      monto: 0,
      ivaCalculado: documento?.iva21 || 0, // Cambiar a iva
      subtotal: documento?.subTotal || 0,
      importeTotal: documento?.importeTotal || 0,
    },
  });

  const { watch, setValue } = methods;

  const subTotalNoGravado = watch("subTotalNoGravado") || 0;
  const ivaCalculado = watch("ivaCalculado") || 0;
  const monto = watch("monto") || 0;
  const subtotal = watch("subtotal") || 0;
  const importeTotal = watch("importeTotal") || 0;

  useEffect(() => {
    console.log("se hace el useEffect de montos item nota credito");
    console.log("documento en useEffect de montos item nota credito", documento);
    if (documento) {
      setValue("subTotalNoGravado", documento.subTotalNoGravado || 0);
      setValue("ivaCalculado", documento.iva21 || 0); // Cambiar
      setValue("subtotal", documento.subTotal || 0);
      setValue("importeTotal", documento.importeTotal || 0);
    }
  }, [documento]);

  useEffect(() => {
    console.log("a versipasa por aca", documento);
    onMontosItem({
      subTotalNoGravado: subTotalNoGravado || 0,
      ivaCalculado: ivaCalculado || 0,
      monto: monto || 0,
      subtotal: subtotal || 0,
      importeTotal: importeTotal || 0,
    });
  }, [subTotalNoGravado, ivaCalculado, monto, subtotal, importeTotal]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4">
        {/* Select de Proveedor/Cliente */}
        <div
          className={`${mostrarRecuadroGris ? "border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100" : ""} w-full`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {motivoNotaCredito === MotivoNotaCredito.BONIFICACION && (
              <PriceInput
                name={`monto`}
                label="Monto"
                value={+monto || 0}
                onChange={(value) => setValue(`monto`, Number(value))}
                className="w-[160px] text-right p-2 border border-gray-300 rounded-md text-black bg-white"
              />
            )}

            <PriceInput
              name={`subTotalNoGravado`}
              label="Subtotal No Gravado"
              value={+subTotalNoGravado || 0}
              onChange={(value) => setValue(`subTotalNoGravado`, Number(value))}
              className="w-[160px] text-right p-2 border border-gray-300 rounded-md text-black bg-gray-300"
              disabled={true}
            />

            <PriceInput
              name="subtotal"
              label="Subtotal"
              value={+subtotal || 0}
              onChange={(value) => setValue("subtotal", Number(value))} // Actualiza el valor de 'subTotal' en el formulario
              className="w-[160px] text-right p-2 border border-gray-300 rounded-md text-black bg-gray-300"
              disabled={true}
            />

            <PriceInput
              name={`ivaCalculado`}
              label="Iva Calculado"
              value={+ivaCalculado || 0}
              onChange={(value) => setValue(`ivaCalculado`, Number(value))}
              className="w-[160px] text-right p-2 border border-gray-300 rounded-md text-black bg-gray-300"
              disabled={true}
            />

            <PriceInput
              name="importeTotal"
              label="Total"
              value={+importeTotal || 0}
              onChange={(value) => setValue("importeTotal", Number(value))} // Actualiza el valor de 'subTotal' en el formulario
              className="w-[160px] text-right p-2 border border-gray-300 rounded-md text-black bg-gray-300"
              disabled={true}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
