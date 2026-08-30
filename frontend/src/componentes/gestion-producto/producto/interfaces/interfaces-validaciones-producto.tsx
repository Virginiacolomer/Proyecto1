import * as yup from "yup";
import { ItemsProdAlternativoEnPayload } from "./interfaces-validaciones-item-prod-alternativo";
import { AlicuotaIva } from "../../../../interfaces/generales/interfaces-generales";
import { Producto } from "../../../../interfaces/gestion-producto/producto/interfaces-producto";
import { ItemProveedor } from "../../../../interfaces/gestion-producto/producto/interfaces-item-proveedor";
import { ItemProdAlternativo } from "../../../../interfaces/gestion-producto/producto/interfaces-item-prod-alternativo";

//===================== interfaces para las cosas que se van a ingresar en el formulario y es necesario validarlas ==========//

export interface FormValues {
  denominacion: string;
  observacion?: string | null;
  codigoProveedor?: string | null;
  codigoReferencia?: string | null;
  codigoBarra?: string | null;
  stock?: number | null;
  costo?: number | null;
  precio?: number | null;
  porcentaje?: number | null;
  /* costoEnDolar?: boolean | null;
  costoDolar?: number | null;
  destacado?: boolean | null;
  envioGratis?: boolean | null; */
  lineaId: number;
  marcaId: number;
  /* subLineaId?: number | null */
  alicuotaIva: number | null;
  /* ubicacion?: string | null;
  presentacionId: number; */
  stockMinimo?: number;
  cantidadPorPack?: number;
  utilizaStockMinimo?: boolean;
  utilizaPack?: boolean;
 /*  porcentajeOcasional: number;
  precioOcasional: number;
  porcentajeMayorista: number;
  precioMayorista: number;
  porcentajeCliente: number;
  precioCliente: number;
  precioOferta: number;*/
 // cantidadOferta?: number;
 // oferta?: boolean; 
}

export interface ItemsProveedorEnPayload {
  codigoProveedor: string;
  proveedorId: number;
  usuarioCreatedId: number;
}

//===================== schema de validacion ============================================//

export const schema = (utilizaStockMinimo: boolean, utilizaPack: boolean, usaOferta: boolean) =>
  yup.object().shape({
    denominacion: yup
      .string()
      .trim()
      .lowercase()
      .required("La denominación es obligatoria.")
      .max(255, "Máximo 255 caracteres.")
      .matches(/^[A-Za-z0-9 %-_"'áéíóúÁÉÍÓÚñÑ./]+$/, "Solo se permiten letras, números y espacios."),
    observacion: yup.string().optional().nullable(),
    codigoProveedor: yup.string().optional().nullable(),
    codigoReferencia: yup.string().optional().nullable(),
    codigoBarra: yup.string().optional().max(255, "Máximo 255 caracteres.").nullable(),
    stock: yup.number().optional().nullable(),
    costo: yup.number().typeError("El costo debe ser un valor númerico").required("El costo es obligatorio").min(0,"El costo debe ser mayor o igual a 0"),
    precio: yup.number().typeError("El precio debe ser un valor númerico").required("El precio es obligatorio").min(0,"El costo debe ser mayor o igual a 0").test("precio-mayor-o-igual-costo","El precio debe ser mayor o igual que el costo", function(value){
      const {costo} = this.parent;
      if (value==null || costo == null ) return true;
      return value>= costo;
    }),
    porcentaje: yup.number().typeError("El porcentaje debe ser un valor númerico").min(0,"El porcentaje mínimo debe ser mayor o igual a 0").max(999, "El porcentaje máximo permitido es de 999").optional().nullable(),
    /* costoEnDolar: yup.boolean().optional().nullable(),
    costoDolar: yup.number().optional().nullable(),
    destacado: yup.boolean().optional().nullable(),
    envioGratis: yup.boolean().optional().nullable(), */
    marcaId: yup
      .number()
      .typeError("La linea es obligatoria.")
      .required("La marca es obligatoria.")
      .transform((value, originalValue) => (originalValue === "" ? null : value)) // Si el valor es una cadena vacía, lo convierte en null.
      .required("La marca es obligatoria."),
    lineaId: yup
      .number()
      .typeError("La marca es obligatoria.")
      .required("La línea es obligatoria.")
      .transform((value, originalValue) => (originalValue === "" ? null : value)) // Si el valor es una cadena vacía, lo convierte en null.
      .required("La linea es obligatoria."),
    alicuotaIva: yup
      .number()
      .oneOf(Object.values(AlicuotaIva), "Alicuota IVA inválida")
      .required("La alícuota IVA es obligatoria.")
      .nullable(),
    /* ubicacion: yup.string().optional().max(255, "Máximo 255 caracteres.").nullable(),
    presentacionId: yup
      .number()
      .typeError("La unidad de medida es obligatoria.")
      .required("La unidad de medida es obligatoria."),
    subLineaId: yup
    .number()
    .typeError("La sublinea es obligatoria.")
    .optional()
    .nullable(), */
    stockMinimo: yup.number().when([], {
      is: () => utilizaStockMinimo,
      then: (schema) => schema.required("El Stock minimo es obligatorio.").moreThan(0, "El stock minimo debe ser mayor a 0."),
      otherwise: (schema) => schema.optional(),
    }),
    cantidadPorPack: yup.number().when([], {
      is: () => utilizaPack,
      then: (schema) => schema.required("La cantidad por pack es obligatoria.").moreThan(0, "La cantidad por pack debe ser mayor a 0."),
      otherwise: (schema) => schema.optional(),
    }),
   /*  cantidadOferta: yup.number().when([], {
      is: () => usaOferta,
      then: (schema) => schema.required("La cantidad de oferta es obligatoria.").moreThan(0, "La cantidad de oferta debe ser mayor a 0."),
      otherwise: (schema) => schema.optional(),
    }), */
    utilizaPack: yup.boolean().optional(),
    utilizaStockMinimo: yup.boolean().optional(),
    /* porcentajeOcasional: yup
      .number()
      .typeError("El porcentaje ocasional es obligatorio.")
      .required("El porcentaje ocasional es obligatorio.")
      .moreThan(0, "El porcentaje ocasional debe ser mayor a 0."),
    porcentajeMayorista: yup
      .number()
      .typeError("El porcentaje mayorista es obligatorio.")
      .required("El porcentaje mayorista es obligatorio.")
      .moreThan(0, "El porcentaje mayorista debe ser mayor a 0."),
    porcentajeCliente: yup
      .number()
      .typeError("El porcentaje cliente es obligatorio.")
      .required("El porcentaje cliente es obligatorio.")
      .moreThan(0, "El porcentaje cliente debe ser mayor a 0."),
    oferta: yup.boolean().optional(),
    precioOcasional: yup
      .number()
      .typeError("El precio ocasional es obligatorio.")
      .required("El precio ocasional es obligatorio."),
    precioMayorista: yup
      .number()
      .typeError("El precio mayorista es obligatorio.")
      .required("El precio mayorista es obligatorio."),
    precioCliente: yup
      .number()
      .typeError("El precio cliente es obligatorio.")
      .required("El precio cliente es obligatorio."),
    precioOferta: yup
      .number()
      .typeError("El precio oferta es obligatorio.")
      .required("El precio oferta es obligatorio."), */
  });

//===================== transform data ============================================//

export const transformData = (producto: Producto): FormValues => {
  return {
    denominacion: producto.denominacion,
    observacion: producto.observacion ?? null,
    codigoProveedor: producto.codigoProveedor ?? "",
    codigoReferencia: producto.codigoReferencia ?? "",
    codigoBarra: producto.codigoBarra ?? null,
    stock: producto.stock ?? null,
    costo: producto.costo ?? null,
    precio: producto.precio ?? null,
    porcentaje: producto.porcentaje ?? null,
   // oferta: producto.oferta ?? null,
    /* costoEnDolar: producto.costoEnDolar ?? null,
    costoDolar: producto.costoDolar ?? null,
    destacado: producto.destacado ?? null,
    
    envioGratis: producto.envioGratis ?? null, */
    alicuotaIva: producto.alicuotaIva ?? null,
   // ubicacion: producto.ubicacion ?? null,
    marcaId: producto.marca.id ?? 0,
    lineaId: producto.linea.id ?? 0,
   /*  subLineaId: producto.sublinea?.id ?? 0,
    presentacionId: producto.presentacion.id ?? 0,
 */
    stockMinimo: producto.stockMinimo ?? null,
    cantidadPorPack: producto.cantidadPorPack ?? null,
    utilizaStockMinimo: producto.utilizaStockMinimo,
    utilizaPack: producto.utilizaPack,
 //   cantidadOferta: producto.cantidadOferta ?? 0,
   /*  porcentajeOcasional: producto.porcentajeOcasional ?? 0,
    porcentajeMayorista: producto.porcentajeMayorista ?? 0,
    porcentajeCliente: producto.porcentajeCliente ?? 0,
    precioOcasional: producto.precioOcasional ?? 0,
    precioMayorista: producto.precioMayorista ?? 0,
    precioCliente: producto.precioCliente ?? 0,
    precioOferta: producto.precioOferta ?? 0,
     */
  };
};

export const transformarItemsProveedor = (items: ItemProveedor[]): ItemsProveedorEnPayload[] => {
  return items.map((item) => ({
    id: item.id,
    codigoProveedor: item.codigoProveedor,
    proveedorId: item.proveedorId,
    usuarioCreatedId: item.usuarioCreatedId,
  }));
};

export const transformarItemsProdAlternativo = (items: ItemProdAlternativo[]): ItemsProdAlternativoEnPayload[] => {
  return items.map((item) => ({
    id: item.id,
    productoAlternativoId: item.productoAlternativoId,
    usuarioCreatedId: item.usuarioCreatedId,
  }));
};
