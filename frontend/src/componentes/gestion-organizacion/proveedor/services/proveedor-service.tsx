import axios from "axios";
import { createCrudService } from "../../../../utils/crudFactory";
import axiosConfig from "../../../../utils/axiosConfig";

const baseService = createCrudService("proveedor");
const apiUrl = axiosConfig.apiUrl;

const ProveedorService = {
  ...baseService,
  obtenerCondicionesIVATotales: async () => {
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

  imprimirProveedores: async (payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axios.post(
        `${apiUrl}/proveedor/imprimir-proveedores`,
        payload,
        {
          headers,
          responseType: "blob", 
        }
      );

      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default ProveedorService;
