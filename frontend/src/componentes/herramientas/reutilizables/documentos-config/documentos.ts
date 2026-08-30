import { documentosCompra } from "./documentos-compra";
import { documentosVenta } from "./documentos-venta";

export const documentosConfig = {
  ...documentosVenta,
  ...documentosCompra,
};