import axios from "axios";
import axiosConfig from "../../../utils/axiosConfig";

const apiUrl = axiosConfig.apiUrl;

const ImportacionPreciosService = {
  importarPreciosIveco: async (file: File, payload: any) => {
    try {
      const token = localStorage.getItem("Token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("cotizacion", payload.cotizacionDolar);
      formData.append("usuarioId", payload.usuarioId);

      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const url = `${apiUrl}/importacion-lista-precios/upload-iveco`;

      const { data } = await axios.post(url, formData, { headers });
      return data;
    } catch (error) {
      console.error("Error al importar precios:", error);
      // ⛔️ Acá lanzás el error para que el formulario pueda capturarlo
      throw error;
    }
  },
  importarPreciosNextPro: async (file: File, payload: any) => {
    try {
      const token = localStorage.getItem("Token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("cotizacion", payload.cotizacionDolar);
      formData.append("usuarioId", payload.usuarioId);

      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const url = `${apiUrl}/importacion-lista-precios/upload-next-pro`;

      const { data } = await axios.post(url, formData, { headers });
      return data;
    } catch (error) {
      console.error("Error al importar precios:", error);
      // ⛔️ Acá lanzás el error para que el formulario pueda capturarlo
      throw error;
    }
  },
};
export default ImportacionPreciosService;
