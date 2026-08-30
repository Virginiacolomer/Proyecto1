import { createCrudService } from "../../../../utils/crudFactory";
import { FormValues } from "../interfaces/interfaces-validaciones-linea";

const baseService = createCrudService<FormValues>("linea");

const LineaService = {
  ...baseService,
};

export default LineaService;
