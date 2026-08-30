import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import React from "react";
import {
  existeSublinea,
  FormValues,
  schema,
  SublineasEnPayload,
  SublineaTabla,
} from "../interfaces/interfaces-validaciones-sublinea";
import { SelectSublinea } from "../../../../interfaces/gestion-producto/sublinea/interfaces-sublinea";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { getUsuarioId } from "../../../../utils/auth";

export default function RegistrarSublineaForm({
  sublineas,
  onAddSublinea,
  onDeleteSublinea,
}: {
  sublineas?: SelectSublinea[];
  onAddSublinea: (nuevaSublinea: SublineasEnPayload) => void;
  onDeleteSublinea: (rowIndex: number) => void;
}) {
  const usuarioCreatedId = getUsuarioId();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const { handleSubmit, formState: { errors }, watch, getValues } = methods;

  const [sublineasNuevas, setSublineasNuevas] = React.useState<SublineaTabla[]>([]);
  const [sublineasExistentes, setSublineasExistentes] = React.useState<SelectSublinea[]>([]);
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const denominacion = watch("denominacion");

  useEffect(() => {
    setSublineasExistentes(sublineas || []);
  }, [sublineas]);

  const handleDeleteSublinea = async (rowIndex: number, nuevo: boolean) => {
    try {
      if (onDeleteSublinea) {
        if (!nuevo) {
          onDeleteSublinea(rowIndex);
        } else {
          onDeleteSublinea(rowIndex + sublineasExistentes.length);
        }
      }
      if (nuevo) {
        setSublineasNuevas((prev) => prev.filter((_, index) => index !== rowIndex));
      } else {
        setSublineasExistentes((prev) => prev.filter((_, index) => index !== rowIndex));
      }
    } catch (error) {
      console.error("Error al eliminar la sublinea:", error);
    }
  };

  const handleAddSublinea = async () => {
    const isValid = await methods.trigger(["denominacion", "observacion"]);
    if (!isValid) return;

    if (existeSublinea(denominacion, sublineasNuevas, sublineasExistentes)) {
      const confirmed = await showConfirmation({
        type: TipoAlertaConfirmacion.WARNING_ERROR,
        title: TituloAlertaConfirmacion.WARNING_ERROR,
        message: "Ya existe una sublínea con esa denominación.",
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: () => {},
      });
      if (confirmed) return;
    }

    const nuevaSublineaForm: SublineasEnPayload = {
      usuarioCreatedId,
      denominacion: getValues("denominacion"),
      observacion: getValues("observacion"),
    };

    if (onAddSublinea) onAddSublinea(nuevaSublineaForm);

    const nuevaSublineaTabla: SublineaTabla = {
      denominacion: getValues("denominacion"),
      observacion: getValues("observacion") ?? "",
    };
    setSublineasNuevas((prev) => [...prev, nuevaSublineaTabla]);
  };

  return (
    <div className="col-span-full flex flex-col w-full">
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm w-full">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-4">
            <div className="flex gap-x-4">
              <div className="flex-1">
                <FormInput name="denominacion" placeholder="Denominación" label="Denominación" />
              </div>
              <div className="flex-1">
                <FormInput name="observacion" placeholder="Observación" label="Observación" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sublineas</label>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Denominación</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Observación</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {sublineasExistentes?.map((sublinea, index) => (
                    <tr key={index} className="border">
                      <td className="px-4 py-2 text-black">{sublinea.denominacion}</td>
                      <td className="px-4 py-2 text-black">{sublinea.observacion}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSublinea(index, false)}
                          className="bg-gray-100 text-red-600 hover:text-red-800"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sublineasNuevas.map((sublinea, index) => (
                    <tr key={index} className="border">
                      <td className="px-4 py-2 text-black">{sublinea.denominacion}</td>
                      <td className="px-4 py-2 text-black">{sublinea.observacion}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSublinea(index, true)}
                          className="bg-gray-100 text-red-600 hover:text-red-800"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={handleAddSublinea}
                className="bg-gray-100 mt-2 text-blue-600 hover:text-blue-800"
              >
                ➕ Agregar sublínea
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
      <AlertasConfirmacion />
    </div>
  );
}
