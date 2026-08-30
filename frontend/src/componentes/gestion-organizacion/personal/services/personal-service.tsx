import { createCrudService } from "../../../../utils/crudFactory";
import { FormValuesPersonal } from "../interfaces/interfaces-validaciones-personal";

const baseService = createCrudService<FormValuesPersonal>("personal");

const PersonalService = {
  ...baseService,
};

export default PersonalService;
