import axiosConfig from "../../../../../utils/axiosConfig";
import axios from "axios";
import { createCrudService } from "../../../../../utils/crudFactory";
import ApiService from "../../../../../utils/apiService";
import { FormValues } from "../../../producto/interfaces/interfaces-validaciones-item-prod-alternativo";

const apiUrl = axiosConfig.apiUrl;

const baseService = createCrudService<FormValues>("cambio-precios");

const CambioPreciosMasivoService = {
  ...baseService,

  aplicarCambios: async (payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.patch(`${apiUrl}/cambio-precios/aplicar-cambios`, payload, { headers });
      return data;
      } catch (error) {
      throw error;
    }
  },

  guardarCambios: async (payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.patch(`${apiUrl}/cambio-precios/guardar-cambios`, payload, { headers });
      return data;
      } catch (error) {
      throw error;
    }
  },
  
  imprimirListaPrecios: async (payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axios.post(
        `${apiUrl}/lista-producto/imprimir-lista-producto`,
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

export default CambioPreciosMasivoService;
