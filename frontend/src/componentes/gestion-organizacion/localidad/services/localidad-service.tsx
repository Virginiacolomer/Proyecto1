import axios from "axios";
import { createCrudService } from "../../../../utils/crudFactory";
import { FormValues } from "../interfaces/interfaces-validaciones-localidad";
import axiosConfig from "../../../../utils/axiosConfig";

const baseService = createCrudService<FormValues>("localidad");
const apiUrl = axiosConfig.apiUrl;

const LocalidadService = {
  ...baseService,

  obtenerProvinciasTotales: async () => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(`${apiUrl}/provincia/findAllFor`, { headers });
      return data;
    } catch (error) {
      console.error("Error al obtener provincias:", error);
      return null;
    }
  },
};

export default LocalidadService;
