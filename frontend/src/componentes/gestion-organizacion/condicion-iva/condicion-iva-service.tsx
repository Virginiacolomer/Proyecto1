import { FormValues } from "./interfaces-validaciones-condicion-iva";
import { createCrudService } from "../../../utils/crudFactory";

const baseService = createCrudService<FormValues>("condicion-iva");

const CondicionIvaService = {
  ...baseService,
};

export default CondicionIvaService;
