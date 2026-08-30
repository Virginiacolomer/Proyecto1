import { createCrudService } from "../../../../utils/crudFactory";
import { FormValuesFacturaVenta } from "../../../gestion-venta/factura-venta/interfaces/interfaces-validaciones-factura-venta";

const baseService = createCrudService<FormValuesFacturaVenta>("comparacion-importaciones");

const ComparacionImportacionesService = {
  ...baseService,
};

export default ComparacionImportacionesService;
