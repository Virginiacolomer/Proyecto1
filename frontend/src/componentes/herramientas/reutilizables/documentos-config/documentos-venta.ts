import { Operador, TipoDocumento } from "../../../../interfaces/generales/interfaces-generales";
import ReciboVentaService from "../../../gestion-cobros-pagos/gestion-cobros/recibo-venta/services/recibo-venta-service";
import FacturaVentaService from "../../../gestion-venta/factura-venta/services/factura-venta-service";
import NotaCreditoVentaService from "../../../gestion-venta/nota-credito-venta/services/nota-credito-venta-service";
import NotaDebitoVentaService from "../../../gestion-venta/nota-debito-venta/nota-debito-venta-service";
import PedidoVentaService from "../../../gestion-venta/pedido-venta/services/pedido-venta-service";
import PresupuestoVentaService from "../../../gestion-venta/presupuesto-venta/services/presupuesto-venta-service";

export const documentosVenta = {
  [TipoDocumento.PRESUPUESTO_VENTA]: {
    service: PresupuestoVentaService,
    entidad: "clientes",
    operador: Operador.CLIENTE,
  },
  [TipoDocumento.PEDIDO_VENTA]: {
    service: PedidoVentaService,
    entidad: "clientes",
    operador: Operador.CLIENTE,
  },
  [TipoDocumento.FACTURA_VENTA]: {
    service: FacturaVentaService,
    entidad: "clientes",
    operador: Operador.CLIENTE,
  },
  [TipoDocumento.NOTA_DE_CREDITO_VENTA]: {
    service: NotaCreditoVentaService,
    entidad: "clientes",
    operador: Operador.CLIENTE,
  },
  [TipoDocumento.RECIBO_VENTA]: {
    service: ReciboVentaService,
    entidad: "clientes",
    operador: Operador.CLIENTE,
  },
  [TipoDocumento.NOTA_DE_DEBITO_VENTA]: {
    service: NotaDebitoVentaService,
    entidad: "clientes",
    operador: Operador.CLIENTE,
  },
};
