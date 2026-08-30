import axios from "axios";
import { createCrudService } from "../../../../utils/crudFactory";
import axiosConfig from "../../../../utils/axiosConfig";

const baseService = createCrudService("usuario");
const apiUrl = axiosConfig.apiUrl;

const UsuarioService = {
  ...baseService,
/*   obtenerCondicionesIVATotales: async () => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get(`${apiUrl}/condicion-iva`, { headers });

      return data;
    } catch (error) {
      console.error("Error al obtener condicionesIVA: ", error);
      return null;
    }
  },

  obtenerLocalidadesTotales: async () => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.get(`${apiUrl}/localidad/findAllFor`, {
        headers,
      });

      return data;
    } catch (error) {
      console.error("Error al obtener localidades: ", error);
      return null;
    }
  },
 */
  imprimirUsuarios: async (payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.post(`${apiUrl}/usuario/imprimir-usuarios`, payload, {
        headers,
        responseType: "blob",
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  obtenerRolesDisponibles: async (): Promise<{ id: number; denominacion: string }[]> => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(`${apiUrl}/rol`, { headers });
      return data;
    } catch (error) {
      throw error;
    }
  },

  actualizarRoles: async (usuarioId: number, rolesIds: number[], usuarioUpdatedId: number) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.put(
        `${apiUrl}/usuario/${usuarioId}/roles`,
        { rolesIds, usuarioUpdatedId },
        { headers }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default UsuarioService;
