import { createCrudService } from "../../../../utils/crudFactory";
import { FormValuesFacturaVenta } from "../../../gestion-venta/factura-venta/interfaces/interfaces-validaciones-factura-venta";

const baseService = createCrudService<FormValuesFacturaVenta>("lote-importacion");

const ImportacionService = {
  ...baseService,
};

export default ImportacionService;
