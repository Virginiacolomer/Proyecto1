import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { CardTitle, CardContent, CardFooter } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import ImportacionPreciosService from "../precios-service";
import PriceInput from "../../../herramientas/formateo-de-campos/price-input";
import CargaArchivo from "../carga-archivo";
import { crearSchemaValidacion, FormValues } from "./interfaces-validaciones-precio-nex-pro";
import { CheckCircle, DollarSign, Upload } from "lucide-react";
import { useConfiguracionSistema } from "../../../sistema/ConfiguracionSistemaContext";
import { parseApiError } from "../../../../utils/errores";
import { getUsuarioId } from "../../../../utils/auth";

export default function ImportacionPreciosNexProForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  //===================== CONSTANTES VARIAS ============================================
  const usuario = getUsuarioId();
  const usuarioCreatedId = usuario;
  const [file, setFile] = useState<File | null>(null);
  const { configuracion } = useConfiguracionSistema();
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  //=============================== FUNCIONALIDAD ==================================
  const schema = crearSchemaValidacion(configuracion?.maximoDolar ?? 0);
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    watch,
    setValue,
  } = methods;

  const cotizacionDolar = watch("cotizacionDolar");

  const onSubmit = async (data: FormValues) => {
    try {
      if (!file) {
        setError("root", {
          type: "manual",
          message: "Debe seleccionar un archivo para importar.",
        });
        return;
      }

      const payload = {
        ...data,
        usuarioId: usuarioCreatedId,
      };

      await ImportacionPreciosService.importarPreciosNextPro(file, payload);

      setMensajeExito("¡Importación exitosa!");
      onSuccess(); // Si querés refrescar datos o actualizar estado global
    } catch (error) {
      console.error("Error al guardar el producto:", error);

      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleArchivoCargado = (file: File) => {
    setFile(file);
  };

  return (
    <Card className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          &times;
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">Importar Productos NEXPRO</CardTitle>
            <p className="text-blue-100 text-sm mt-1">Configure los parámetros de importación</p>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-6">
            {/* Campo de cotización del dólar */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                Cotización del Dólar
              </label>
              <div className="relative">
                <PriceInput
                  name="cotizacionDolar"
                  label=""
                  value={cotizacionDolar || 0}
                  onChange={(value) => setValue("cotizacionDolar", Number(value))}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Sección de carga de archivo */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Upload className="w-4 h-4 mr-2 text-blue-600" />
                Archivo
              </label>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-colors duration-200">
                <CargaArchivo onFile={handleArchivoCargado} />
              </div>
              {file && (
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Archivo seleccionado: {file.name}</span>
                </div>
              )}
            </div>

            {/* Mensaje de error */}
            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}
            {mensajeExito && (
              <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-700 dark:text-green-400 text-sm">{mensajeExito}</span>
              </div>
            )}
          </CardContent>

          {/* Footer con botones */}
          <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-xl py-3 font-medium transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !file || !!mensajeExito}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transform disabled:transform-none transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Importar Productos</span>
                  </div>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
}
