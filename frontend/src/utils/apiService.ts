import axios from "axios";
import axiosConfig from "./axiosConfig";


const apiUrl = axiosConfig.apiUrl;

const getAuthHeaders = () => {
  const token = localStorage.getItem("Token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ApiService = {

  get: async (url: string, params?: any) => {
    try {
      const { data } = await axios.get(`${apiUrl}${url}`, {
        params,
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error(`GET ${url} →`, error);
      throw error;
    }
  },

  imprimir: async (url: string): Promise<Blob> => {
    try {
      const {data} = await axios.get(`${apiUrl}${url}`, {
        responseType: "blob",
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  imprimirPost(url: string, data: any) {
    return axios.post(url, data, {
      responseType: "blob",
    });
  },

  post: async (url: string, body: any) => {
    try {
      const { data } = await axios.post(`${apiUrl}${url}`, body, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error(`POST ${url} →`, error);
      throw error;
    }
  },

  put: async (url: string, body: any) => {
    try {
      const { data } = await axios.put(`${apiUrl}${url}`, body, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error(`PUT ${url} →`, error);
      throw error;
    }
  },

  delete: async (url: string, usuarioId:number) => {
    try {
      const { data } = await axios.delete(`${apiUrl}${url}`, {
        headers: getAuthHeaders(),
        params: { usuarioId },
      });
      return data;
    } catch (error) {
      console.error(`DELETE ${url} →`, error);
      throw error;
    }
  },

  patch: async (url: string, data?: any) => {
    try {
      const response = await axios.patch(`${apiUrl}${url}`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`PATCH ${url} →`, error);
      throw error;
    }
  }
};

export default ApiService;
