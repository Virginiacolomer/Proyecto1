import { SelectLinea } from "../linea/interfaces-linea";
import { SelectMarca } from "../marca/interfaces-marca";
import { SelectSublinea } from "../sublinea/interfaces-sublinea";
import { ItemProdAlternativo } from "./interfaces-item-prod-alternativo";
import { ItemProveedor } from "./interfaces-item-proveedor";

export interface Producto {
  //
  id: number;
  denominacion: string;
  codigoProveedor?: string | null;
  codigoReferencia?: string | null;
  codigoBarra?: string | null;
  stock?: number | null;
  alicuotaIva?: number | null;
  //ubicacion?: string | null;
  costo?: number | null;
  precio?: number | null;
  porcentaje?: number | null;
  //fechaCosto?: string | null;
 /*  costoEnDolar: boolean;
  costoDolar?: number | null;
  cotizacionDolar?: number | null;
  fechaCostoDolar?: string | null;
  precioConIva?: number | null;
  fechaPrecio?: string | null;
  fechaPrecioOferta?: string | null;
  destacado?: boolean | null;
  envioGratis?: boolean | null; */
  observacion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioDeletedId?: number | null;
  usuarioUpdatedId: number;
  linea: SelectLinea;
  marca: SelectMarca;
  /* itemsAlternativo?: ItemProdAlternativo[] | null;
  poseeAlternativos: boolean;
  esAlternativo: boolean; */
  sistema: number;
  /* sublinea: SelectSublinea;
  precioOcasionalConIva: number;
  precioMayoristaConIva: number;
  precioClienteConIva: number;
  precioOfertaConIva: number;
  presentacion: SelectPresentacion;
  itemsProveedor?: ItemProveedor[] | null;
 */
  stockMinimo: number;
  cantidadPorPack: number;
  utilizaStockMinimo: boolean;
  utilizaPack: boolean;
 // oferta: boolean;
 // cantidadOferta: number;
 /*  porcentajeOcasional: number;
  porcentajeMayorista: number;
  porcentajeCliente: number;
  porcentajeOferta: number;
  cantidadOferta: number;
  precioOcasional: number;
  precioMayorista: number;
  precioCliente: number;
  precioOferta: number; */
}

export interface ConsultarProducto {
  id: number;
  denominacion: string;
  codigoProveedor: string;
  codigoReferencia: string;
  stock: number;
  precio: number;
  precioOferta: number;
  ubicacion?: string | null;
  poseeAlternativos: boolean;
  esAlternativo: boolean;
  sistema: number;
  precioConIva: number;
  observacion: string;
  proveedor: string;
  precioOcasionalConIva: number;
  precioMayoristaConIva: number;
  precioClienteConIva: number;
  precioOfertaConIva: number;
}


// CR-006 — Actualización masiva de precios.
// Un solo precio por producto (según lo indicado por el profesor); los
// campos de tarifas (Ocasional/Mayorista/Cliente/Oferta) que existían acá
// pertenecen a otra funcionalidad y quedan fuera de esta historia.
export type TipoAjustePrecio = "PORCENTAJE" | "MONTO_FIJO";

export interface FiltroAlcanceCambioPrecios {
  lineaId?: number;
  marcaId?: number;
}

export interface ConsultarProductosCambioPreciosMasivo {
  productoId: number;
  denominacion: string;
  codigoProveedor: string;
  precioActual: number;
  precioNuevo: number;
}

export interface ProductoAumentoFallido {
  productoId: number;
  denominacion: string;
  motivo: string;
}

export interface ResultadoAumentoMasivo {
  loteId: string;
  actualizados: ConsultarProductosCambioPreciosMasivo[];
  fallidos: ProductoAumentoFallido[];
}


export interface SelectProdAlternativos {
  id: number;
  denominacion: string;
  precio: number;
  ubicacion: string;
  stock: number;
  precioConIva: number;
  esAlternativo: boolean;
  codigoProveedor: string;
  codigoProveedorDenominacion: string;
  proveedor: string;
}

export interface ProductoSeleccionado {
  id: number;
  denominacion: string;
  codigoProveedorDenominacion: string;
  codigoProveedor: string;
  codigoReferencia: string;
  ubicacion: string;
  stock: number;
  alicuota: number;
  precio: number;
  precioConIva: number;
  poseeAlternativos: boolean;
  esAlternativo: boolean;
  sistema: number;
  costo: number;
  costoDolar: number;
  observacion: string;
  proveedor: string;
  precioOcasionalConIva: number;
  precioMayoristaConIva: number;
  precioClienteConIva: number;
  precioOfertaConIva: number;
  precioOferta: number;
  precioOcasional: number;
  precioMayorista: number;
  precioCliente: number;
  porcentajeOcasional: number;
  porcentajeMayorista: number;
  porcentajeCliente: number;
  porcentajeOferta: number;
  utilizaPack: boolean;
  cantidadPorPack: number;
  utilizaStockMinimo: boolean;
  stockMinimo: number;
  cantidadOferta: number;
  oferta: boolean;
}

export interface ProductoCombo {
  id: number;
  denominacion: string;
  precio: number;
  cantidad: number; 
}

export const TipoProducto = {
  NACIONAL: 0,
  IMPORTADO: 1,
};

export interface SelectPresentacion {
  id: number;
  denominacion: string;
}


export const TipoPrecioN = {
  OCASIONAL: 0,
  MAYORISTA: 2,
  CLIENTE: 1,
  OFERTA: 3,
  MANUAL: 4,
};

export const TipoPrecioS: Record<number, string> = {
  0: "OCASIONAL",
  2: "MAYORISTA",
  1: "CLIENTE",
  3: "OFERTA",
  4: "MANUAL",
};