import axios from "axios";
import axiosConfig from "../../../utils/axiosConfig";

const apiUrl = axiosConfig.apiUrl;

const DocumentoService = {
  obtenerDocumentosConFiltros: async (filtros: any) => {
    try {
      const token = localStorage.getItem("Token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params: any = {
        fechaDesde: filtros.fechaDesde || "",
        fechaHasta: filtros.fechaHasta || "",
        operadorId: filtros.operadorId || 0,
        empresaId: filtros.empresaId,
        tipoDocumento: filtros.tipoDocumento || "",
        skip: filtros.skip || 0,
        take: filtros.take || 10,
      };

      console.log("filtrosss: ", params);

      const { data } = await axios.get(`${apiUrl}/busquedas-genericas/search-by`, { params, headers });
      console.log("Respuesta de la API:", data); // Agregado para depuración
      return data;
    } catch (error) {
      console.error("Error al obtener cargas compra filtrados:", error);
      return [];
    }
  },
};

export default DocumentoService;
