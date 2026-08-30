import axios from "axios";
import axiosConfig from "../../utils/axiosConfig";

const apiUrl = axiosConfig.apiUrl;

const UsuarioService = {
  obtenerUsuarioId: async (id: number) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get(`${apiUrl}/usuario/${id}`, { headers });
      return data;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return null;
    }
  },

  login: async (payload: any) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, payload);
      return response;
    } catch (error) {
      console.error("Error al iniciar Sesion:", error);
      return null;
    }
  },

  loginConGoogle: async (token: string, empresaId: number) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login-con-google`, {
        token,
        empresaId,
      });
      return response;
    } catch (error) {
      console.error("Error al iniciar Sesion:", error);
      return null;
    }
  },

  obtenerRol: async (id: number) => {
    try {
      const token = localStorage.getItem("Token");
      const roleResponse = await axios.get(`${apiUrl}/rol/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al header
        },
      });
      return roleResponse;
    } catch (error) {
      console.error("Error al obtener rol:", error);
      return null;
    }
  },

  register: async (payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(`${apiUrl}/auth/registrar`, payload, {
        headers,
      });

      return response;
    } catch (error) {
      console.error("Error al registrar Usuario:", error);
      return null;
    }
  },

  obtenerEmpresasTotales: async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/empresa`);
      return data;
    } catch (error) {
      console.error("Error al obtener empresas", error);
      return null;
    }
  },

  obtenerConfiguracion: async (empresaId: number) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get(`${apiUrl}/configuracion-sistema/${empresaId}`, { headers });
      return data;
    } catch (error) {
      console.error("Error al obtener configuraciones", error);
      return null;
    }
  },

  obtenerRolesTotales: async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/rol`);
      return data;
    } catch (error) {
      console.error("Error al obtener roles", error);
      return null;
    }
  },

  recuperarContrasena: async (mail: string) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/recuperar`, { mail });
      return response;
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      return null;
    }
  },

  verificarCodigo: async (mail: string, codigo: string) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/verificar-codigo`, {
        mail,
        codigo,
      });
      return response;
    } catch (error) {
      console.error("Error al verificar código:", error);
      return null;
    }
  },

  cambiarContrasena: async (mail: string, nuevaContrasena: string) => {
    try {
      const response = await axios.patch(`${apiUrl}/auth/cambiar-contrasena`, {
        mail,
        nuevaContrasena,
      });
      return response;
    } catch (error) {
      console.error("Error al cambiar contrasena:", error);
      return null;
    }
  },

  cambiarContrasenaAutenticado: async (payload: {
    id: number;
    contrasenaActual: string;
    contrasenaNueva: string;
    confirmarContrasena: string;
  }) => {
    const token = localStorage.getItem("Token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { id, ...body } = payload;
    const response = await axios.patch(`${apiUrl}/usuario/cambiar-contrasena/${id}`, body, { headers });
    return response;
  },
};

export default UsuarioService;
