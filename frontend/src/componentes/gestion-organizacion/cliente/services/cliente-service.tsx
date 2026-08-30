import axios from "axios";
import { createCrudService } from "../../../../utils/crudFactory";
import axiosConfig from "../../../../utils/axiosConfig";

const baseService = createCrudService("cliente");
const apiUrl = axiosConfig.apiUrl;

const ClienteService = {
  ...baseService,

  imprimirClientes: async (payload: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axios.post(
        `${apiUrl}/cliente/imprimir-clientes`,
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

export default ClienteService;
