import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsuarioService from "./usuario-service";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Button } from "../ui/Button";
import { FormValuesRecuperarContrasena, recuperarContrasenaSchema } from "./interfaces-validaciones-usuario";

import { parseApiError } from "../../utils/errores";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/Card";
import { useState } from "react";
import CambiarContrasenaForm from "./cambiar-contrasena-form";
import { ArrowLeft, CheckCircle, Mail, Shield } from "lucide-react";

export default function RecuperarContrasenaForm({ onClose }: { onClose: () => void }) {
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValuesRecuperarContrasena>({
    resolver: yupResolver(recuperarContrasenaSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = methods;
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [mostrarCambioContrasena, setMostrarCambioContrasena] = useState(false);

  console.log("Errores del formulario:", errors);

  const mail = methods.watch("mail");

  //=============================== FUNCIONALIDAD ==================================

  const onSubmit = async (formData: FormValuesRecuperarContrasena) => {
    // Implementar lógica de envío de formulario aquí
    try {
      if (!codigoEnviado) {
        setError("root", {
          type: "manual",
          message: "Primero debes enviar el código al correo.",
        });
        return;
      }

      // Llamada a la API para verificar el código
      await UsuarioService.verificarCodigo(formData.mail, formData.codigo);
      setMostrarCambioContrasena(true); // Mostrar el nuevo modal
    } catch (error) {
      console.error("Error al guardar el usuario:", error);

      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleRecuperarContrasena = async () => {
    try {
      await UsuarioService.recuperarContrasena(mail);
      setCodigoEnviado(true);
    } catch (error) {
      console.error("Error al enviar el código de recuperación:", error);
      setError("root", {
        type: "manual",
        message: "Error al enviar el código de recuperación",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 from-slate-50 to-blue-50">
      <Card className="relative w-full max-w-md mx-auto bg-white shadow-xl rounded-2xl border-0 overflow-hidden">
        {/* Header con botón de cierre */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            &times;
          </button>

          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Recuperar Contraseña</CardTitle>
            <CardDescription className="text-blue-100 text-sm">
              {!codigoEnviado
                ? "Ingresa tu correo para recibir el código de verificación"
                : "Revisa tu correo e ingresa el código que recibiste"}
            </CardDescription>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <CardContent className="p-0 space-y-6">
              {/* Campo de email */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Paso 1: Verificación de correo</span>
                </div>

                <FormInput
                  name="mail"
                  label="Correo electrónico"
                  placeholder="ejemplo@correo.com"
                  type="email"
                  disabled={codigoEnviado}
                />
              </div>

              {/* Botón para enviar código */}
              {!codigoEnviado ? (
                <Button
                  type="button"
                  onClick={handleRecuperarContrasena}
                  disabled={isSubmitting}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enviando código...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Enviar código de verificación</span>
                    </div>
                  )}
                </Button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Código enviado exitosamente</span>
                  </div>
                  <p className="text-sm text-green-600">Revisa tu bandeja de entrada y carpeta de spam</p>
                </div>
              )}

              {/* Campo de código de verificación */}
              {codigoEnviado && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Paso 2: Código de verificación</span>
                  </div>

                  <FormInput
                    name="codigo"
                    label="Código de verificación"
                    placeholder="Ingresa el código de 6 dígitos"
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verificando código...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verificar código</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>

            {/* Footer con enlace para volver */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex bg-gray-200 items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al inicio de sesión</span>
              </button>
            </div>
          </form>
        </FormProvider>
      </Card>

      {mostrarCambioContrasena && (
        <CambiarContrasenaForm
          mail={mail}
          onClose={() => {
            setMostrarCambioContrasena(false);
            onClose(); // Cerrá también el modal principal
          }}
        />
      )}
    </div>
  );
}
