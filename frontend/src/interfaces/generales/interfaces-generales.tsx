
export interface ConfiguracionSistema {
  id: number;
  empresaId: number;
  precioOferta: boolean;
  caracteresParaBusqueda: number;
  visibleSubTotalNoGravado: boolean;
  visibleSubTotal: boolean;
  visibleIva105: boolean;
  visibleIva21: boolean;
  busquedaInicial: boolean;
  estadisticasProducto: boolean;
  libroCajaUnica: boolean;
  precioConIvaVisible: boolean;
  maximoDolar: number;
  take: number;
  porcentajeAumento: number;
  unidadMedida: boolean;
  costoDolar: boolean;
  ocultarTotalesDocumento: boolean;
  maxDigitosPrecio: number;
  maxDigitosPorcentajePrecioMayorista: number;
  maxDigitosPorcentajePrecio: number;
}

export interface Auditoria {
  id: number;
  detalle: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  usuarioCreated: string;
  usuarioUpdated: string;
  usuarioDeleted: string;
}

export interface CondicionIva {
  id: number;
  denominacion: string;
  requiereCuit: boolean;
  requiereDocumento: boolean;
  letra: string;
  observacion?: string | null;
  sistema: number;
}

export interface ResponsePost {
  mensaje: string;
}


export interface Empresa {
  id: number;
  denominacion: string;
}

export interface PuntoVenta {
  id: number;
  denominacion: string;
}

export const Letra = {
  A: "A",
  B: "B",
  C: "C",
  X: "X",
};

export const LetraPorCondicionIva = {
  A: "responsable inscripto",
  B: ["monotributista", "consumidor final"],
  C: ["exento", "responsable no inscripto", "responsable no categorizado"],
};

export const FormaDePago = {
  CUENTA_CORRIENTE: "CUENTA_CORRIENTE",
  CONTADO: "CONTADO",
};

export const TipoPrecio = {
  OCASIONAL: "OCASIONAL",
  MAYORISTA: "MAYORISTA",
  CLIENTE: "CLIENTE",
  OFERTA: "OFERTA",
  MANUAL: "MANUAL",
};


export const CondicionesIva = {
  RESPONSABLE_INSCRIPTO: "RESPONSABLE INSCRIPTO",
  MONOTRIBUTISTA: "MONOTRIBUTISTA",
  CONSUMIDOR_FINAL: "CONSUMIDOR FINAL",
  EXENTO: "EXENTO",
  RESPONSABLE_NO_INSCRIPTO: "RESPONSABLE NO INSCRIPTO",
  RESPONSABLE_NO_CATEGORIZADO: "RESPONSABLE NO CATEGORIZADO",
};
export const AlicuotaIva = {
  ALICUOTA_0: 0,
  ALICUOTA_105: 10.5,
  ALICUOTA_21: 21,
  ALICUOTA_27: 27,
};

export const PuntosVenta = {
  CASA: 1,
  RESPALDO: 2,
};

export const Estado = {
  ABIERTO: 1,
  CERRADO: 2,
};

export const Orden = {
  ASCENDENTE: 0,
  DESCENDENTE: 1,
};


export const Rol = {
  ADMINISTRADOR: 1,
  EMPLEADO: 2,
  REPOSITOR: 3,
  VENDEDOR: 4,
  ROOT: 5,
  REPARTIDOR: 6,
  COBRADOR: 7,
  COBRADOR2: 8,
};

export const Operador = {
  PROVEEDOR: "PROVEEDOR",
  CLIENTE: "CLIENTE",
};


export const TipoDocumento = {
  //documentos venta
  FACTURA_VENTA: "FACTURA_VENTA",
  NOTA_DE_CREDITO_VENTA: "NOTA_DE_CREDITO_VENTA",
  NOTA_DE_DEBITO_VENTA: "NOTA_DE_DEBITO_VENTA",
  REMITO_VENTA: "REMITO_VENTA",
  RECIBO_VENTA: "RECIBO_VENTA",
  PEDIDO_VENTA: "PEDIDO_VENTA",
  PRESUPUESTO_VENTA: "PRESUPUESTO_VENTA",

  //documentos compra
  FACTURA_COMPRA: "FACTURA_COMPRA",
  NOTA_DE_CREDITO_COMPRA: "NOTA_DE_CREDITO_COMPRA",
  NOTA_DE_DEBITO_COMPRA: "NOTA_DE_DEBITO_COMPRA",
  REMITO_COMPRA: "REMITO_COMPRA",
  ORDEN_DE_PAGO: "ORDEN_DE_PAGO",
  GASTO: "GASTO",
  CARGA_COMPRA: "CARGA_COMPRA",
  PEDIDO_COMPRA: "PEDIDO_COMPRA",

  //documentos Stock
  AJUSTE_STOCK: "AJUSTE_STOCK",

  //Documentos Bancos
  BOLETA_DEPOSITO: "BOLETA_DEPOSITO",

  //Documentos Otros|

  //SinDocumentos

  CAMBIO_PRECIOS: "CAMBIO_PRECIOS",
  CAMBIO_EN_PRODUCTO: "CAMBIO_EN_PRODUCTO",
};


export const AccionPrecios = {
  AUMENTO: "+",
  DESCUENTO: "-",
  IGUAL: "=",
};

export interface Domicilio {
  id: number;
  direccion: string;
  localidad: string;
  localidadId: number;
  provincia: string;
  provinciaId: number;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  usuarioCreatedId: number;
  usuarioUpdatedId: number;
}

export interface Deuda {
  deudaId: number;
  operadorId: number;
  empresaId: number;
  importe: number;
  saldo: number;
  detalle: string;
  tipo: string;
  documentoId: number;
}

export interface SelectCuentaBancaria {
  id: number;
  numeroCuenta: string;
}


export interface SelectEstado {
  id: number;
  denominacion: string;
}

export interface SelectVendedor {
  id: number;
  denominacion: string;
}
