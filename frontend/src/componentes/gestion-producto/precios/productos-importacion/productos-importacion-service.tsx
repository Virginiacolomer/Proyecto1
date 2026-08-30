import { createCrudService } from "../../../../utils/crudFactory";
import { FormValuesFacturaVenta } from "../../../gestion-venta/factura-venta/interfaces/interfaces-validaciones-factura-venta";

const baseService = createCrudService<FormValuesFacturaVenta>("productos-importacion");

const ProductosImportacionService = {
  ...baseService,
};

export default ProductosImportacionService;
