import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardFooter } from "../ui/Card";
import EncabezadoFormularios from "../ui/encabezadoFormularios";
import UsuarioService from "./usuario-service";
import { getUsuarioId } from "../../utils/auth";
import { parseApiError } from "../../utils/errores";
import {
  TipoAlertaConfirmacion,
  TituloAlertaConfirmacion,
  useConfirmation,
} from "../herramientas/alertas/alertas-confirmacion";

interface FormValues {
  contrasenaActual: string;
  contrasenaNueva: string;
  confirmarContrasena: string;
}

const schema = yup.object().shape({
  contrasenaActual: yup.string().required("La contraseña actual es obligatoria"),
  contrasenaNueva: yup
    .string()
    .required("La nueva contraseña es obligatoria")
    .min(8, "Mínimo 8 caracteres"),
  confirmarContrasena: yup
    .string()
    .required("Confirmá la nueva contraseña")
    .oneOf([yup.ref("contrasenaNueva")], "Las contraseñas no coinciden"),
});

function PasswordInput({
  placeholder,
  registration,
  error,
}: {
  placeholder: string;
  registration: any;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full h-10 pr-10 px-3 rounded-md border border-gray-300 bg-gray-100 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

export default function CambiarContrasenaModal({ onClose }: { onClose: () => void }) {
  const { showConfirmation, AlertasConfirmacion } = useConfirmation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const contrasenaNueva = watch("contrasenaNueva");
  const confirmarContrasena = watch("confirmarContrasena");
  const passwordsMatch = contrasenaNueva && confirmarContrasena && contrasenaNueva === confirmarContrasena;

  const onSubmit = async (data: FormValues) => {
    const confirmed = await showConfirmation({
      type: TipoAlertaConfirmacion.DEFAULT,
      title: TituloAlertaConfirmacion.DEFAULT,
      message: "¿Estás seguro de que querés cambiar tu contraseña?",
      confirmText: "Sí, cambiar",
      cancelText: "Cancelar",
      onConfirm: () => {},
    });

    if (!confirmed) return;

    try {
      await UsuarioService.cambiarContrasenaAutenticado({
        id: getUsuarioId(),
        contrasenaActual: data.contrasenaActual,
        contrasenaNueva: data.contrasenaNueva,
        confirmarContrasena: data.confirmarContrasena,
      });
      onClose();
    } catch (error) {
      setError("root", {
        type: "manual",
        message: parseApiError(error),
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-md bg-white mx-auto shadow-lg rounded-2xl overflow-hidden">

        <EncabezadoFormularios
          title="Cambiar Contraseña"
          subtitle=""
          icon={<Lock className="form-icon" />}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 px-4 py-4">

            <div className="space-y-1">
              <label className="label-base">Contraseña actual</label>
              <PasswordInput
                placeholder="Ingresá tu contraseña actual"
                registration={register("contrasenaActual")}
                error={errors.contrasenaActual?.message}
              />
            </div>

            <div className="space-y-1">
              <label className="label-base">Nueva contraseña</label>
              <PasswordInput
                placeholder="Mínimo 8 caracteres"
                registration={register("contrasenaNueva")}
                error={errors.contrasenaNueva?.message}
              />
              {contrasenaNueva && contrasenaNueva.length < 8 && (
                <p className="text-xs text-orange-500 mt-1">
                  {contrasenaNueva.length}/8 caracteres mínimos
                </p>
              )}
              {contrasenaNueva && contrasenaNueva.length >= 8 && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Longitud correcta
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="label-base">Confirmar nueva contraseña</label>
              <PasswordInput
                placeholder="Repetí la nueva contraseña"
                registration={register("confirmarContrasena")}
                error={errors.confirmarContrasena?.message}
              />
              {confirmarContrasena && (
                <div className="flex items-center gap-1 text-sm mt-1">
                  {passwordsMatch ? (
                    <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-600">Las contraseñas coinciden</span></>
                  ) : (
                    <><AlertCircle className="w-4 h-4 text-red-500" /><span className="text-red-600">Las contraseñas no coinciden</span></>
                  )}
                </div>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
            )}

          </CardContent>

          <CardFooter className="flex justify-center py-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-dark"
            >
              {isSubmitting ? "Cambiando..." : "Cambiar contraseña"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <AlertasConfirmacion />
    </div>
  );
}
