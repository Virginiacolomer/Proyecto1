import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsuarioService from "./usuario-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import FormInput from "../herramientas/formateo-de-campos/form-input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { FormValuesRegister, registerSchema } from "./interfaces-validaciones-usuario";
import { Rol } from "../../interfaces/gestion-usuario/interfaces-usuario";
import { parseApiError } from "../../utils/errores";

export default function RegistrarUsuario({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) {
  //===================== CONSTANTES VARIAS ============================================

  const methods = useForm<FormValuesRegister>({
    resolver: yupResolver(registerSchema),
    defaultValues: { mail: "", contrasena: "", confirmarContrasena: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = methods;
  console.log("Errores del formulario:", errors);

  // Obtener proveedores, marcas y líneas
  const [rolId, setRolId] = useState<number | "">("");
  const [roles, setRoles] = useState<Rol[]>([]);
  const [, setErrorMessage] = useState("");

  //=============================== FUNCIONALIDAD ==================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolRes] = await Promise.all([await UsuarioService.obtenerRolesTotales()]);

        setRoles(rolRes);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (formData: FormValuesRegister) => {
    setErrorMessage("");

    try {
      // Excluir confirmarContrasena del payload
      const { confirmarContrasena, ...payload } = formData;

      // Agregar rolId al payload
      const finalPayload = { ...payload, rolId };

      console.log("Registrando usuario con:", JSON.stringify(finalPayload, null, 2));
      await UsuarioService.register(finalPayload);

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="relative w-full max-w-md mx-auto bg-white shadow-2xl rounded-xl overflow-hidden sm:w-11/12 md:w-full">
        {/* Botón de cierre del modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          &times;
        </button>

        {/* Título del formulario */}
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800">
            Registrar Usuario
          </CardTitle>
          <CardDescription className="text-center text-gray-600 text-base sm:text-lg">
            Ingresa los datos del nuevo usuario para registrarlo
          </CardDescription>
        </CardHeader>

        {/* Formulario */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Campos generales */}
              <FormInput name="mail" label="Correo Electrónico" placeholder="tu@ejemplo.com" />
              <FormInput name="contrasena" label="Contraseña" type="password" />
              <FormInput name="confirmarContrasena" label="Confirmar Contraseña" type="password" />

              {/* Selects */}
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="rolId" className="text-sm font-medium text-gray-700 block mb-1">
                  Rol
                </Label>
                <select
                  id="rolId"
                  value={rolId}
                  onChange={(e) => setRolId(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800"
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.denominacion}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>

            {errors.root?.message && <div className="text-red-600 text-center mb-4">{String(errors.root.message)}</div>}

            {/* Botón de submit */}
            <CardFooter className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
              >
                {isSubmitting ? "Registrando..." : "Registrar"}
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
