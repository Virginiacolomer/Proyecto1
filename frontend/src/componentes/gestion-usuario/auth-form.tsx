import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import UsuarioService from "./usuario-service";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { DecodedToken, FormValuesLogin, loginSchema } from "./interfaces-validaciones-usuario";
import { Empresa } from "../../interfaces/generales/interfaces-generales";
import { useConfiguracionSistema } from "../sistema/ConfiguracionSistemaContext";
import { GoogleLogin } from "@react-oauth/google";
import { parseApiError } from "../../utils/errores";
import RecuperarContrasenaForm from "./recuperar-contrasena-form";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) {
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValuesLogin>({
    resolver: yupResolver(loginSchema),
    defaultValues: { mail: "", contrasena: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    register,
  } = methods;
  console.log("Errores del formulario:", errors);

  // Obtener proveedores, marcas y líneas
  const [empresaId, setEmpresaId] = useState<number>();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [, setErrorMessage] = useState("");
  const { setConfiguracionEnContext } = useConfiguracionSistema();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empresaRes] = await Promise.all([await UsuarioService.obtenerEmpresasTotales()]);

        setEmpresas(empresaRes);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (formData: FormValuesLogin) => {
    setErrorMessage("");

    try {
      const payload = { ...formData, empresaId };

      console.log("Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await UsuarioService.login(payload);
      const token = response?.data.refreshToken;

      localStorage.setItem("Token", token);

      const decodedToken: DecodedToken = jwtDecode(token);

      const config = await UsuarioService.obtenerConfiguracion(decodedToken.empresaId);

      setConfiguracionEnContext(config);

      window.location.href = "/admin";

      if (onClose) onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);

      const errorMessage = parseApiError(error);

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const handleLoginConGoogle = async (credentialResponse: any) => {
    try {
      if (empresaId === undefined || empresaId < 0) {
        setError("root", {
          type: "manual",
          message: "Debes seleccionar una empresa antes de iniciar sesión con Google.",
        });
        return; // Salir sin hacer la petición
      }

      const token = credentialResponse.credential;

      const res = await UsuarioService.loginConGoogle(token ? token : "", Number(empresaId));

      localStorage.setItem("Token", res?.data.refreshToken);

      window.location.href = "/admin";
    } catch (error) {
      console.error("Error al hacer login con Google", error);
      setError("root", {
        type: "manual",
        message: "Error al iniciar sesión con Google",
      });
    }
  };

  return (
    <div className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del formulario */}
          <div className="space-y-3">
            <FormInput name="mail" label="Correo Electrónico" placeholder="tu@ejemplo.com" className="text-sm" />

            <div className="relative">
              <Label htmlFor={"contrasena"} className="text-sm font-medium text-gray-700 block mb-1">
                Contraseña
              </Label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("contrasena")}
                className="w-full text-black bg-gray-100 px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute h-2 top-1/1 mt-3 right-3  p-0 m-0 bg-transparent border-none text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-principal" />
                ) : (
                  <Eye size={16} className="text-principal" />
                )}
              </button>
            </div>

            {/* Select de empresa/rol */}
            <div className="space-y-1">
              <Label htmlFor="empresaId" className="text-xs font-medium text-gray-700">
                Empresa
              </Label>
              <select
                id="empresaId"
                value={empresaId}
                onChange={(e) => setEmpresaId(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una empresa</option>
                {Array.isArray(empresas) && empresas.length > 0 ? (
                  empresas.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.denominacion}
                    </option>
                  ))
                ) : (
                  <option disabled value="">
                    {empresas?.length === 0 ? "No hay empresas disponibles" : "Cargando empresas..."}
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Error message */}
          {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-principal hover:bg-overPrincipal text-white text-sm py-2.5 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
          </Button>

          {/* Botón para recuperar contraseña */}
          <p className="text-sm text-center mt-2 text-red-500">
            ¿Olvidaste tu contraseña?{" "}
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="text-principal bg-transparent hover:underline"
            >
              Recuperar
            </button>
          </p>

          {/* Google Login */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-center">
              <div className="w-full max-w-[280px]">
                <GoogleLogin
                  onSuccess={handleLoginConGoogle}
                  onError={() => {
                    setError("root", {
                      type: "manual",
                      message: "Falló el login con Google",
                    });
                  }}
                  theme="outline"
                  size="medium"
                  text="signin_with"
                  width="280"
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-6 sm:p-8 rounded-lg w-4/5 sm:w-3/5 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-full">
            <RecuperarContrasenaForm onClose={() => setMostrarModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
