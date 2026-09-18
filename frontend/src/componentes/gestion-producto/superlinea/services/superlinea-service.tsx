import { createCrudService } from "../../../../utils/crudFactory";
import { Superlinea } from "../../../../interfaces/gestion-producto/superlinea/interfaces-superlinea";
import ApiService from "../../../../utils/apiService";

const baseService = createCrudService<any>("superlinea");

const SuperLineaService = {
  ...baseService,
  obtenerListado: async (): Promise<Superlinea[]> => {
    const data = await ApiService.get('/superlinea/listado');
    return data;
  },
};

export default SuperLineaService;
