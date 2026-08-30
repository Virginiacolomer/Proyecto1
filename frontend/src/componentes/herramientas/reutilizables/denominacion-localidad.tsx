import { useEffect, useState } from "react";
import {
  SelectLocalidad,
  SelectProvincia,
} from "../../../interfaces/gestion-organizacion/localidad/interfaces-localidad";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import FormInput from "../formateo-de-campos/form-input";
import BancoService from "../../gestion-organizacion/banco/banco-service";

export interface DatosDenominacionLocalidad {
  denominacion: string;
}
interface FormValues {
  localidadId: number;
  provinciaId: number;
}

const schema = yup.object().shape({
  localidadId: yup.number().required(),
  provinciaId: yup.number().required(),
});

export default function DenominacionLocalidadForm({
  onDatos,
  denominacionLocalidad,
}: {
  denominacionLocalidad?: string;
  onDatos: (datos: DatosDenominacionLocalidad) => void;
}) {
  const [localidades, setLocalidades] = useState<SelectLocalidad[]>([]);
  const [provincias, setProvincias] = useState<SelectProvincia[]>([]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const { watch } = methods;

  const localidadId = watch("localidadId");
  const provinciaId = watch("provinciaId");

  useEffect(() => {
    const fetch = async () => {
      try {
        if (provinciaId > 0 && provinciaId !== undefined) {
          const localidades = await BancoService.obtenerTotalesPara(provinciaId, "localidades"); // deberías tener este endpoint
          setLocalidades(localidades.data);
        }
      } catch (error) {
        console.error("Error al cargar provincias:", error);
      }
    };
    fetch();
  }, [provinciaId]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const provincias = await BancoService.obtenerTotales({ denominacion: " " }, "provincias"); // deberías tener este endpoint
        setProvincias(provincias.data);
      } catch (error) {
        console.error("Error al cargar provincias:", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const localidadSeleccionada = localidades.find((l) => l.id === localidadId);
    if (localidadSeleccionada) {
      onDatos({
        denominacion: localidadSeleccionada.denominacion,
      });
    }
  }, [localidadId, localidades]);

  return (
    <FormProvider {...methods}>
      <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {denominacionLocalidad ? null : (
            <>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 py-1">Provincia</label>
                <Select
                  value={provincias.find((option) => option.id === watch("provinciaId")) || null}
                  options={provincias}
                  getOptionLabel={(option) => option.denominacion}
                  getOptionValue={(option) => String(option.id)}
                  onChange={(selectedOption) => {
                    methods.setValue(`provinciaId`, selectedOption?.id || 0);
                  }}
                  placeholder="Seleccione"
                  className="text-black"
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
                    option: (base, { isSelected }) => ({
                      ...base,
                      color: isSelected ? "white" : "black",
                      backgroundColor: isSelected ? "#3b82f6" : "white",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
            </>
          )}

          <div className="w-full">
            <label className=" block text-sm font-medium text-gray-700 py-1">Localidad</label>
            {denominacionLocalidad ? (
              <FormInput name="denominacionLocalidad" defaultValue={denominacionLocalidad} label="" />
            ) : (
              <>
                <Select
                  value={localidades.find((option) => option.id === watch("localidadId")) || null}
                  options={localidades}
                  getOptionLabel={(option) => option.denominacion}
                  getOptionValue={(option) => String(option.id)}
                  onChange={(selectedOption) => {
                    methods.setValue(`localidadId`, selectedOption?.id || 0);
                  }}
                  placeholder="Seleccione"
                  isDisabled={!provinciaId} // 👈 Deshabilita si no hay provincia
                  className="text-black"
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
                    option: (base, { isSelected }) => ({
                      ...base,
                      color: isSelected ? "white" : "black",
                      backgroundColor: isSelected ? "#3b82f6" : "white",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
