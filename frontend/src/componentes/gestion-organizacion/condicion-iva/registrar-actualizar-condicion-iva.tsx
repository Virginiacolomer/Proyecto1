import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { CardContent, CardFooter } from "../../ui/Card";
import { Button } from "../../ui/Button";
import FormInput from "../../herramientas/formateo-de-campos/form-input";
import { Card } from "../../ui/Card";
import { FormValues, schema, transformData } from "./interfaces-validaciones-condicion-iva";
import { CondicionIva, Letra } from "../../../interfaces/generales/interfaces-generales";
import CondicionIvaService from "./condicion-iva-service";
import { parseApiError } from "../../../utils/errores";
import Select from "react-select";
import { Wallet } from "lucide-react";
import { getUsuarioId } from "../../../utils/auth";

export default function RegistrarActualizarCondicionIvaForm({
  condicionIva,
  onClose,
  onSuccess,
}: {
  condicionIva?: CondicionIva;
  onClose: () => void;
  onSuccess: (denominacionCondicionIva: string) => void;
}) {
  //===================== CONSTANTES VARIAS ============================================
  const usuarioId = getUsuarioId();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: condicionIva ? transformData(condicionIva) : {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    setError,
    watch,
  } = methods;
  console.log("Errores del formulario:", errors);

  const letra = watch("letra");

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (condicionIva) {
          setValue("denominacion", condicionIva.denominacion || "");
          setValue("observacion", condicionIva.observacion || null);
          setValue("letra", condicionIva.letra || null);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (formData: FormValues) => {
    try {
      if (condicionIva) {
        const payload = {
          ...formData,
          usuarioUpdatedId: usuarioId,
        };

        console.log("Payload enviado:", JSON.stringify(payload, null, 2));

        await CondicionIvaService.actualizar(condicionIva.id, payload);
      } else {
        const payload = {
          ...formData,
          usuarioCreatedId: usuarioId,
        };

        console.log("Payload enviado:", JSON.stringify(payload, null, 2));

        await CondicionIvaService.nuevo(payload);
      }
      onClose();
      onSuccess(formData.denominacion);
    } catch (error) {
      console.error("Error al guardar la condicion iva:", error);

      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-2xl bg-white mx-auto shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
        {/* Botón de cierre del modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          &times;
        </button>

        {/* Título del formulario */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-t-xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-orange-500" />
            <span>{condicionIva ? "Actualizar Condición de IVA" : "Registrar Condición de IVA"}</span>
          </h2>
          <p className="text-slate-300 mt-1">
            {condicionIva
              ? "Modifica los detalles de la Condición de IVA."
              : "Ingresa los datos de la nueva Condición de IVA para registrarla."}
          </p>
        </div>

        {/* Formulario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-3 px-3 py-2">
              {/* Campos generales */}
              <div className="flex gap-x-4">
                <div className="flex-1">
                  <FormInput
                    name="denominacion"
                    label="Denominación"
                    placeholder="Ingresa la denominación"
                    disabled={(condicionIva?.sistema ?? 0) > 0}
                  />
                </div>
                <div className="flex-1 mt-0">
                  <label className="block text-sm font-medium text-gray-700 py-1">Letra</label>
                  <Select
                    value={
                      Object.entries(Letra)
                        .map(([key, value]) => ({
                          id: key,
                          denominacion: value,
                        }))
                        .find((option) => option.denominacion === letra) || null
                    }
                    options={Object.entries(Letra).map(([key, value]) => ({
                      id: key,
                      denominacion: value,
                    }))}
                    isDisabled={(condicionIva?.sistema ?? 0) > 0}
                    getOptionLabel={(option) => option.denominacion}
                    getOptionValue={(option) => String(option.id)}
                    onChange={(selectedOption) => {
                      methods.setValue(`letra`, selectedOption?.denominacion || "");
                    }}
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
                      option: (base, { isSelected, isFocused }) => ({
                        ...base,
                        color: isSelected ? "white" : "black",
                        backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#93c5fd" : "white",
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>
              <FormInput name="observacion" label="Observación" placeholder="Ingresa una observación (opcional)" />
            </CardContent>

            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

            {/* Botón de submit */}
            <CardFooter className="flex justify-center">
              <Button type="submit" disabled={isSubmitting} className="btn btn-dark">
                {isSubmitting
                  ? condicionIva
                    ? "Actualizando..."
                    : "Registrando..."
                  : condicionIva
                    ? "Actualizar"
                    : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
