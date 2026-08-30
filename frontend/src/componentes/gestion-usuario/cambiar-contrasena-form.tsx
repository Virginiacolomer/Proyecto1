// CambiarContrasenaForm.tsx
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cambiarContrasenaSchema, FormValuesCambiarContrasena } from "./interfaces-validaciones-usuario";
import UsuarioService from "./usuario-service";
import { Button } from "../ui/Button";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/Card";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Lock, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Progress } from "../ui/Progress";

// Función para evaluar la fortaleza de la contraseña
const evaluatePasswordStrength = (password: string) => {
  let score = 0;
  const feedback = [];

  if (password.length >= 8) score += 25;
  else feedback.push("Mínimo 8 caracteres");

  if (/[A-Z]/.test(password)) score += 25;
  else feedback.push("Una mayúscula");

  if (/[a-z]/.test(password)) score += 25;
  else feedback.push("Una minúscula");

  if (/[0-9]/.test(password)) score += 25;
  else feedback.push("Un número");

  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  else feedback.push("Un carácter especial");

  let strength = "Muy débil";
  let color = "bg-red-500";

  if (score >= 75) {
    strength = "Fuerte";
    color = "bg-green-500";
  } else if (score >= 50) {
    strength = "Media";
    color = "bg-yellow-500";
  } else if (score >= 25) {
    strength = "Débil";
    color = "bg-orange-500";
  }

  return { score: Math.min(score, 100), strength, color, feedback };
};

export default function CambiarContrasenaForm({
  mail,
  onClose,
}: {
  mail: string;

  onClose: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    strength: string;
    color: string;
    feedback: string[];
  }>({ score: 0, strength: "", color: "", feedback: [] });

  const methods = useForm<FormValuesCambiarContrasena>({
    resolver: yupResolver(cambiarContrasenaSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    register,
    watch,
  } = methods;

  const watchPassword = watch("nuevaContrasena");
  const watchConfirmPassword = watch("confirmarContrasena");
  const nuevaContrasena = watch("nuevaContrasena");
  const confirmarContrasena = watch("confirmarContrasena");

  const passwordsMatch = watchPassword && watchConfirmPassword && watchPassword === watchConfirmPassword;

  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(evaluatePasswordStrength(watchPassword));
    }
  }, [watchPassword]);

  const onSubmit = async (data: FormValuesCambiarContrasena) => {
    try {
      await UsuarioService.cambiarContrasena(mail, data.nuevaContrasena);
      onClose();
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setError("root", {
        type: "manual",
        message: "Hubo un problema al cambiar la contraseña.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl border-0 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header con gradiente */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            &times;
          </button>

          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Nueva Contraseña</CardTitle>
            <CardDescription className="text-green-100 text-sm">
              Crea una contraseña segura para tu cuenta
            </CardDescription>
            <div className="mt-3 text-xs bg-white/10 rounded-full px-3 py-1 inline-block">{mail}</div>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <CardContent className="p-0 space-y-6">
              {/* Campo Nueva Contraseña */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Configurar nueva contraseña</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nuevaContrasena" className="text-sm font-medium text-gray-700">
                    Nueva Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="nuevaContrasena"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu nueva contraseña"
                      value={nuevaContrasena}
                      className="h-11 pr-10 text-black border-gray-200 focus:border-green-500 focus:ring-green-500"
                      {...register("nuevaContrasena", {
                        required: "La contraseña es requerida",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 bg-transparent -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-black " />
                      ) : (
                        <Eye className="w-4 h-4 text-black " />
                      )}
                    </button>
                  </div>
                  {errors.nuevaContrasena && (
                    <p className="text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.nuevaContrasena.message}</span>
                    </p>
                  )}
                </div>

                {/* Indicador de fortaleza */}
                {watchPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Fortaleza de contraseña</span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.strength === "Fuerte"
                            ? "text-green-600"
                            : passwordStrength.strength === "Media"
                              ? "text-yellow-600"
                              : passwordStrength.strength === "Débil"
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <Progress value={passwordStrength.score} className="h-2" />
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-500">
                        <span>Falta: </span>
                        {passwordStrength.feedback.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Campo Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmarContrasena" className="text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmarContrasena"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu nueva contraseña"
                    value={confirmarContrasena}
                    className={`h-11 pr-10 text-black border-gray-200 focus:ring-green-500 ${
                      watchConfirmPassword && !passwordsMatch
                        ? "border-red-300 focus:border-red-500"
                        : passwordsMatch
                          ? "border-green-300 focus:border-green-500"
                          : "focus:border-green-500"
                    }`}
                    {...register("confirmarContrasena", {
                      required: "Confirma tu contraseña",
                      validate: (value) => value === watchPassword || "Las contraseñas no coinciden",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 bg-transparent  -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-black" />
                    ) : (
                      <Eye className="w-4 h-4 text-black" />
                    )}
                  </button>
                </div>

                {/* Indicador de coincidencia */}
                {watchConfirmPassword && (
                  <div className="flex items-center space-x-2 text-sm">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Las contraseñas coinciden</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Las contraseñas no coinciden</span>
                      </>
                    )}
                  </div>
                )}

                {errors.confirmarContrasena && (
                  <p className="text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.confirmarContrasena.message}</span>
                  </p>
                )}
              </div>

              {/* Consejos de seguridad */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Consejos para una contraseña segura:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Al menos 8 caracteres de longitud</li>
                  <li>• Combina mayúsculas y minúsculas</li>
                  <li>• Incluye números y símbolos</li>
                  <li>• Evita información personal</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <Button
                type="submit"
                disabled={isSubmitting || !passwordsMatch || passwordStrength.score < 50}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Cambiando contraseña...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Cambiar Contraseña</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
