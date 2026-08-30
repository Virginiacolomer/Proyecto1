import axiosConfig from "../../../../utils/axiosConfig";
import axios from "axios";
import { createCrudService } from "../../../../utils/crudFactory";
import { FormValues } from "../../producto/interfaces-validaciones-producto";

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
  
};

export default CambioPreciosMasivoService;
