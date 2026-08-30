import * as yup from "yup";

export interface DecodedToken {
  rolId: number;
  empresaId: number;
}

//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValuesRegister {
  mail: string;
  contrasena: string;
  confirmarContrasena: string;
}

export interface FormValuesLogin {
  mail: string;
  contrasena?: string | null;
  confirmarContrasena?: string | null;
}

export interface FormValuesRecuperarContrasena {
  mail: string;
  codigo: string;
}

export interface FormValuesCambiarContrasena {
  nuevaContrasena: string;
  confirmarContrasena: string;
}

//===================== schema de validacion ============================================//

export const loginSchema = yup.object().shape({
  mail: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9@._-]+$/, "Formato de correo inválido."),
  contrasena: yup.string().optional().nullable(),
});

export const registerSchema = yup.object().shape({
  mail: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9@._-]+$/, "Formato de correo inválido."),
  contrasena: yup.string().required("La contraseña es obligatoria."),
  confirmarContrasena: yup
    .string()
    .required("Debes confirmar la contraseña.")
    .oneOf([yup.ref("contrasena")], "Las contraseñas no coinciden."),
});

export const recuperarContrasenaSchema = yup.object().shape({
  mail: yup
    .string()
    .trim()
    .lowercase()
    .required("El correo electrónico es obligatorio.")
    .max(255, "Máximo 255 caracteres.")
    .matches(/^[A-Za-z0-9@._-]+$/, "Formato de correo inválido."),
  codigo: yup
    .string()
    .required("El código es obligatorio.")
    .length(6, "El código debe tener 6 caracteres.")
    .matches(/^[0-9]+$/, "El código debe ser numérico."),
});

export const cambiarContrasenaSchema = yup.object().shape({
  nuevaContrasena: yup
    .string()
    .required("La nueva contraseña es obligatoria.")
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
  confirmarContrasena: yup
    .string()
    .required("Debes confirmar la nueva contraseña.")
    .oneOf([yup.ref("nuevaContrasena")], "Las contraseñas no coinciden."),
});
