import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import { FormValues, schema, transformData } from "../interfaces/interfaces-validaciones-localidad";
import FormInput from "../../../herramientas/formateo-de-campos/form-input";
import {
  Localidad,
  Provincia,
  SelectProvincia,
} from "../../../../interfaces/gestion-organizacion/localidad/interfaces-localidad";
import Select from "react-select";
import React from "react";
import LocalidadService from "../services/localidad-service";
import { parseApiError } from "../../../../utils/errores";
import { MapPin } from "lucide-react";
import { getUsuarioId } from "../../../../utils/auth";
import EncabezadoFormularios from "../../../ui/encabezadoFormularios";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../../../herramientas/alertas/alertas-confirmacion";
import { ResponsePost } from "../../../../interfaces/generales/interfaces-generales";

const NOMBRE_ENTIDAD = "Localidad";

export default function RegistrarActualizarLocalidadForm({
  entidad,
  provincia,
  onClose,
  onSuccess,
}: {
  entidad?: Localidad;
  onClose: () => void;
  onSuccess: (mensajeAlerta: string) => void;
  provincia?: SelectProvincia;
}) {
  const usuarioId = getUsuarioId();
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const [provincias, setProvincias] = React.useState<Provincia[]>([]);
  const [selectedProvincia, setSelectedProvincia] = React.useState<SelectProvincia>({} as SelectProvincia);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: entidad ? transformData(entidad) : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    setError,
  } = methods;

  const provinciaId = watch("provinciaId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provinciaRes = await LocalidadService.obtenerTotales({ denominacion: " " }, "provincias");
        setProvincias(provinciaRes.data);

        if (entidad) {
          setValue("denominacion", entidad.denominacion || "");
          setValue("provinciaId", entidad.provincia.id || 0);
          setSelectedProvincia(entidad.provincia);
        }

        if (provincia) {
          setValue("provinciaId", provincia.id);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (formData: FormValues) => {
    let response: ResponsePost;
    try {
      if (entidad) {
        const payload = { ...formData, usuarioUpdatedId: usuarioId };
        response = await LocalidadService.actualizar(entidad.id, payload);
      } else {
        const payload = { ...formData, usuarioCreatedId: usuarioId };
        response = await LocalidadService.nuevo(payload);
      }
      onClose();
      onSuccess(response.mensaje);
    } catch (error) {
      const errorMessage = parseApiError(error);
      setError("root", { type: "manual", message: errorMessage });
    }
  };

  const handleOnClose = async () => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que quieres cerrar el formulario? NO se guardaran los cambios.",
      confirmText: "Aceptar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });
    if (confirmed) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-2xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        <EncabezadoFormularios
          title={entidad ? `Actualizar ${NOMBRE_ENTIDAD}` : `Registrar ${NOMBRE_ENTIDAD}`}
          subtitle={
            entidad
              ? "Modifica los detalles de la Localidad."
              : "Ingresa los datos de la nueva Localidad."
          }
          icon={<MapPin className="form-icon" />}
          onClose={handleOnClose}
        />

        <fieldset disabled={entidad?.sistema === 1}>
          <FormProvider {...methods}>
            <form onSubmit={(e) => { e.stopPropagation(); handleSubmit(onSubmit)(e); }}>
              <CardContent className="space-y-3 px-3 py-2">
                <FormInput name="denominacion" label="Denominación" placeholder="Ingresa la denominación" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 py-1">Provincia</label>
                  <Select
                    value={
                      provincias.length > 0
                        ? (selectedProvincia && provincias.find((o) => o.id === provinciaId)) || null
                        : selectedProvincia
                    }
                    options={provincias}
                    getOptionLabel={(o) => o.denominacion}
                    getOptionValue={(o) => String(o.id)}
                    onChange={(selected) => {
                      methods.setValue("provinciaId", selected?.id || 0);
                      if (selected) setSelectedProvincia(selected);
                    }}
                    placeholder="Seleccione"
                    className="text-black"
                    menuPortalTarget={document.body}
                    styles={{
                      control: (base) => ({ ...base, color: "black" }),
                      singleValue: (base) => ({ ...base, color: "black" }),
                      option: (base, { isSelected, isFocused }) => ({
                        ...base,
                        color: isSelected ? "white" : "black",
                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  {errors.provinciaId?.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.provinciaId.message}</p>
                  )}
                </div>
              </CardContent>

              {errors.root?.message && (
                <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>
              )}

              <CardFooter className="flex justify-center">
                <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                  {isSubmitting
                    ? entidad ? "Actualizando..." : "Registrando..."
                    : entidad ? "Actualizar" : "Registrar"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </fieldset>
      </Card>
      <AlertasConfirmacion />
    </div>
  );
}
