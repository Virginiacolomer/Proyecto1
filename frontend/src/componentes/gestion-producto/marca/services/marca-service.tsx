import { FormValues } from "../interfaces/interfaces-validaciones-marca";
import { createCrudService } from "../../../../utils/crudFactory";
import axios from "axios";
import axiosConfig from "../../../../utils/axiosConfig";
import { obtenerUsuarioId } from "../../../../utils/usuarioHelper";

const baseService = createCrudService<FormValues>("marca");

const apiUrl = axiosConfig.apiUrl;

const MarcaService = {
  ...baseService,

  /* imprimirListado: async (): Promise<Blob> => {
    const url = `${apiUrl}/marca/imprimir-listado-todo`;
    const token = localStorage.getItem("Token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const params: any = {
      denominacion: "algo",
      usuarioId: 1
    };
    
    const response = await axios.get(url, {
    params, 
    headers
  });
    return response.data;
  }, */
};

export default MarcaService;
//